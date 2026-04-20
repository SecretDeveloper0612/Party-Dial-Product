const { databases, DATABASE_ID, VENUES_COLLECTION_ID, LEADS_COLLECTION_ID, REVIEWS_COLLECTION_ID } = require('../config/appwrite');
const { ID, Query } = require('node-appwrite');
const { sendPushNotification } = require('../utils/notifications');
const { sendProfileStatusEmail, sendLeadNotificationEmail } = require('../utils/emailService');
const { isVenueEligible, getBucketLabel, getLeadBucketMax } = require('../utils/paxMatcher');


// Get all venues
exports.getAllVenues = async (req, res) => {
    try {
        const { verified, city } = req.query;
        const queries = [Query.orderDesc('$createdAt')];

        if (verified === 'true') {
            queries.push(Query.equal('isVerified', true));
            queries.push(Query.equal('status', 'active'));
        }

        if (city) {
            queries.push(Query.equal('city', city));
        }

        const venues = await databases.listDocuments(
            DATABASE_ID,
            VENUES_COLLECTION_ID,
            queries
        );

        if (venues.documents.length > 0) {
            console.log(`[DEBUG] Full Venue Doc Sample:`, JSON.stringify(venues.documents[0], null, 2));
        }

        let docs = venues.documents;

        // Return all documents — ranking/filtering is handled on the client.
        // The client splits venues into premium (paid+complete) and others (free, always shown at bottom).

        return res.status(200).json({
            status: 'success',
            results: docs.length,
            data: docs
        });
    } catch (error) {
        console.error('Error fetching venues:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Error occurred while fetching venues'
        });
    }
};

// Approve a venue listing (set isVerified: true, status: 'active')
exports.approveVenue = async (req, res) => {
    try {
        const { id } = req.params;
        // Fetch current doc to check for missing required fields (like capacity)
        const currentDoc = await databases.getDocument(DATABASE_ID, VENUES_COLLECTION_ID, id);
        
        const updatePayload = { isVerified: true, status: 'active' };
        // If capacity is missing (required in new schema), add a default
        if (currentDoc.capacity === undefined || currentDoc.capacity === null || currentDoc.capacity < 1) {
            updatePayload.capacity = 1;
        }

        const updated = await databases.updateDocument(
            DATABASE_ID,
            VENUES_COLLECTION_ID,
            id,
            updatePayload
        );

        // Send Approval Email (Non-blocking but logged)
        if (updated.contactEmail) {
            sendProfileStatusEmail(updated.contactEmail, updated.ownerName || updated.venueName, true)
                .then(() => console.log(`Approval email triggered for ${updated.contactEmail}`))
                .catch(err => console.error(`Failed to send approval email to ${updated.contactEmail}:`, err.message));
        }

        return res.status(200).json({
            status: 'success',
            message: 'Venue approved and activated successfully',
            data: updated
        });
    } catch (error) {
        console.error('Error approving venue:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Error approving venue'
        });
    }
};

// Reject a venue listing (set isVerified: false, status: 'rejected')
exports.rejectVenue = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        // Fetch current doc to check for missing required fields (like capacity)
        const currentDoc = await databases.getDocument(DATABASE_ID, VENUES_COLLECTION_ID, id);
        
        const updatePayload = { isVerified: false, status: 'rejected' };
        // If capacity is missing (required in new schema), add a default
        if (currentDoc.capacity === undefined || currentDoc.capacity === null || currentDoc.capacity < 1) {
            updatePayload.capacity = 1;
        }

        const updated = await databases.updateDocument(
            DATABASE_ID,
            VENUES_COLLECTION_ID,
            id,
            updatePayload
        );

        // Send Rejection Email (Non-blocking but logged)
        if (updated.contactEmail) {
            sendProfileStatusEmail(updated.contactEmail, updated.ownerName || updated.venueName, false, reason || 'Profile does not meet our guidelines.')
                .then(() => console.log(`Rejection email triggered for ${updated.contactEmail}`))
                .catch(err => console.error(`Failed to send rejection email to ${updated.contactEmail}:`, err.message));
        }

        return res.status(200).json({
            status: 'success',
            message: 'Venue listing rejected',
            data: updated,
            reason: reason || ''
        });
    } catch (error) {
        console.error('Error rejecting venue:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Error rejecting venue'
        });
    }
};

