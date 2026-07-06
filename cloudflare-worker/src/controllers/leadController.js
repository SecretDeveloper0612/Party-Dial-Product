import { ID, Query } from 'node-appwrite';
import { getAppwriteServices } from '../utils/appwrite';
import { isVenueEligible, getBucketLabel } from '../utils/paxMatcher';

export const distributeLeads = async (c) => {
    try {
        const body = await c.req.json().catch(() => ({}));
        const { leads, pincode, employeeId } = body;
        if (!leads || !Array.isArray(leads) || leads.length === 0) return c.json({ status: 'error', message: 'No leads provided' }, 400);

        const { users, databases, databaseId, collections } = getAppwriteServices(c.env);
        let targetEmployees = [];

        if (employeeId) {
            try { targetEmployees = [await users.get(employeeId)]; } catch (err) { return c.json({ status: 'error', message: 'Employee not found' }, 404); }
        } else {
            if (!pincode) return c.json({ status: 'error', message: 'Pincode is required' }, 400);
            const userList = await users.list();
            targetEmployees = userList.users.filter(user => {
                const prefs = user.prefs || {};
                return ['BDE', 'Sales', 'Manager', 'BDM', 'Sales Head'].includes(prefs.role) && prefs.pincode === pincode && prefs.status === 'Active';
            });
        }

        if (targetEmployees.length === 0) return c.json({ status: 'error', message: 'No active employees found' }, 404);

        const distributedResults = [];
        for (let i = 0; i < leads.length; i++) {
            const leadData = leads[i];
            const targetEmployee = targetEmployees[i % targetEmployees.length];
            const guestsCount = parseInt(String(leadData.pax || leadData.guests || "0").split('-').pop()) || 0;
            const cleanPhone = (leadData.phone || "").toString().replace(/[^0-9+]/g, '').slice(0, 20);

            const doc = await databases.createDocument(databaseId, collections.leads, ID.unique(), {
                venueId: targetEmployee.$id, assignedToType: 'employee', employeeName: targetEmployee.name,
                name: leadData.name, phone: cleanPhone, email: leadData.email || '', eventType: leadData.eventType || 'Event', guests: guestsCount,
                eventDate: leadData.eventDate || '', pincode: pincode || '', notes: (leadData.notes || '') + ` | Bulk Lead`,
                status: 'New', distributedAt: new Date().toISOString(), createdAt: new Date().toISOString()
            });

            distributedResults.push({ leadId: doc.$id, assignedTo: targetEmployee.name, status: doc.status });
        }
        return c.json({ status: 'success', data: distributedResults }, 201);
    } catch (error) {
        return c.json({ status: 'error', message: error.message }, 500);
    }
};

export const getDistributionLogs = async (c) => {
    try {
        const { databases, databaseId, collections } = getAppwriteServices(c.env);
        const result = await databases.listDocuments(databaseId, collections.leads, [Query.orderDesc('$createdAt'), Query.limit(100)]);
        const logs = result.documents.filter(d => d.isBulk || (d.notes && d.notes.includes('Bulk Lead')));
        return c.json({ status: 'success', data: logs }, 200);
    } catch (error) {
        return c.json({ status: 'error', message: error.message }, 500);
    }
};

export const getLeadsForUser = async (c) => {
    try {
        const userId = c.req.param('userId');
        const { databases, databaseId, collections } = getAppwriteServices(c.env);
        const result = await databases.listDocuments(databaseId, collections.leads, [Query.equal('venueId', userId), Query.orderDesc('$createdAt'), Query.limit(100)]);
        return c.json({ status: 'success', data: result.documents, total: result.total }, 200);
    } catch (error) {
        return c.json({ status: 'error', message: error.message }, 500);
    }
};

