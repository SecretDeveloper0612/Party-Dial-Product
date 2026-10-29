const { databases, DATABASE_ID, LEADS_COLLECTION_ID, VENUES_COLLECTION_ID, users } = require('../config/appwrite');
const { ID, Query } = require('node-appwrite');
const { sendLeadNotificationEmail, sendBulkLeadNotificationEmail } = require('../utils/emailService');
const axios = require('axios');
const { isVenueEligible, getBucketLabel } = require('../utils/paxMatcher');

/**
 * Distribute leads bulk logic
 * - finds employees (BDEs) in a pincode
 * - splits the leads array among them
 * - creates lead documents in Appwrite
 */
exports.distributeLeads = async (req, res) => {
    try {
        const { leads, pincode, employeeId } = req.body;

        if (!leads || !Array.isArray(leads) || leads.length === 0) {
            return res.status(400).json({ status: 'error', message: 'No leads provided' });
        }

        let targetEmployees = [];

        // 1. Fetch Target Employees
        if (employeeId) {
            // Manual selection: assign to this one employee
            try {
                const employee = await users.get(employeeId);
                targetEmployees = [employee];
            } catch (err) {
                return res.status(404).json({ status: 'error', message: 'Selected employee not found' });
            }
        } else {
            // Automatic selection: match by Pincode
            if (!pincode) {
                return res.status(400).json({ status: 'error', message: 'Pincode is required for automatic distribution' });
            }
            const userList = await users.list();
            targetEmployees = userList.users.filter(user => {
                const prefs = user.prefs || {};
                const isEmployee = prefs.role === 'BDE' || prefs.role === 'Sales' || prefs.role === 'Manager' || 
                                 prefs.role === 'BDM' || prefs.role === 'Sales Head';
                const matchesPincode = prefs.pincode === pincode;
                const isActive = prefs.status === 'Active';
                return isEmployee && matchesPincode && isActive;
            });
        }

        if (targetEmployees.length === 0) {
            return res.status(404).json({ 
                status: 'error', 
                message: employeeId ? 'Assigned employee is inactive' : `No active employees found for pincode ${pincode}` 
            });
        }

        // 2. Distribute leads evenly
        const distributedResults = [];
        const leadsCount = leads.length;
        const employeeCount = targetEmployees.length;

        for (let i = 0; i < leadsCount; i++) {
            const leadData = leads[i];
            const targetEmployee = targetEmployees[i % employeeCount]; // Round-robin distribution

            // Prepare extra info for the notes field
            const extraInfo = `Bulk Lead | Pincode: ${pincode} | Date: ${leadData.eventDate || 'N/A'}`;

            const rawGuests = leadData.pax || leadData.guests || "0";
            const guestsCount = typeof rawGuests === 'string' 
                ? (parseInt(rawGuests.split('-').pop()) || 0) 
                : (parseInt(rawGuests) || 0);

            // Clean phone number (Max 20 chars)
            const cleanPhone = (leadData.phone || "").toString().replace(/[^0-9+]/g, '').slice(0, 20);

            const leadDoc = {
                venueId: targetEmployee.$id,
                assignedToType: 'employee',
                employeeName: targetEmployee.name,
                name: leadData.name,
                phone: cleanPhone,
                email: leadData.email || '',
                eventType: leadData.eventType || 'Event',
                guests: guestsCount,
                eventDate: leadData.eventDate || '',
                pincode: pincode || '',
                notes: (leadData.notes || '') + ` | Event Date: ${leadData.eventDate || 'N/A'} | Pincode: ${pincode} | City: ${leadData.city || targetEmployee.prefs?.city || 'N/A'} | Bulk: true | ` + extraInfo,
                status: 'New',
                distributedAt: new Date().toISOString(),
                createdAt: new Date().toISOString()
            };

            // Create lead document
            let createdLead;
            try {
                createdLead = await databases.createDocument(
                    DATABASE_ID,
                    LEADS_COLLECTION_ID,
                    ID.unique(),
                    leadDoc
                );
            } catch (err) {
                console.warn("Retrying lead creation with minimal fields:", err.message);
                const fallbackDoc = {
                    venueId: targetEmployee.$id,
                    name: leadData.name,
                    phone: cleanPhone,
                    eventType: leadData.eventType || 'Event',
                    guests: guestsCount,
                    notes: (leadData.notes || '') + ` | Event Date: ${leadData.eventDate || 'N/A'} | ` + extraInfo + " (Staff Assigned)",
                    status: 'New',
                    createdAt: new Date().toISOString()
                };
                createdLead = await databases.createDocument(
                    DATABASE_ID,
                    LEADS_COLLECTION_ID,
                    ID.unique(),
                    fallbackDoc
                );
            }

            distributedResults.push({
                leadId: createdLead.$id,
                assignedTo: targetEmployee.name || targetEmployee.$id,
                role: targetEmployee.prefs?.role,
                pincode: pincode,
                date: createdLead.distributedAt || createdLead.createdAt,
                status: createdLead.status
            });
        }

        return res.status(201).json({
            status: 'success',
            message: `Distributed ${leadsCount} leads across ${employeeCount} employees.`,
            data: distributedResults
        });

    } catch (error) {
        console.error('Error distributing leads:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to distribute leads'
        });
    }
};


/**
 * Get distribution logs & audit trail for Admins
 * Queries the dedicated `lead_distributions` collection with exclusion reasons,
 * delivery statuses, and candidate evaluations.
 */