// Update a venue
exports.updateVenue = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Fields that actually exist in the Appwrite venues collection
        const allowedFields = [
            'venueName',
            'ownerName',
            'description',
            'address',
            'landmark',
            'city',
            'state',
            'pincode',
            'amenities',
            'eventTypes',
            'photos',
            'contactNumber',
            'contactEmail',
            'capacity',
            'venueType',
            'gstNumber',
            'subscriptionPlan',
            'subscriptionExpiry',
            'billingDetails',
            'onboardingComplete'
        ];

        // These fields are stored as JSON strings in Appwrite (string attribute type)
        const stringArrayFields = ['amenities', 'eventTypes', 'photos'];

        const payload = {};
        allowedFields.forEach(field => {
            if (updateData[field] !== undefined) {
                if (field === 'capacity') {
                    // capacity must be an integer
                    payload[field] = parseInt(updateData[field]) || 0;
                } else if (stringArrayFields.includes(field)) {
                    // Appwrite stores these as string attributes containing JSON arrays
                    const val = updateData[field];
                    if (Array.isArray(val)) {
                        payload[field] = JSON.stringify(val);
                    } else if (typeof val === 'string') {
                        // Already a string (e.g. already stringified) — pass through
                        payload[field] = val;
                    } else {
                        payload[field] = JSON.stringify([]);
                    }
                } else {
                    payload[field] = updateData[field];
                }
            }
        });

        const updated = await databases.updateDocument(
            DATABASE_ID,
            VENUES_COLLECTION_ID,
            id,
            payload
        );

        return res.status(200).json({
            status: 'success',
            message: 'Venue profile updated successfully',
            data: updated
        });
    } catch (error) {
        console.error('Error updating venue:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Error updating venue'
        });
    }
};


// Get single venue
exports.getVenueById = async (req, res) => {
    try {
        const venue = await databases.getDocument(
            DATABASE_ID,
            VENUES_COLLECTION_ID,
            req.params.id
        );

        return res.status(200).json({
            status: 'success',
            data: venue
        });
    } catch (error) {
        console.error('Error fetching venue:', error);
        return res.status(error.code || 500).json({
            status: 'error',
            message: error.message || 'Error occurred while fetching venue'
        });
    }
};