export const distributeLeadsToVenues = async (c) => {
    try {
        const body = await c.req.json().catch(() => ({}));
        const { leads, pincode: filterPincode } = body;
        if (!leads || !Array.isArray(leads) || leads.length === 0) return c.json({ status: 'error', message: 'No leads provided' }, 400);

        const { databases, databaseId, collections } = getAppwriteServices(c.env);
        const venueResult = await databases.listDocuments(databaseId, collections.venues, [Query.equal('isVerified', true), Query.equal('status', 'active'), Query.limit(1000)]);
        const allVenues = venueResult.documents;
        const results = [];
        let distributed = 0;

        for (const leadData of leads) {
            const leadPincode = (leadData.pincode || filterPincode || "").toString().trim();
            if (!leadPincode) continue;

            const targetVenues = allVenues.filter(v => {
                if (!v.subscriptionPlan || v.subscriptionPlan === 'free') return false;
                const venuePincodes = (v.pincode || "").toString().split(',').map(p => p.trim());
                if (!venuePincodes.includes(leadPincode)) return false;
                return isVenueEligible(v.capacity, leadData.pax || leadData.guests);
            });

            if (targetVenues.length > 0) {
                const targetVenue = targetVenues[distributed % targetVenues.length];
                await databases.createDocument(databaseId, collections.leads, ID.unique(), {
                    venueId: targetVenue.$id, name: leadData.name, phone: leadData.phone?.toString() || '',
                    email: leadData.email || '', eventType: leadData.eventType || 'Event', guests: parseInt(leadData.pax) || 0,
                    pincode: leadPincode, notes: 'GSheet Sync', status: 'New', createdAt: new Date().toISOString()
                });
                distributed++;
                results.push({ lead: leadData.name, assignedTo: targetVenue.venueName });
            }
        }
        return c.json({ status: 'success', data: results }, 200);
    } catch (error) {
        return c.json({ status: 'error', message: error.message }, 500);
    }
};

export const syncGoogleSheetLeads = async (c) => {
    try {
        const body = await c.req.json().catch(() => ({}));
        const { sheetUrl, pincodeFilter } = body;
        if (!sheetUrl) return c.json({ status: 'error', message: 'Sheet URL required' }, 400);
        
        let fetchUrl = sheetUrl.trim();
        if (fetchUrl.includes('docs.google.com/spreadsheets') && !fetchUrl.includes('/export')) {
            const sheetId = fetchUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
            if (sheetId) fetchUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
        }

        const response = await fetch(fetchUrl);
        const csvData = await response.text();
        const lines = csvData.split(/\r?\n/).filter(line => line.trim());
        if (lines.length <= 1) return c.json({ status: 'success', leads: [] }, 200);

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const leads = lines.slice(1).map(line => {
            const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
            const lead = {};
            headers.forEach((h, i) => {
                const val = (values[i] || "").replace(/^"|"$/g, '').trim();
                if (h.includes('name')) lead.name = val;
                else if (h.includes('phone')) lead.phone = val;
                else if (h.includes('pax')) lead.pax = val;
                else if (h.includes('pincode')) lead.pincode = val;
            });
            return lead;
        }).filter(l => l.name && l.phone);

        return c.json({ status: 'success', data: leads }, 200);
    } catch (error) {
        return c.json({ status: 'error', message: error.message }, 500);
    }
};

export const processPublicInquiry = async (c) => {
    return c.json({ status: 'success', message: 'Public inquiry processed' }, 200);
};

export const savePartnerEnquiry = async (c) => {
    try {
        const body = await c.req.json().catch(() => ({}));
        const { databases, databaseId, collections } = getAppwriteServices(c.env);
        
        const { name, phone, email, plan, venueName, city, pincode, guestCapacity } = body;
        
        const result = await databases.createDocument(databaseId, collections.leads, ID.unique(), {
            venueId: 'PARTNER_ENQUIRY', 
            name: name || '', 
            phone: phone || '', 
            email: email || '',
            eventType: 'Partner Onboarding',
            guests: parseInt(guestCapacity) || 0,
            notes: `Plan: ${plan || 'N/A'} | Venue: ${venueName || 'N/A'} | City: ${city || 'N/A'} | Pin: ${pincode || 'N/A'} | Source: Price Page Lead`,
            status: 'New', 
            createdAt: new Date().toISOString()
        });
        return c.json({ status: 'success', data: result }, 201);
    } catch (error) {
        return c.json({ status: 'error', message: error.message }, 500);
    }
};

export const getPriceLeads = async (c) => {
    try {
        const { databases, databaseId, collections } = getAppwriteServices(c.env);
        const result = await databases.listDocuments(databaseId, collections.leads, [Query.orderDesc('$createdAt'), Query.limit(100)]);
        const partnerLeads = result.documents.filter(d => d.venueId === 'PARTNER_ENQUIRY');
        return c.json({ status: 'success', data: partnerLeads }, 200);
    } catch (error) {
        return c.json({ status: 'error', message: error.message }, 500);
    }
};

export const getVenueLeadsForAdmin = async (c) => {
    try {
        const { databases, databaseId, collections } = getAppwriteServices(c.env);
        const result = await databases.listDocuments(databaseId, collections.leads, [Query.orderDesc('$createdAt'), Query.limit(100)]);
        return c.json({ status: 'success', data: result.documents }, 200);
    } catch (error) {
        return c.json({ status: 'error', message: error.message }, 500);
    }
};

export const redistributeOldLeads = async (c) => {
    return c.json({ status: 'success', message: 'Not implemented' }, 200);
};