exports.getDistributionLogs = async (req, res) => {
    try {
        const LEAD_DISTRIBUTIONS_COLLECTION_ID = process.env.APPWRITE_LEAD_DISTRIBUTIONS_COLLECTION_ID || 'lead_distributions';
        const { leadId, venueId, eligibilityResult, deliveryStatus, limit = 100 } = req.query;

        const queries = [
            Query.orderDesc('$createdAt'),
            Query.limit(Math.min(parseInt(limit) || 100, 200))
        ];

        if (leadId) queries.push(Query.equal('leadId', leadId));
        if (venueId) queries.push(Query.equal('venueId', venueId));
        if (eligibilityResult) queries.push(Query.equal('eligibilityResult', eligibilityResult));
        if (deliveryStatus) queries.push(Query.equal('deliveryStatus', deliveryStatus));

        try {
            const auditLogs = await databases.listDocuments(
                DATABASE_ID,
                LEAD_DISTRIBUTIONS_COLLECTION_ID,
                queries
            );

            return res.status(200).json({
                status: 'success',
                total: auditLogs.total,
                data: auditLogs.documents
            });
        } catch (colErr) {
            console.warn('[ADMIN LOGS] lead_distributions query failed or empty, checking legacy logs:', colErr.message);
            // Fallback: list recent leads from LEADS_COLLECTION_ID
            const result = await databases.listDocuments(
                DATABASE_ID,
                LEADS_COLLECTION_ID,
                [Query.orderDesc('$createdAt'), Query.limit(100)]
            );
            return res.status(200).json({
                status: 'success',
                total: result.documents.length,
                data: result.documents.filter(d => 
                    d.notes?.includes('SMART MATCH') || 
                    d.notes?.includes('UNMATCHED') || 
                    d.notes?.includes('Bulk Lead') || 
                    d.notes?.includes('MANUAL DISTRIBUTION')
                )
            });
        }
    } catch (error) {
        console.error('Error fetching distribution logs:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to fetch distribution logs'
        });
    }
};

/**
 * Get leads assigned to a specific user (Employee)
 */
exports.getLeadsForUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.query; // Optional role for logic branching

        if (!userId) {
            return res.status(400).json({ status: 'error', message: 'User ID is required' });
        }

        // Query leads assigned to this user in the 'venueId' field
        const result = await databases.listDocuments(
            DATABASE_ID,
            LEADS_COLLECTION_ID,
            [
                Query.equal('venueId', userId),
                Query.orderDesc('$createdAt'),
                Query.limit(100)
            ]
        );

        return res.status(200).json({
            status: 'success',
            data: result.documents,
            total: result.total
        });
    } catch (error) {
        console.error('Error fetching user leads:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to fetch assigned leads'
        });
    }
};

/**
 * Distribute leads to Venues (Partners)
 * Logic:
 * 1. Filter leads by pincode
 * 2. Find venues in that pincode (excluding free plan)
 * 3. Equal distribution (Round Robin)
 */
