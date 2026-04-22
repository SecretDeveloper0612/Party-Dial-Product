const { databases, DATABASE_ID, LEADS_COLLECTION_ID, VENUES_COLLECTION_ID, users } = require('../config/appwrite');
const { ID, Query } = require('node-appwrite');
const { sendLeadNotificationEmail } = require('../utils/emailService');
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
                data: result.documents.filter(d => d.isBulk || d.notes?.includes('Bulk Lead') || d.notes?.includes('GSheet Sync'))
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
            eventType, 
            guestCapacity, 
            pincode, 
            eventDate, 
            eventDetails 
        } = req.body;

        if (!name || !number || !eventType || !guestCapacity || !pincode) {
            console.warn('❌ INQUIRY REJECTED: Missing core fields');
            return res.status(400).json({ status: 'error', message: 'Missing required fields' });
        }

        // 1. Sanitize & Parse Lead Requirements
        const leadPincode = pincode.toString().replace(/\s/g, '').trim();
        const cleanPhone = number.toString().replace(/[^0-9]/g, '').slice(-10);
        
        // Handle guest capacity ranges (e.g., "0-50", "50-100", "5000+")
        const guestCapStr = String(guestCapacity || "0");
        let requestedGuests = 0;
        if (guestCapStr.includes('-')) {
            requestedGuests = parseInt(guestCapStr.split('-').pop()) || 0;
        } else if (guestCapStr.includes('+')) {
            requestedGuests = parseInt(guestCapStr.replace('+', '')) || 5000;
        } else {
            requestedGuests = parseInt(guestCapStr) || 0;
        }

        console.log(`📍 TARGET AREA: ${leadPincode} | 👥 GUESTS: ${requestedGuests} | 👤 NAME: ${name}`);

        // 2. Fetch Potential Partners WITH DATABASE-LEVEL PINCODE FILTER
        // This is the most reliable way to prevent cross-pincode leaks.
        const query = [
            Query.equal('isVerified', true),
            Query.equal('status', 'active'),
            Query.equal('onboardingComplete', true),
            Query.limit(1000)
        ];

        // If your database stores pincode as a single string field, use this:
        query.push(Query.equal('pincode', leadPincode));

        const venueResult = await databases.listDocuments(
            DATABASE_ID,
            VENUES_COLLECTION_ID,
            query
        );

        const localVenues = venueResult.documents;
        console.log(`🔎 Database returned ${localVenues.length} qualified partners in Pin: ${leadPincode}`);

        // 3. Secondary Precise Matching (Guest Capacity & Subscription)
        const matchedVenues = localVenues.filter(v => {
            // A. Subscription Check
            const isPaid = (v.subscriptionPlan && v.subscriptionPlan !== 'free') || v.isPaid === true;
            if (!isPaid) {
                console.log(`  - ❌ ${v.venueName}: Not on a paid plan`);
                return false;
            }

            // B. PAX Bucket Capacity Check
            // Venue bucket max must be >= lead bucket max.
            // Example: Lead "100-200" → venues with 100-200, 200-500, 500-1000 etc. are eligible
            //          Venues with 0-50 or 50-100 are NOT eligible.
            const eligible = isVenueEligible(v.capacity, guestCapacity);
            if (!eligible) {
                console.log(`  - ❌ ${v.venueName}: Capacity ${v.capacity} (${getBucketLabel(v.capacity)}) too small for "${guestCapacity}" guests`);
                return false;
            }

            console.log(`  - ✅ ${v.venueName}: Matches Pin ${leadPincode} | Capacity ${v.capacity} (${getBucketLabel(v.capacity)}) handles "${guestCapacity}"`);
            return true;
        });

        // 4. Final Distribution Pool (Max 5 Vendors)
        const MAX_DISTRIBUTION = 5;
        const finalizedVenues = matchedVenues
            .sort(() => 0.5 - Math.random()) // Randomize for fairness
            .slice(0, MAX_DISTRIBUTION);

        console.log(`✅ MATCH SNAPSHOT: Found ${matchedVenues.length} partners | Distributing to ${finalizedVenues.length}\n`);

        // 5. Broadcast Fallback
        if (finalizedVenues.length === 0) {
            console.log('⚠️ FALLBACK: No perfect local matches. Routing to Global ADMIN review pool.');
            await databases.createDocument(DATABASE_ID, LEADS_COLLECTION_ID, ID.unique(), {
                venueId: 'BROADCAST',
                name,
                phone: cleanPhone,
                email: email || '',
                eventType,
                guests: requestedGuests,
                notes: `BROADCAST | Event Date: ${eventDate || 'N/A'} | Pin: ${leadPincode} | Guests: ${requestedGuests} | Details: ${eventDetails || 'N/A'}`,
                status: 'New',
                createdAt: new Date().toISOString()
            });

            return res.status(200).json({ 
                status: 'success', 
                message: 'Inquiry received. Matching you with our partners shortly.',
                matchCount: 0 
            });
        }

        // 6. Create Lead Documents for Selected Partners
        const leadTasks = finalizedVenues.map(async (v) => {
            try {
                // Check for duplicates (Last 24 hours)
                const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
                const existing = await databases.listDocuments(DATABASE_ID, LEADS_COLLECTION_ID, [
                    Query.equal('venueId', v.$id),
                    Query.equal('phone', cleanPhone),
                    Query.greaterThan('$createdAt', yesterday),
                    Query.limit(1)
                ]);

                if (existing.total > 0) return null;

                const doc = await databases.createDocument(DATABASE_ID, LEADS_COLLECTION_ID, ID.unique(), {
                    venueId: v.$id,
                    name,
                    phone: cleanPhone,
                    email: email || '',
                    eventType,
                    guests: requestedGuests,
                    notes: `SMART MATCH | Event Date: ${eventDate || 'N/A'} | Pin: ${leadPincode} | Local Partner | Guests: ${requestedGuests}`,
                    status: 'New',
                    createdAt: new Date().toISOString()
                });

                // Push Notification
                if (v.expoPushToken) {
                    const { sendPushNotification } = require('../utils/notifications');
                    sendPushNotification(
                        v.expoPushToken, 
                        'New Party Inquiry! 🎊', 
                        `${name} needs a ${eventType} venue for ${requestedGuests} guests in ${leadPincode}.`,
                        { leadId: doc.$id }
                    ).catch(() => {});
                }

                /* 
                // RELIABLE COUNT: SYNC DISABLED DUE TO SCHEMA LIMITS
                try {
                    const leadCountRes = await databases.listDocuments(
                        DATABASE_ID,
                        LEADS_COLLECTION_ID,
                        [Query.equal('venueId', v.$id), Query.limit(1)]
                    );
                    
                    await databases.updateDocument(
                        DATABASE_ID,
                        VENUES_COLLECTION_ID || '6783857500366eb7b9b4',
                        v.$id,
                        {
                            totalLeads: leadCountRes.total
                        }
                    );
                    console.log(`[SYNC] Updated venue ${v.$id} leads count to ${leadCountRes.total}`);
                } catch (updateErr) {
                    console.error(`Failed to sync lead count for venue ${v.$id}:`, updateErr.message);
                }
                */

                return doc;
            } catch (err) {
                console.error(`Failed distributing to ${v.venueName}:`, err.message);
                return null;
            }
        });

        const successes = (await Promise.all(leadTasks)).filter(t => t !== null).length;
        console.log(`🏁 FINISHED: Distributed to ${successes} partners.\n`);

        // --- 📩 CENTRAL EMAIL NOTIFICATION ---
        // Notify admin about the new public inquiry
        if (process.env.ADMIN_EMAIL) {
            sendLeadNotificationEmail(process.env.ADMIN_EMAIL, {
                name,
                number,
                email,
                eventType,
                guestCapacity,
                pincode: leadPincode,
                eventDate,
                eventDetails
            }).catch(err => console.error('Failed to send admin public inquiry email:', err.message));
        }

        return res.status(201).json({
            status: 'success',
            message: `Lead distributed to ${successes} matching partners.`,
            matchCount: successes
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

        const mappedLeads = relevantLeads.map(l => ({
            ...l,
            assignedVenue: venueMap[l.venueId] || (l.venueId === 'BROADCAST' ? 'Broadcast' : 'Unknown Venue')
        }));

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