// Submit a new lead (Distributed by Pincode)
exports.submitLead = async (req, res) => {
    try {
        const { venueId, pincode: rawPincode, name, phone, email, eventType, guests, notes } = req.body;

        if (!name || !phone || !eventType || (guests === undefined || guests === null || guests === '')) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide required fields: name, phone, eventType, guests'
            });
        }

        // Parse guests: Handle "0-50", "50-100", "5000+"
        const guestCapStr = String(guests || "0");
        let safeGuests = 0;
        if (guestCapStr.includes('-')) {
            safeGuests = parseInt(guestCapStr.split('-').pop()) || 0;
        } else if (guestCapStr.includes('+')) {
            safeGuests = parseInt(guestCapStr.replace('+', '')) || 5000;
        } else {
            safeGuests = parseInt(guestCapStr) || 0;
        }

        // Clean up pincode: Handle "Name-Pincode", CSV of pincodes, and whitespace
        let targetPincodes = [];
        if (rawPincode) {
            targetPincodes = rawPincode.toString().split(',').map(p => {
                let pin = p.trim();
                if (pin.includes('-')) pin = pin.split('-').pop().trim();
                return pin;
            }).filter(p => p);
        }

        // If no direct pincodes but specific venueId provided, find that venue's pincode
        if (targetPincodes.length === 0 && venueId && venueId !== 'BROADCAST') {
            try {
                const venue = await databases.getDocument(DATABASE_ID, VENUES_COLLECTION_ID, venueId);
                if (venue.pincode) {
                    targetPincodes.push(venue.pincode.toString().trim());
                }
            } catch (e) {
                console.warn(`Pincode lookup failed for venue ${venueId}`);
            }
        }

        let venuesToNotify = [];
        if (targetPincodes.length > 0) {
            // Find all venues in these pincodes
            // Note: Since Appwrite doesn't support OR across multiple values well for strings, 
            // and pincode might be a single string in DB, we fetch all active venues in the city/general area 
            // or just iterate pincodes if count is small.
            
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
            
            // Filter by pincode matching AND guest capacity AND active subscription
            venuesToNotify = allVenues.filter(v => {
                // 1. Subscription Check (Paid vendors only)
                const hasActiveSubscription = v.subscriptionPlan && v.subscriptionPlan !== 'free';
                if (!hasActiveSubscription) return false;

                // 2. Pincode Match
                const venuePincodes = (v.pincode || "").toString().split(',').map(p => p.trim()).filter(p => p);
                const isPincodeMatch = targetPincodes.some(p => venuePincodes.includes(p));
                if (!isPincodeMatch) return false;

                // 3. PAX Bucket Capacity Check
                // A venue is eligible if its capacity bucket >= the lead's required bucket.
                // E.g., Lead "100-200" → venues in 100-200, 200-500, 500-1000, etc. are eligible.
                //        Venues in 0-50 or 50-100 are NOT eligible.
                const eligible = isVenueEligible(v.capacity, guestCapStr);
                if (!eligible) {
                    console.log(`  ❌ ${v.venueName}: Capacity ${v.capacity} (${getBucketLabel(v.capacity)}) too small for ${guestCapStr} guests`);
                }
                return eligible;
            });

            // --- 📩 CENTRAL EMAIL NOTIFICATION ---
            // Send email alert to Admin for EVERY new lead
            if (process.env.ADMIN_EMAIL) {
                sendLeadNotificationEmail(process.env.ADMIN_EMAIL, {
                    name,
                    phone,
                    email,
                    eventType,
                    guests,
                    pincode: targetPincodes.join(', '),
                    notes
                }).catch(err => console.error('Failed to send admin lead email:', err.message));
            }

            // If no venues matched PAX bucket + pincode criteria, venuesToNotify stays empty.
            // The BROADCAST fallback below (line 344+) handles this gracefully by saving
            // the lead for admin review without forcing a mismatch.
            if (venuesToNotify.length === 0) {
                console.log(`⚠️ No eligible venues for pincode ${targetPincodes[0]} with PAX "${guestCapStr}". Routing to BROADCAST.`);
            }
        } else if (venueId && venueId !== 'BROADCAST') {
            // Fallback to specific venue if no pincode found
            try {
                const v = await databases.getDocument(DATABASE_ID, VENUES_COLLECTION_ID, venueId);
                // Even if specific venue requested, it must be paid
                if (v.subscriptionPlan && v.subscriptionPlan !== 'free') {
                    venuesToNotify = [v];
                }
            } catch (e) {}
        }

        // If no venues found (rare or none paid), still save a single lead for global tracking
        // This ensures the customer request isn't lost, even if no vendor is immediately eligible
        if (venuesToNotify.length === 0) {
            const lead = await databases.createDocument(
                DATABASE_ID,
                LEADS_COLLECTION_ID,
                ID.unique(),
                {
                    venueId: venueId || 'BROADCAST',
                    name,
                    phone,
                    email: email || '',
                    eventType,
                    guests: safeGuests,
                    notes: notes || (rawPincode ? `Pincode: ${rawPincode} (No Paid Venues Found)` : ''),
                    status: 'New',
                    createdAt: new Date().toISOString()
                }
            );
            return res.status(201).json({ status: 'success', data: lead });
        }

        // Create distributed leads for all relevant venues
        const leadPromises = venuesToNotify.map(async (v) => {
            const leadInstance = await databases.createDocument(
                DATABASE_ID,
                LEADS_COLLECTION_ID,
                ID.unique(),
                {
                    venueId: v.$id,
                    name,
                    phone,
                    email: email || '',
                    eventType,
                    guests: safeGuests,
                    notes: notes || (targetPincodes.length > 0 ? `Distributed Lead (${targetPincodes.join(', ')})` : ''),
                    status: 'New',
                    createdAt: new Date().toISOString()
                }
            );

            // RELIABLE COUNT: Fetch actual count of leads for this venue to ensure sync
            try {
                const leadCountRes = await databases.listDocuments(
                    DATABASE_ID,
                    LEADS_COLLECTION_ID,
                    [Query.equal('venueId', v.$id), Query.limit(1)]
                );
                
                await databases.updateDocument(
                    DATABASE_ID,
                    VENUES_COLLECTION_ID,
                    v.$id,
                    {
                        totalLeads: leadCountRes.total
                    }
                );
                console.log(`[SYNC] Updated venue ${v.$id} leads count to ${leadCountRes.total}`);
            } catch (err) {
                console.error(`Failed to sync lead count for venue ${v.$id}:`, err.message);
            }

            // Send push notification to this venue
            if (v.expoPushToken) {
                try {
                    await sendPushNotification(
                        v.expoPushToken,
                        'New Local Lead! 🎊',
                        `Inquiry from ${name} for ${eventType} in your area.`,
                        { leadId: leadInstance.$id, type: 'NEW_LEAD' },
                        `Guests: ${guests}`
                    );
                } catch (pe) {}
            }

            return leadInstance;
        });

        const results = await Promise.all(leadPromises);

        return res.status(201).json({
            status: 'success',
            message: `Lead distributed to ${results.length} venues successfully`,
            data: results[0]
        });

    } catch (error) {
        console.error('Error submitting distributed lead:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Error occurred while submitting lead'
        });
    }
};