exports.distributeLeadsToVenues = async (req, res) => {
    try {
        const { leads, pincode: filterPincode } = req.body;

        if (!leads || !Array.isArray(leads) || leads.length === 0) {
            return res.status(400).json({ status: 'error', message: 'No leads provided' });
        }

        const stats = { distributed: 0, skipped: 0, noVenues: 0 };
        const results = [];

        // Fetch all verified active venues once to save API calls
        const venueResult = await databases.listDocuments(
            DATABASE_ID,
            VENUES_COLLECTION_ID,
            [
                Query.equal('isVerified', true),
                Query.equal('status', 'active'),
                Query.limit(1000)
            ]
        );

        const allVenues = venueResult.documents;
        const venueLeadCounts = {};

        for (const leadData of leads) {
            const leadPincode = (leadData.pincode || filterPincode || "").toString().trim();
            if (!leadPincode) {
                stats.skipped++;
                continue;
            }

            // Filter for pincode matching AND PAX bucket capacity matching
            const targetVenues = allVenues.filter(v => {
                const hasPaidPlan = v.subscriptionPlan && v.subscriptionPlan !== 'free';
                if (!hasPaidPlan) return false;

                // 1. STRICT Pincode Check
                const leadPin = (leadPincode || "").toString().trim();
                const venuePincodes = (v.pincode || "").toString().split(',').map(p => p.trim()).filter(p => p);
                const pinMatch = venuePincodes.some(p => p === leadPin);
                if (!pinMatch) return false;

                // 2. PAX Bucket Capacity Check
                // Venue's capacity bucket must be >= lead's required bucket.
                // E.g. Lead PAX "100-200" → only venues with capacity 200+ are eligible.
                const guestStr = String(leadData.pax || leadData.guests || '0');
                const eligible = isVenueEligible(v.capacity, guestStr);
                if (!eligible) {
                    console.log(`  ❌ GSheet: ${v.venueName} bucket ${getBucketLabel(v.capacity)} too small for "${guestStr}"`);
                }
                return eligible;
            });

            if (targetVenues.length === 0) {
                stats.noVenues++;
                // Still create a 'Broadcast' lead if no venue matches
                await databases.createDocument(
                    DATABASE_ID,
                    LEADS_COLLECTION_ID,
                    ID.unique(),
                    {
                        venueId: 'BROADCAST',
                        name: leadData.name,
                        phone: leadData.phone?.toString() || '',
                        email: leadData.email || '',
                        eventType: leadData.eventType || 'Event',
                        guests: parseInt(leadData.pax) || 0,
                        eventDate: leadData.eventDate || '',
                        pincode: leadPincode || '',
                        notes: (leadData.notes || "") + ` | GSheet Sync | Pincode: ${leadPincode} (No matching venues)`,
                        status: 'New',
                        createdAt: new Date().toISOString()
                    }
                );
                continue;
            }

            // Equal Distribution logic (Round Robin)
            const venueCount = targetVenues.length;
            const targetVenue = targetVenues[stats.distributed % venueCount];

            // Deduplication logic (Don't send same lead to same venue twice)
            try {
                const existing = await databases.listDocuments(
                    DATABASE_ID,
                    LEADS_COLLECTION_ID,
                    [
                        Query.equal('venueId', targetVenue.$id),
                        Query.equal('phone', leadData.phone?.toString().trim() || 'NOMATCH'),
                        Query.limit(1)
                    ]
                );
                if (existing.total > 0) {
                    stats.skipped++;
                    continue; // Skip this lead for this venue
                }
            } catch (dupErr) {
                console.warn('Deduplication check failed, proceeding anyway:', dupErr.message);
            }

            // Safely prepare the document using only verified attributes
            const leadDoc = {
                venueId: targetVenue.$id,
                name: leadData.name,
                phone: leadData.phone?.toString() || '',
                email: leadData.email || '',
                eventType: leadData.eventType || 'Event',
                guests: parseInt(leadData.pax) || 0,
                eventDate: leadData.eventDate || '',
                pincode: leadPincode || '',
                notes: `GSheet Sync | Event Date: ${leadData.eventDate || 'N/A'} | Pin: ${leadPincode} | Area: ${leadData.city || 'N/A'} | ` + (leadData.notes || `Distributed to ${targetVenue.venueName}`),
                status: 'New',
                createdAt: new Date().toISOString()
            };

            await databases.createDocument(
                DATABASE_ID,
                LEADS_COLLECTION_ID,
                ID.unique(),
                leadDoc
            );

            stats.distributed++;
            results.push({ lead: leadData.name, pincode: leadPincode, assignedTo: targetVenue.venueName });

            if (!venueLeadCounts[targetVenue.$id]) {
                venueLeadCounts[targetVenue.$id] = { venue: targetVenue, count: 0 };
            }
            venueLeadCounts[targetVenue.$id].count++;
        }

        for (const vId in venueLeadCounts) {
            const vData = venueLeadCounts[vId];
            if (vData.count > 1) {
                const emailTo = vData.venue.contactEmail || vData.venue.ownerEmail || vData.venue.email;
                if (emailTo) {
                    sendBulkLeadNotificationEmail(emailTo, vData.venue.venueName, vData.count)
                        .catch(err => console.error(`Failed to send bulk lead email to ${emailTo}:`, err.message));
                }
            }
        }

        return res.status(200).json({
            status: 'success',
            message: `Processed ${leads.length} leads. Distributed: ${stats.distributed}, No Venues found: ${stats.noVenues}, Skipped: ${stats.skipped}`,
            data: results
        });

    } catch (error) {
        console.error('Error in distributeLeadsToVenues:', error);
        return res.status(500).json({ status: 'error', message: error.message });
    }
};

/**
 * Manual distribution logic to specific selected venues
 * Bypasses pincode matching and free plan blocks.
 */
