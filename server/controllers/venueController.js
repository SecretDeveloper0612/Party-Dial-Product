const { databases, DATABASE_ID, VENUES_COLLECTION_ID, LEADS_COLLECTION_ID, REVIEWS_COLLECTION_ID } = require('../config/appwrite');
const { ID, Query } = require('node-appwrite');
const { sendPushNotification } = require('../utils/notifications');
const { sendProfileStatusEmail } = require('../utils/emailService');


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

        return res.status(200).json({
            status: 'success',
            results: venues.total,
            data: venues.documents
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

        // Fields allowed to be updated by admin/authorized user
        const allowedFields = [
            'venueName',
            'businessName',
            'description',
            'address',
            'city',
            'state',
            'pincode',
            'amenities',
            'services',
            'images',
            'contactNumber',
            'contactEmail',
            'pricing',
            'capacity',
            'venueType',
            'usp',
            'foodType',
            'location',
            'gallery',
            'socialLinks'
        ];

        const payload = {};
        allowedFields.forEach(field => {
            if (updateData[field] !== undefined) {
                // Ensure capacity is a number if provided
                if (field === 'capacity') {
                    payload[field] = parseInt(updateData[field]) || 0;
                } else if (typeof updateData[field] === 'object') {
                    // For things like arrays (amenities, images) that might come as objects
                    // Appwrite expects them in a specific format if it's a string attribute, 
                    // but if it's an array attribute it's fine. 
                    // Assuming standard attributes here based on existing code patterns.
                    payload[field] = updateData[field];
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

        const safeGuests = typeof guests === 'string' 
            ? (parseInt(guests.split('-').pop()) || 0) 
            : (parseInt(guests) || 0);

        let targetPincode = rawPincode;
        
        // Clean up pincode if it comes in "Name-Pincode" format from suggestions
        if (targetPincode && typeof targetPincode === 'string' && targetPincode.includes('-')) {
            targetPincode = targetPincode.split('-').pop();
        }

        // If no direct pincode but specific venueId provided, find that venue's pincode
        if (!targetPincode && venueId && venueId !== 'BROADCAST') {
            try {
                const venue = await databases.getDocument(DATABASE_ID, VENUES_COLLECTION_ID, venueId);
                targetPincode = venue.pincode;
            } catch (e) {
                console.warn(`Pincode lookup failed for venue ${venueId}`);
            }
        }

        let venuesToNotify = [];
        if (targetPincode) {
            // Find all venues in this pincode
            const result = await databases.listDocuments(
                DATABASE_ID,
                VENUES_COLLECTION_ID,
                [Query.equal('pincode', targetPincode)]
            );
            
            // Filter by guest capacity AND active subscription
            venuesToNotify = result.documents.filter(v => {
                // 1. Subscription Check (Paid vendors only)
                const hasActiveSubscription = v.subscriptionPlan && v.subscriptionPlan !== 'free';
                if (!hasActiveSubscription) return false;

                // 2. Capacity Check
                let capacityStr = String(v.capacity || '10000');
                if (capacityStr.includes('-')) {
                    capacityStr = capacityStr.split('-').pop(); // Take the upper bound
                } else if (capacityStr.includes('+')) {
                    capacityStr = capacityStr.replace('+', ''); // Handle '5000+'
                }
                const venueMaxCapacity = parseInt(capacityStr) || 10000;
                return safeGuests <= venueMaxCapacity;
            });

            // Fallback: If no paid venues match capacity but some exist, pick largest (must still be paid)
            if (venuesToNotify.length === 0 && result.documents.length > 0) {
                const paidVenues = result.documents.filter(v => v.subscriptionPlan && v.subscriptionPlan !== 'free');
                if (paidVenues.length > 0) {
                    console.log(`Pincode ${targetPincode} match found but capacity ${safeGuests} exceeded all venues. Selecting largest available.`);
                    venuesToNotify = [paidVenues.sort((a,b) => (parseInt(b.capacity)||0) - (parseInt(a.capacity)||0))[0]];
                }
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
                    notes: notes || (targetPincode ? `Distributed Lead (${targetPincode})` : ''),
                    status: 'New',
                    createdAt: new Date().toISOString()
                }
            );

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

        const activeBucketId = (bucketId && bucketId !== 'undefined') ? bucketId : STORAGE_BUCKET_ID;

        // Try getting the file as a buffer
        const result = await storage.getFileView(activeBucketId, fileId);
        
        // Try getting metadata for content-type
        let contentType = 'image/jpeg';
        try {
            const file = await storage.getFile(activeBucketId, fileId);
            contentType = file.mimeType || 'image/jpeg';
        } catch (e) {
            console.warn(`Could not fetch metadata for file ${fileId}. Defaulting to image/jpeg.`);
        }

        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        return res.send(Buffer.from(result));
    } catch (error) {
        console.error('Error proxying image:', error);
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
        const hasActiveSubscription = venue.subscriptionPlan && venue.subscriptionPlan !== 'free' && venue.isPaid === true;
        
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