// Get leads for a specific venue (for vendor dashboard)
exports.getVenueLeads = async (req, res) => {
    try {
        const { venueId } = req.params;

        // Fetch venue to get its creation date and subscription status
        const venue = await databases.getDocument(
            DATABASE_ID,
            VENUES_COLLECTION_ID,
            venueId
        );

        // Security Check: Hide leads from free accounts
        if (!venue.subscriptionPlan || venue.subscriptionPlan === 'free') {
            return res.status(200).json({
                status: 'success',
                results: 0,
                data: [],
                message: 'Leads are only visible to venues with an active subscription plan.'
            });
        }

        const registrationDate = venue.createdAt || venue.$createdAt;

        const leads = await databases.listDocuments(
            DATABASE_ID,
            LEADS_COLLECTION_ID,
            [
                Query.equal('venueId', venueId),
                Query.greaterThan('$createdAt', registrationDate),
                Query.orderDesc('$createdAt')
            ]
        );

        return res.status(200).json({
            status: 'success',
            results: leads.total,
            data: leads.documents
        });
    } catch (error) {
        console.error('Error fetching leads:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Error occurred while fetching leads'
        });
    }
};

// --- REVIEWS SECTION ---

// Submit a review
exports.submitReview = async (req, res) => {
    try {
        const { venueId, userName, userEmail, rating, comment } = req.body;

        if (!venueId || !userName || !rating || !comment) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide all required fields: venueId, userName, rating, comment'
            });
        }

        const review = await databases.createDocument(
            DATABASE_ID,
            REVIEWS_COLLECTION_ID,
            ID.unique(),
            {
                venueId,
                userName,
                userEmail: userEmail || '',
                rating: parseInt(rating),
                comment,
                vendorReply: ''
            }
        );

        return res.status(201).json({
            status: 'success',
            message: 'Review submitted successfully',
            data: review
        });
    } catch (error) {
        console.error('Error submitting review:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Error occurred while submitting review'
        });
    }
};

// Get reviews for a specific venue
exports.getVenueReviews = async (req, res) => {
    try {
        const { venueId } = req.params;
        const reviews = await databases.listDocuments(
            DATABASE_ID,
            REVIEWS_COLLECTION_ID,
            [
                Query.equal('venueId', venueId),
                Query.orderDesc('$createdAt')
            ]
        );

        return res.status(200).json({
            status: 'success',
            results: reviews.total,
            data: reviews.documents
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Error occurred while fetching reviews'
        });
    }
};