exports.distributeLeadsManualVenues = async (req, res) => {
    try {
        const { leads, venueIds } = req.body;

        if (!leads || !Array.isArray(leads) || leads.length === 0) {
            return res.status(400).json({ status: 'error', message: 'No leads provided' });
        }
        if (!venueIds || !Array.isArray(venueIds) || venueIds.length === 0) {
            return res.status(400).json({ status: 'error', message: 'No venues selected' });
        }

        const stats = { distributed: 0, skipped: 0 };
        const results = [];

        // Fetch details for the selected venues
        const targetVenues = [];
        const venueLeadCounts = {};
        for (const vId of venueIds) {
            try {
                const venueDoc = await databases.getDocument(DATABASE_ID, VENUES_COLLECTION_ID, vId);
                if (venueDoc) targetVenues.push(venueDoc);
            } catch (err) {
                console.error(`Failed to fetch venue ${vId}:`, err.message);
            }
        }

        if (targetVenues.length === 0) {
            return res.status(404).json({ status: 'error', message: 'None of the selected venues could be found' });
        }

        for (const leadData of leads) {
            const cleanPhone = leadData.phone?.toString().trim();
            if (!cleanPhone) {
                stats.skipped++;
                continue;
            }

            for (const targetVenue of targetVenues) {
                try {
                    // Check for duplicates (Last 24 hours) for this specific venue
                    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
                    const existing = await databases.listDocuments(DATABASE_ID, LEADS_COLLECTION_ID, [
                        Query.equal('venueId', targetVenue.$id),
                        Query.equal('phone', cleanPhone),
                        Query.greaterThan('$createdAt', yesterday),
                        Query.limit(1)
                    ]);

                    if (existing.total > 0) continue;

                    const leadDoc = {
                        venueId: targetVenue.$id,
                        name: leadData.name || '',
                        phone: cleanPhone,
                        email: leadData.email || '',
                        eventType: leadData.eventType || '',
                        guests: parseInt(String(leadData.pax || '0').replace(/\D/g, ''), 10) || 0,
                        eventDate: leadData.eventDate || '',
                        pincode: leadData.pincode || '',
                        notes: `MANUAL DISTRIBUTION | Distributed to ${targetVenue.venueName} | Event Date: ${leadData.eventDate || 'N/A'} | City: ${leadData.city || 'N/A'} | Pin: ${leadData.pincode || 'N/A'} | ${leadData.notes || ''}`,
                        status: 'New',
                        createdAt: new Date().toISOString()
                    };

                    const doc = await databases.createDocument(
                        DATABASE_ID,
                        LEADS_COLLECTION_ID,
                        ID.unique(),
                        leadDoc
                    );

                    stats.distributed++;
                    results.push({ lead: leadData.name, venue: targetVenue.venueName });

                    if (!venueLeadCounts[targetVenue.$id]) {
                        venueLeadCounts[targetVenue.$id] = { venue: targetVenue, count: 0 };
                    }
                    venueLeadCounts[targetVenue.$id].count++;

                    // Push Notification
                    if (targetVenue.expoPushToken) {
                        const { sendPushNotification } = require('../utils/notifications');
                        sendPushNotification(
                            targetVenue.expoPushToken, 
                            'New Manual Lead Assigned! 🎯', 
                            `${leadData.name} needs a ${leadData.eventType || 'venue'} for ${leadData.pax || '0'} guests.`,
                            { leadId: doc.$id }
                        ).catch(() => {});
                    }
                } catch (err) {
                    console.error(`Failed to manually assign lead ${leadData.name} to ${targetVenue.venueName}:`, err);
                }
            }
        }

        for (const vId in venueLeadCounts) {
            const vData = venueLeadCounts[vId];
            if (vData.count > 1) {
                const emailTo = vData.venue.contactEmail || vData.venue.ownerEmail || vData.venue.email;
                if (emailTo) {
                    sendBulkLeadNotificationEmail(emailTo, vData.venue.venueName, vData.count)
                        .catch(err => console.error(`Failed to send bulk lead email to ${emailTo}:`, err.message));
                }
            }
        }

        return res.status(200).json({
            status: 'success',
            message: `Distributed ${leads.length} leads to ${targetVenues.length} venues. (Total assignments: ${stats.distributed}, Skipped: ${stats.skipped})`,
            data: results
        });

    } catch (error) {
        console.error('Error in distributeLeadsManualVenues:', error);
        return res.status(500).json({ status: 'error', message: error.message });
    }
};
/**
 * Internal helper for GSheet sync
 */
const performGSheetSync = async (sheetUrl, pincodeFilter = null) => {
    let fetchUrl = sheetUrl.trim();
    
    // Support standard viewer links by converting them to export CSV links
    // Handles /d/ID/edit, /d/ID/view, etc.
    if (fetchUrl.includes('docs.google.com/spreadsheets') && !fetchUrl.includes('/export') && !fetchUrl.includes('/pub')) {
        const sheetId = fetchUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
        if (sheetId) {
            fetchUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
        }
    }

    const response = await axios.get(fetchUrl);
    const contentType = response.headers['content-type'] || '';
    
    // If we're getting HTML instead of CSV, it's likely a login page or error
    if (contentType.includes('text/html') || (typeof response.data === 'string' && response.data.trim().startsWith('<!DOCTYPE html>'))) {
        throw new Error('Google Sheet access denied. Ensure the sheet is Public or use "File -> Share -> Publish to web" and use the CSV link.');
    }

    const csvData = response.data;
    if (typeof csvData !== 'string') {
        throw new Error('Invalid data format received from Google Sheets.');
    }
    
    // Simple CSV Parser
    const lines = csvData.split(/\r?\n/).filter(line => line.trim());
    if (lines.length <= 1) return { status: 'success', message: 'Sheet is empty', leads: [] };

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const leads = lines.slice(1).map(line => {
        // More robust CSV splitting using regex to handle quoted commas
        const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
        const cleanValues = values.map(v => v.replace(/^"|"$/g, '').trim());
        
        const lead = {};
        // Map headers to fields
        headers.forEach((header, index) => {
            const val = cleanValues[index] || "";
            if (header.includes('name')) lead.name = val;
            else if (header.includes('phone')) lead.phone = val;
            else if (header.includes('event type')) lead.eventType = val;
            else if (header.includes('event date')) lead.eventDate = val;
            else if (header.includes('pax')) lead.pax = val;
            else if (header.includes('pincode')) lead.pincode = val;
            else if (header.includes('city') || header.includes('location')) lead.city = val;
        });
        return lead;
    }).filter(l => l.name && l.phone);

    // Optional: Filter by pincode
    const filteredLeads = pincodeFilter ? leads.filter(l => (l.pincode || "").toString().trim() === pincodeFilter.toString().trim()) : leads;

    return filteredLeads;
};

exports.performGSheetSync = performGSheetSync;

/**
 * Sync leads from Google Sheet (API endpoint)
 */
