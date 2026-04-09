const { databases, DATABASE_ID, LEADS_COLLECTION_ID, users } = require('../config/appwrite');
const { ID, Query } = require('node-appwrite');

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
                venueId: targetEmployee.$id, // Repurposing venueId as assignedUserId for employee dashboard
                assignedToType: 'employee',
                employeeName: targetEmployee.name,
                name: leadData.name,
                phone: cleanPhone,
                email: leadData.email || '',
                eventType: leadData.eventType || 'Event',
                guests: guestsCount,
                notes: (leadData.notes || '') + " " + extraInfo,
                status: 'New',
                pincode: pincode,
                city: leadData.city || targetEmployee.prefs?.city || '',
                isBulk: true,
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
                    notes: (leadData.notes || '') + " " + extraInfo + " (Staff Assigned)",
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
 * Get distribution logs (leads marked as isBulk)
 */
exports.getDistributionLogs = async (req, res) => {
    try {
        let logs;
        try {
            logs = await databases.listDocuments(
                DATABASE_ID,
                LEADS_COLLECTION_ID,
                [
                    Query.equal('isBulk', true),
                    Query.orderDesc('$createdAt'),
                    Query.limit(100)
                ]
            );
        } catch (e) {
            console.warn("isBulk query failed, falling back to basic list:", e.message);
            // Fallback: list recent leads and filter in memory if attribute doesn't exist
            const result = await databases.listDocuments(
                DATABASE_ID,
                LEADS_COLLECTION_ID,
                [Query.orderDesc('$createdAt'), Query.limit(100)]
            );
            return res.status(200).json({
                status: 'success',
                data: result.documents.filter(d => d.isBulk || d.notes?.includes('Bulk Lead'))
            });
        }

        return res.status(200).json({
            status: 'success',
            data: logs.documents
        });
    } catch (error) {
        console.error('Error fetching distribution logs:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to fetch logs'
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