// Reply to a review (Vendor)
exports.replyToReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { reply } = req.body;

        if (!reply) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide a reply message'
            });
        }

        const review = await databases.updateDocument(
            DATABASE_ID,
            REVIEWS_COLLECTION_ID,
            reviewId,
            {
                vendorReply: reply
            }
        );

        return res.status(200).json({
            status: 'success',
            message: 'Reply updated successfully',
            data: review
        });
    } catch (error) {
        console.error('Error updating review reply:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Error occurred while updating reply'
        });
    }
};
// Delete a review
exports.deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

        await databases.deleteDocument(
            DATABASE_ID,
            REVIEWS_COLLECTION_ID,
            reviewId
        );

        return res.status(200).json({
            status: 'success',
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting review:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Error occurred while deleting review'
        });
    }
};

// Proxy image from Appwrite storage (bypasses CORS/Permissions blocks)
exports.proxyImage = async (req, res) => {
    try {
        const { bucketId, fileId } = req.params;
        const { storage, STORAGE_BUCKET_ID } = require('../config/appwrite');

        const activeBucketId = (bucketId && bucketId !== 'undefined' && bucketId !== 'null') ? bucketId : STORAGE_BUCKET_ID;

        // 1. Get the file preview/view content
        // In node-appwrite, this usually returns a Uint8Array/Buffer
        const result = await storage.getFileView(activeBucketId, fileId);
        
        // 2. Fetch metadata for the correct Content-Type
        let contentType = 'image/jpeg';
        try {
            const file = await storage.getFile(activeBucketId, fileId);
            contentType = file.mimeType || 'image/jpeg';
        } catch (e) {
            // Non-blocking metadata failure
        }

        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

        // Handle both Buffer and string (URL) results
        if (typeof result === 'string') {
            console.log(`[PROXY] Bucket: ${activeBucketId}, File: ${fileId} - Result is a URL, redirecting.`);
            return res.redirect(result);
        }

        return res.send(Buffer.from(result));
    } catch (error) {
        console.error(`[PROXY ERROR] Bucket: ${req.params.bucketId}, File: ${req.params.fileId}:`, error.message);
        
        // Fallback: If specific bucket fails, try default bucket
        const { STORAGE_BUCKET_ID, storage } = require('../config/appwrite');
        if (req.params.bucketId !== STORAGE_BUCKET_ID) {
            try {
                const retryResult = await storage.getFileView(STORAGE_BUCKET_ID, req.params.fileId);
                res.setHeader('Content-Type', 'image/jpeg');
                return res.send(Buffer.from(retryResult));
            } catch (e) {}
        }
        
        return res.status(404).send('Image not found');
    }
};

// POST notify document submission
exports.notifyDocSubmission = async (req, res) => {
    try {
        const { venueId } = req.body;
        if (!venueId) {
            return res.status(400).json({ status: 'error', message: 'Venue ID is required' });
        }

        const venue = await databases.getDocument(DATABASE_ID, VENUES_COLLECTION_ID, venueId);
        
        const { sendDocVerificationEmail } = require('../utils/emailService');
        if (venue.contactEmail) {
            await sendDocVerificationEmail(venue.contactEmail, venue.ownerName || venue.venueName);
        }

        return res.status(200).json({
            status: 'success',
            message: 'Document submission notification email sent'
        });
    } catch (error) {
        console.error('Error in notifyDocSubmission:', error);
        return res.status(500).json({ status: 'error', message: error.message });
    }
};

// POST notify onboarding completion (Day 0 Reminder)
exports.notifyOnboardingComplete = async (req, res) => {
    try {
        const { venueId } = req.body;
        if (!venueId) {
            return res.status(400).json({ status: 'error', message: 'Venue ID is required' });
        }

        const venue = await databases.getDocument(DATABASE_ID, VENUES_COLLECTION_ID, venueId);
        
        // Only send if not already on a paid plan
        const hasActiveSubscription = venue.subscriptionPlan && venue.subscriptionPlan !== 'free';
        
        if (!hasActiveSubscription && venue.contactEmail) {
            const { sendPaymentReminderEmail } = require('../utils/emailService');
            await sendPaymentReminderEmail(venue.contactEmail, venue.ownerName || venue.venueName);
            console.log(`Day 0 Payment reminder sent to ${venue.contactEmail}`);
        }

        return res.status(200).json({
            status: 'success',
            message: 'Onboarding completion notification processed'
        });
    } catch (error) {
        console.error('Error in notifyOnboardingComplete:', error);
        return res.status(500).json({ status: 'error', message: error.message });
    }
};