exports.syncGoogleSheetLeads = async (req, res) => {
    try {
        const { sheetUrl, pincodeFilter } = req.body;
        if (!sheetUrl) return res.status(400).json({ status: 'error', message: 'Sheet URL or ID is required' });

        const leads = await performGSheetSync(sheetUrl, pincodeFilter);
        
        if (Array.isArray(leads)) {
            req.body.leads = leads;
            return exports.distributeLeadsToVenues(req, res);
        } else {
            return res.status(200).json(leads);
        }

    } catch (error) {
        console.error('Error syncing GSheet:', error);
        return res.status(500).json({ status: 'error', message: error.message || 'Failed to fetch or parse Google Sheet. Ensure it is public or published to web.' });
    }
};
/**
 * Process a public inquiry from the specialized form
 * Performs deep matching: Pincode, Capacity, and Event Type
 */
exports.processPublicInquiry = async (req, res) => {
    try {
        console.log('\n--- ⚡ SMART DISTRIBUTOR: INCOMING INQUIRY ---');
        const { 
            name, 
            email, 
            number, 
            phone,
            eventType, 
            guestCapacity, 
            guestCount,
            guests,
            pincode, 
            eventDate, 
            eventDetails,
            notes,
            leadSource: customLeadSource,
            campaignData,
            utm_source,
            utm_medium,
            utm_campaign,
            utm_content,
            utm_term,
            gclid,
            fbclid,
            location: customLocation
        } = req.body;

        const rawPhone = phone || number;
        const rawGuests = guests !== undefined && guests !== null && guests !== '' ? guests : (guestCount !== undefined && guestCount !== null && guestCount !== '' ? guestCount : guestCapacity);
        const rawLocation = pincode || customLocation;

        if (!name || !rawPhone || !eventType || rawGuests === undefined || rawGuests === null || rawGuests === '' || !rawLocation) {
            console.warn('❌ INQUIRY REJECTED: Missing core fields');
            return res.status(400).json({ status: 'error', message: 'Missing required fields: name, phone/number, eventType, guests, and location/pincode' });
        }

        // 1. Sanitize & Parse Lead Requirements
        const locationInput = rawLocation.toString().trim();
        const pinMatch = locationInput.match(/\b\d{6}\b/);
        const leadPincode = pinMatch ? pinMatch[0] : (/^\d{6}$/.test(locationInput) ? locationInput : '');
        const cleanPhone = rawPhone.toString().replace(/[^0-9]/g, '').slice(-10);

        if (cleanPhone.length !== 10) {
            return res.status(400).json({ status: 'error', message: 'Please provide a valid 10-digit mobile number' });
        }

        // Build campaign attribution object
        const attribution = typeof campaignData === 'object' && campaignData !== null ? campaignData : {};
        if (utm_source) attribution.utm_source = utm_source;
        if (utm_medium) attribution.utm_medium = utm_medium;
        if (utm_campaign) attribution.utm_campaign = utm_campaign;
        if (utm_content) attribution.utm_content = utm_content;
        if (utm_term) attribution.utm_term = utm_term;
        if (gclid) attribution.gclid = gclid;
        if (fbclid) attribution.fbclid = fbclid;

        const isPaidAd = !!(attribution.utm_source || attribution.gclid || attribution.fbclid || (attribution.utm_medium && /cpc|paid|ads/i.test(attribution.utm_medium)));
        const finalLeadSource = customLeadSource || (isPaidAd ? 'Paid Ads' : 'Website Inquiry');
        const serializedCampaign = Object.keys(attribution).length > 0 ? JSON.stringify(attribution).slice(0, 990) : '';
        
        // Handle guest count from manual number input or ranges
        const guestCapStr = String(rawGuests || "0");
        let requestedGuests = 0;
        if (guestCapStr.includes('-')) {
            requestedGuests = parseInt(guestCapStr.split('-').pop()) || 0;
        } else if (guestCapStr.includes('+')) {
            requestedGuests = parseInt(guestCapStr.replace('+', '')) || 5000;
        } else {
            requestedGuests = parseInt(guestCapStr) || 0;
        }

        const extraNotes = notes || eventDetails || '';
        const notesStr = `${finalLeadSource} | Event Date: ${eventDate || 'N/A'} | Location: ${locationInput} | Guests: ${requestedGuests}${extraNotes ? ' | ' + extraNotes : ''}`;

        // 2. Delegate to authoritative Smart Lead Distribution Engine
        const { distributeEventInquiry } = require('../services/leadDistributionService');
        const distributionResult = await distributeEventInquiry({
            name,
            phone: cleanPhone,
            email: email || '',
            eventType,
            guests: requestedGuests,
            eventDate: eventDate || '',
            location: locationInput,
            pincode: leadPincode,
            notes: notesStr,
            leadSource: finalLeadSource,
            campaignData: serializedCampaign
        });

        // 3. Central Admin Email Notification
        if (process.env.ADMIN_EMAIL) {
            sendLeadNotificationEmail(process.env.ADMIN_EMAIL, {
                name,
                number: cleanPhone,
                phone: cleanPhone,
                email,
                eventType,
                guestCapacity: requestedGuests,
                guests: requestedGuests,
                pincode: leadPincode || locationInput,
                location: locationInput,
                eventDate,
                eventDetails: `${notesStr} | Distributed to: ${distributionResult.matchCount} venue(s)`
            }).catch(err => console.error('Failed to send admin public inquiry email:', err.message));
        }

        if (distributionResult.status === 'unmatched') {
            return res.status(200).json({
                status: 'success',
                message: 'Inquiry received. We are matching you with our verified partners shortly.',
                matchCount: 0,
                inquiryId: distributionResult.inquiryId,
                distributionStatus: 'Unmatched'
            });
        }

        return res.status(201).json({
            status: 'success',
            message: `Lead distributed to ${distributionResult.matchCount} matching partner venue(s).`,
            matchCount: distributionResult.matchCount,
            eligibleVenues: distributionResult.eligibleVenues,
            inquiryId: distributionResult.inquiryId,
            distributionStatus: 'Distributed'
        });

    } catch (error) {
        console.error('CRITICAL: Distributor Engine Fault:', error);
        return res.status(500).json({ status: 'error', message: 'Internal server failure' });
    }
};

/**
 * Save partner enquiry from pricing page
 */
exports.savePartnerEnquiry = async (req, res) => {
    try {
        const { name, phone, email, plan, venueName, city, pincode, guestCapacity } = req.body;
        console.log(`[ALARM] Incoming Partner Inquiry: ${name} (${phone}) for ${venueName}`);

        if (!name || !phone) {
            return res.status(400).json({ status: 'error', message: 'Name and Phone are required' });
        }

        const leadDoc = {
            venueId: 'PARTNER_ENQUIRY',
            name: name,
            phone: phone,
            email: email || '',
            eventType: 'Partner Onboarding',
            guests: parseInt(guestCapacity) || 0,
            notes: `Plan: ${plan} | Venue: ${venueName} | City: ${city} | Pin: ${pincode} | Source: Price Page Lead`,
            status: 'New',
            createdAt: new Date().toISOString()
        };

        const result = await databases.createDocument(
            DATABASE_ID,
            LEADS_COLLECTION_ID,
            ID.unique(),
            leadDoc
        );
        console.log(`[SUCCESS] Lead Doc Created: ${result.$id}`);

        return res.status(201).json({
            status: 'success',
            message: 'Partner inquiry saved successfully',
            data: result
        });
    } catch (error) {
        console.error('[ERROR] savePartnerEnquiry:', error);
        return res.status(500).json({ status: 'error', message: error.message });
    }
};

/**
 * Get all price page leads for Admin
 */
exports.getPriceLeads = async (req, res) => {
    try {
        console.log('[DEBUG] Fetching Price Leads from Collection:', LEADS_COLLECTION_ID);
        // Temporarily fetch all recent leads to see if PARTNER_ENQUIRY exists with different casing or properties
        const result = await databases.listDocuments(
            DATABASE_ID,
            LEADS_COLLECTION_ID,
            [
                Query.orderDesc('$createdAt'),
                Query.limit(100)
            ]
        );
        
        console.log(`[DEBUG] Total leads in collection: ${result.total}. Filtering for PARTNER_ENQUIRY...`);
        
        // Filter manually to ensure we find them even if the index/query is having issues
        const partnerLeads = result.documents.filter(d => 
            d.venueId === 'PARTNER_ENQUIRY' || 
            d.source === 'Price Page Lead' || 
            (d.notes && d.notes.includes('Source: Price Page Lead'))
        );

        console.log(`[DEBUG] Found ${partnerLeads.length} Partner Enquiries after manual filter.`);
        
        return res.status(200).json({
            status: 'success',
            results: partnerLeads.length,
            data: partnerLeads
        });
    } catch (error) {
        console.error('[ERROR] getPriceLeads:', error);
        return res.status(500).json({ status: 'error', message: error.message });
    }
};

/**
 * Get all distributed leads for Admin (with Venue details)
 */
exports.getVenueLeadsForAdmin = async (req, res) => {
    try {
        console.log('[INFO] Fetching Venue Leads Check data...');
        // 1. Fetch leads that are NOT partner enquiries
        const result = await databases.listDocuments(
            DATABASE_ID,
            LEADS_COLLECTION_ID,
            [
                Query.orderDesc('$createdAt'),
                Query.limit(500)
            ]
        );

        // Filter out partner enquiries in memory to be safe if 'notEqual' is picky
        const relevantLeads = result.documents.filter(l => l.venueId !== 'PARTNER_ENQUIRY');

        // 2. Fetch ALL venues for name mapping
        const venuesResult = await databases.listDocuments(
            DATABASE_ID,
            VENUES_COLLECTION_ID,
            [Query.limit(1000)]
        );

        const venueMap = {};
        venuesResult.documents.forEach(v => {
            venueMap[v.$id] = v.venueName || v.name || "Unnamed Venue";
        });

        const mappedLeads = relevantLeads.map(l => {
            // Extract pincode and eventDate from notes if missing as separate fields
            let extractedDate = l.eventDate;
            let extractedPin = l.pincode;

            if (l.notes) {
                if (!extractedDate) {
                    const dateMatch = l.notes.match(/Event Date:\s*([^|]+)/i);
                    if (dateMatch) extractedDate = dateMatch[1].trim();
                }
                if (!extractedPin) {
                    // Match 6 digit pin or "Pin: 123456"
                    const pinMatch = l.notes.match(/(?:Pin|Pincode):\s*(\d{6})/i) || l.notes.match(/\| (\d{6}) \|/);
                    if (pinMatch) extractedPin = pinMatch[1];
                }
            }

            return {
                ...l,
                eventDate: extractedDate,
                pincode: extractedPin,
                assignedVenue: venueMap[l.venueId] || (l.venueId === 'BROADCAST' ? 'Broadcast' : 'Unknown Venue')
            };
        });

        return res.status(200).json({
            status: 'success',
            results: mappedLeads.length,
            data: mappedLeads
        });
    } catch (error) {
        console.error('[ERROR] getVenueLeadsForAdmin:', error);
        return res.status(500).json({ status: 'error', message: error.message });
    }
};

/**
 * Re-distribute old/unmatched leads to venues based on PAX bucket + pincode.
 * Fetches all BROADCAST leads + leads with no matched venue and tries to match them now.
 *
 * POST /api/leads/redistribute-old
 * Body: { dryRun: true }  → preview without actually creating documents
 */
exports.redistributeOldLeads = async (req, res) => {
    try {
        const dryRun = req.body?.dryRun === true || req.query?.dryRun === 'true';
        console.log(`\n--- 🔁 REDISTRIBUTE OLD LEADS (dryRun: ${dryRun}) ---`);

        // 1. Fetch all leads (up to 500 most recent)
        const leadsResult = await databases.listDocuments(
            DATABASE_ID,
            LEADS_COLLECTION_ID,
            [Query.orderDesc('$createdAt'), Query.limit(500)]
        );

        // Target leads that weren't properly distributed
        const candidateLeads = leadsResult.documents.filter(l => {
            if (!l.venueId || l.venueId === 'BROADCAST') return true;
            return false;
        });

        console.log(`📋 Found ${candidateLeads.length} unmatched/BROADCAST leads to re-evaluate`);

        if (candidateLeads.length === 0) {
            return res.status(200).json({
                status: 'success',
                message: 'No unmatched leads to redistribute.',
                stats: { evaluated: 0, matched: 0, skipped: 0, dryRun }
            });
        }

        // 2. Fetch all active paid venues once
        const venueResult = await databases.listDocuments(
            DATABASE_ID,
            VENUES_COLLECTION_ID,
            [
                Query.equal('isVerified', true),
                Query.equal('status', 'active'),
                Query.limit(1000)
            ]
        );
        const allVenues = venueResult.documents.filter(v =>
            v.subscriptionPlan && v.subscriptionPlan !== 'free'
        );

        console.log(`🏢 Active paid venues available: ${allVenues.length}`);

        const stats = { evaluated: 0, matched: 0, skipped: 0, noVenue: 0 };
        const results = [];

        for (const lead of candidateLeads) {
            stats.evaluated++;

            // Extract pincode from notes if not stored directly
            let leadPincode = (lead.pincode || '').toString().trim();
            if (!leadPincode) {
                const notePin = (lead.notes || '').match(/Pin[code]*[:\s]+(\d{5,6})/i);
                if (notePin) leadPincode = notePin[1].trim();
            }

            // Extract guest capacity
            const guestsNum = parseInt(lead.guests) || 0;
            const guestStr = guestsNum > 0 ? String(guestsNum) : '0';

            if (!leadPincode || guestsNum === 0) {
                console.log(`  ⚠️ Lead ${lead.$id} (${lead.name}): Missing pincode or guest count — skipping`);
                stats.skipped++;
                results.push({ leadId: lead.$id, name: lead.name, status: 'skipped', reason: 'Missing pincode or guests' });
                continue;
            }

            // 3. Find matching venues using PAX bucket + pincode
            const matchingVenues = allVenues.filter(v => {
                const venuePincodes = (v.pincode || '').toString().split(',').map(p => p.trim()).filter(p => p);
                if (!venuePincodes.includes(leadPincode)) return false;
                return isVenueEligible(v.capacity, guestStr);
            });

            if (matchingVenues.length === 0) {
                console.log(`  ❌ Lead "${lead.name}" (Pin: ${leadPincode}, PAX: ${guestsNum}) — no matching venues`);
                stats.noVenue++;
                results.push({ leadId: lead.$id, name: lead.name, pincode: leadPincode, guests: guestsNum, status: 'no_venue', assignedTo: [] });
                continue;
            }

            const finalVenues = matchingVenues.slice(0, 5);
            const assignedNames = [];

            if (!dryRun) {
                for (const v of finalVenues) {
                    // Deduplication
                    try {
                        const existing = await databases.listDocuments(
                            DATABASE_ID,
                            LEADS_COLLECTION_ID,
                            [
                                Query.equal('venueId', v.$id),
                                Query.equal('phone', lead.phone || 'NOMATCH'),
                                Query.limit(1)
                            ]
                        );
                        if (existing.total > 0) {
                            console.log(`  ⏭️ Skipping duplicate: ${v.venueName} already has ${lead.phone}`);
                            continue;
                        }
                    } catch (dupErr) {
                        console.warn('Dedup check failed, proceeding:', dupErr.message);
                    }

                    try {
                        await databases.createDocument(
                            DATABASE_ID,
                            LEADS_COLLECTION_ID,
                            ID.unique(),
                            {
                                venueId: v.$id,
                                name: lead.name,
                                phone: lead.phone || '',
                                email: lead.email || '',
                                eventType: lead.eventType || 'Event',
                                guests: guestsNum,
                                notes: `[REDISTRIBUTED] Original: ${lead.$id} | Pin: ${leadPincode} | PAX: ${guestsNum} | ${lead.notes || ''}`.slice(0, 990),
                                status: 'New',
                                createdAt: new Date().toISOString()
                            }
                        );
                        assignedNames.push(v.venueName);
                        console.log(`  ✅ Redistributed "${lead.name}" → ${v.venueName} (${getBucketLabel(v.capacity)})`);
                    } catch (createErr) {
                        console.error(`  ❌ Failed to create lead for ${v.venueName}:`, createErr.message);
                    }
                }
            } else {
                finalVenues.forEach(v => assignedNames.push(v.venueName));
                console.log(`  🔍 DRY RUN: "${lead.name}" (Pin: ${leadPincode}, PAX: ${guestsNum}) → [${assignedNames.join(', ')}]`);
            }

            if (assignedNames.length > 0) {
                stats.matched++;
                
                // 4. Update the original lead document to reflect distribution (if not dryRun)
                if (!dryRun) {
                    try {
                        const updatedNotes = `✅ [DISTRIBUTED] to: ${assignedNames.join(', ')} | ${lead.notes || ''}`.slice(0, 995);
                        await databases.updateDocument(DATABASE_ID, LEADS_COLLECTION_ID, lead.$id, {
                            notes: updatedNotes,
                            status: 'Contacted' // Move from New to Contacted to show it's been processed
                        });
                    } catch (updateErr) {
                        console.error(`  ❌ Failed to update original lead ${lead.$id} with distribution info:`, updateErr.message);
                    }
                }

                results.push({
                    leadId: lead.$id, name: lead.name, pincode: leadPincode, guests: guestsNum,
                    status: dryRun ? 'would_distribute' : 'distributed',
                    assignedTo: assignedNames
                });
            } else {
                stats.noVenue++;
                results.push({ leadId: lead.$id, name: lead.name, pincode: leadPincode, guests: guestsNum, status: 'no_venue_after_dedup', assignedTo: [] });
            }
        }

        console.log(`\n🏁 REDISTRIBUTION COMPLETE: Evaluated: ${stats.evaluated} | Matched: ${stats.matched} | No Venue: ${stats.noVenue} | Skipped: ${stats.skipped}\n`);

        return res.status(200).json({
            status: 'success',
            message: dryRun
                ? `DRY RUN: Would distribute ${stats.matched} leads to venues.`
                : `Redistributed ${stats.matched} leads to matching venues.`,
            stats: { ...stats, dryRun },
            results
        });
    } catch (error) {
        console.error('[ERROR] redistributeOldLeads:', error);
        return res.status(500).json({ status: 'error', message: error.message });
    }
};

/**
 * Check Maximum Venue Capacity for a specific location / pincode & event type
 * GET /api/leads/check-capacity?location=...&guests=...&eventType=...
 */
exports.checkLocationCapacity = async (req, res) => {
    try {
        const { location, pincode, guests, eventType } = req.query;
        const requestedGuests = parseInt(guests) || 0;
        const locationQuery = (location || pincode || '').toString().trim();

        if (!locationQuery && !requestedGuests) {
            return res.status(200).json({ status: 'success', maxCapacity: 7000, hasCapacity: true });
        }

        const pinMatch = locationQuery.match(/\b\d{6}\b/);
        const targetPin = pinMatch ? pinMatch[0] : (/^\d{6}$/.test(locationQuery) ? locationQuery : '');
        const locLower = locationQuery.toLowerCase();

        // Fetch registered active venues
        const venueResult = await databases.listDocuments(
            DATABASE_ID,
            VENUES_COLLECTION_ID,
            [
                Query.equal('isVerified', true),
                Query.equal('status', 'active'),
                Query.limit(1000)
            ]
        );

        // Filter by location
        let matchedVenues = venueResult.documents.filter(v => {
            const vPin = (v.pincode || '').toString().trim();
            const vCity = (v.city || '').toLowerCase();
            const vAddress = (v.address || '').toLowerCase();
            const vLandmark = (v.landmark || '').toLowerCase();

            if (targetPin && vPin === targetPin) return true;
            if (vCity && (locLower.includes(vCity) || vCity.includes(locLower))) return true;
            if (vAddress && locLower.includes(vAddress)) return true;
            if (vLandmark && locLower.includes(vLandmark)) return true;
            return false;
        });

        // If no venues found strictly by that location query, fallback to all venues
        const venuesPool = matchedVenues.length > 0 ? matchedVenues : venueResult.documents;
        const isLocationSpecific = matchedVenues.length > 0;

        const capacities = venuesPool
            .map(v => parseInt(v.capacity) || 0)
            .filter(c => c > 0);

        const maxCap = capacities.length > 0 ? Math.max(...capacities) : 7000;
        const hasCapacity = requestedGuests <= maxCap;

        return res.status(200).json({
            status: 'success',
            location: locationQuery,
            isLocationSpecific,
            venuesCount: venuesPool.length,
            maxCapacity: maxCap,
            requestedGuests,
            hasCapacity,
            message: !hasCapacity 
                ? (isLocationSpecific 
                    ? `In ${locationQuery}, our platform does not have any venue with a capacity of ${requestedGuests} guests (maximum available capacity in this location is ${maxCap.toLocaleString('en-IN')} guests).`
                    : `Our platform does not have any venue with a capacity of ${requestedGuests} guests (maximum available capacity is ${maxCap.toLocaleString('en-IN')} guests).`
                  )
                : 'Capacity available'
        });

    } catch (error) {
        console.error('Error in checkLocationCapacity:', error);
        return res.status(500).json({ status: 'error', message: error.message });
    }
};
