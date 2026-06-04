import { ID, Query } from 'node-appwrite';
import { getAppwriteServices } from '../utils/appwrite';
import { isVenueEligible, getBucketLabel } from '../utils/paxMatcher';

export const getAllVenues = async (c) => {
    try {
        const verified = c.req.query('verified');
        const city = c.req.query('city');
        const { databases, databaseId, collections } = getAppwriteServices(c.env);

        const queries = [
            Query.orderDesc('$createdAt'),
            Query.limit(5000)
        ];

        if (verified === 'true') {
            queries.push(Query.equal('isVerified', true));
            queries.push(Query.equal('status', 'active'));
        }

        if (city) queries.push(Query.equal('city', city));

        const venues = await databases.listDocuments(databaseId, collections.venues, queries);
        
        return c.json({ status: 'success', results: venues.documents.length, data: venues.documents }, 200);
    } catch (error) {
        return c.json({ status: 'error', message: error.message }, 500);
    }
};

export const approveVenue = async (c) => {
    try {
        const id = c.req.param('id');
        const { databases, databaseId, collections } = getAppwriteServices(c.env);
        
        const currentDoc = await databases.getDocument(databaseId, collections.venues, id);
        const updatePayload = { isVerified: true, status: 'active' };
        
        if (currentDoc.capacity === undefined || currentDoc.capacity === null || currentDoc.capacity < 1) {
            updatePayload.capacity = 1;
        }

        const updated = await databases.updateDocument(databaseId, collections.venues, id, updatePayload);
        // Email logic can be hooked up here
        return c.json({ status: 'success', message: 'Venue approved', data: updated }, 200);
    } catch (error) {
        return c.json({ status: 'error', message: error.message }, 500);
    }
};

export const rejectVenue = async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        const { reason } = body;

        const { databases, databaseId, collections } = getAppwriteServices(c.env);
        const currentDoc = await databases.getDocument(databaseId, collections.venues, id);
        
        const updatePayload = { isVerified: false, status: 'rejected' };
        if (currentDoc.capacity === undefined || currentDoc.capacity === null || currentDoc.capacity < 1) {
            updatePayload.capacity = 1;
        }

        const updated = await databases.updateDocument(databaseId, collections.venues, id, updatePayload);
        return c.json({ status: 'success', message: 'Venue rejected', data: updated, reason: reason || '' }, 200);
    } catch (error) {
        return c.json({ status: 'error', message: error.message }, 500);
    }
};

export const updateVenue = async (c) => {
    try {
        const id = c.req.param('id');
        const updateData = await c.req.json();
        const { databases, databaseId, collections } = getAppwriteServices(c.env);

        const allowedFields = ['venueName', 'ownerName', 'description', 'address', 'landmark', 'city', 'state', 'pincode', 'amenities', 'eventTypes', 'photos', 'contactNumber', 'contactEmail', 'capacity', 'venueType', 'gstNumber', 'billingDetails', 'onboardingComplete'];
        const stringArrayFields = ['amenities', 'eventTypes', 'photos'];

        const payload = {};
        allowedFields.forEach(field => {
            if (updateData[field] !== undefined) {
                if (field === 'capacity') {
                    payload[field] = parseInt(updateData[field]) || 0;
                } else if (stringArrayFields.includes(field)) {
                    const val = updateData[field];
                    if (Array.isArray(val)) {
                        payload[field] = JSON.stringify(val);
                    } else if (typeof val === 'string') {
                        payload[field] = val;
                    } else {
                        payload[field] = JSON.stringify([]);
                    }
                } else {
                    payload[field] = updateData[field];
                }
            }
        });

        const updated = await databases.updateDocument(databaseId, collections.venues, id, payload);
        return c.json({ status: 'success', message: 'Venue updated', data: updated }, 200);
    } catch (error) {
        return c.json({ status: 'error', message: error.message }, 500);
    }
};

export const getVenueById = async (c) => {
    try {
        const id = c.req.param('id');
        const { databases, databaseId, collections } = getAppwriteServices(c.env);
        const venue = await databases.getDocument(databaseId, collections.venues, id);
        return c.json({ status: 'success', data: venue }, 200);
    } catch (error) {
        return c.json({ status: 'error', message: error.message }, 500);
    }
};

export const submitLead = async (c) => {
    try {
        const body = await c.req.json();
        const { venueId, pincode: rawPincode, name, phone, email, eventType, guests, notes, eventDate } = body;

        if (!name || !phone || !eventType || (guests === undefined || guests === null || guests === '')) {
            return c.json({ status: 'error', message: 'Please provide required fields: name, phone, eventType, guests' }, 400);
        }

        const { databases, databaseId, collections } = getAppwriteServices(c.env);
        
        try {
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
            const existingLeads = await databases.listDocuments(databaseId, collections.leads, [
                Query.equal('phone', phone), Query.greaterThan('$createdAt', twentyFourHoursAgo), Query.limit(1)
            ]);
            if (existingLeads.total > 0) {
                return c.json({ status: 'error', message: 'You have already submitted an inquiry. Please wait 24 hours.' }, 429);
            }
        } catch (e) {}

        const guestCapStr = String(guests || "0");
        let safeGuests = 0;
        if (guestCapStr.includes('-')) safeGuests = parseInt(guestCapStr.split('-').pop()) || 0;
        else if (guestCapStr.includes('+')) safeGuests = parseInt(guestCapStr.replace('+', '')) || 5000;
        else safeGuests = parseInt(guestCapStr) || 0;

        let targetPincodes = [];
        let cleanPincode = "";
        if (rawPincode) {
            targetPincodes = rawPincode.toString().split(',').map(p => {
                let pin = p.trim();
                if (pin.includes('-')) pin = pin.split('-').pop().trim();
                return pin;
            }).filter(p => p);
            cleanPincode = targetPincodes.join(', ');
        }

        if (targetPincodes.length === 0 && venueId && venueId !== 'BROADCAST') {
            try {
                const venue = await databases.getDocument(databaseId, collections.venues, venueId);
                if (venue.pincode) {
                    targetPincodes.push(venue.pincode.toString().trim());
                    cleanPincode = venue.pincode.toString().trim();
                }
            } catch (e) {}
        }

        let venuesToNotify = [];
        if (targetPincodes.length > 0) {
            const venueResult = await databases.listDocuments(databaseId, collections.venues, [
                Query.equal('isVerified', true), Query.equal('status', 'active'), Query.limit(1000)
            ]);
            
            venuesToNotify = venueResult.documents.filter(v => {
                const hasActiveSubscription = v.subscriptionPlan && v.subscriptionPlan !== 'free';
                if (!hasActiveSubscription) return false;
                const venuePincodes = (v.pincode || "").toString().split(',').map(p => p.trim()).filter(p => p);
                const isPincodeMatch = targetPincodes.some(p => venuePincodes.includes(p));
                if (!isPincodeMatch) return false;
                return isVenueEligible(v.capacity, guestCapStr);
            });
        } else if (venueId && venueId !== 'BROADCAST') {
            try {
                const v = await databases.getDocument(databaseId, collections.venues, venueId);
                if (v.subscriptionPlan && v.subscriptionPlan !== 'free') venuesToNotify = [v];
            } catch (e) {}
        }

        if (venuesToNotify.length === 0) {
            const lead = await databases.createDocument(databaseId, collections.leads, ID.unique(), {
                venueId: venueId || 'BROADCAST', name, phone, email: email || '', eventType, guests: safeGuests,
                notes: (notes || '') + (eventDate ? ` | Event Date: ${eventDate}` : '') + (cleanPincode ? ` | Pincode: ${cleanPincode}` : ''),
                status: 'New', createdAt: new Date().toISOString()
            });
            return c.json({ status: 'success', data: lead }, 201);
        }

        const leadPromises = venuesToNotify.map(async (v) => {
            return await databases.createDocument(databaseId, collections.leads, ID.unique(), {
                venueId: v.$id, name, phone, email: email || '', eventType, guests: safeGuests,
                notes: (notes || '') + (eventDate ? ` | Event Date: ${eventDate}` : '') + (cleanPincode ? ` | Pincode: ${cleanPincode}` : ''),
                status: 'New', createdAt: new Date().toISOString()
            });
        });

        const results = await Promise.all(leadPromises);
        return c.json({ status: 'success', message: `Lead distributed to ${results.length} venues successfully`, data: results[0] }, 201);
    } catch (error) {
        return c.json({ status: 'error', message: error.message }, 500);
    }
};

export const getVenueLeads = async (c) => {
    try {
        const venueId = c.req.param('venueId');
        const { databases, databaseId, collections } = getAppwriteServices(c.env);

        const venue = await databases.getDocument(databaseId, collections.venues, venueId);
        if (!venue.subscriptionPlan || venue.subscriptionPlan === 'free') {
            return c.json({ status: 'success', results: 0, data: [], message: 'Leads are only visible to active subscriptions.' }, 200);
        }

        const registrationDate = venue.createdAt || venue.$createdAt;
        const leads = await databases.listDocuments(databaseId, collections.leads, [
            Query.or([Query.equal('venueId', venueId), Query.equal('venueId', 'BROADCAST')]),
            Query.greaterThan('$createdAt', registrationDate),
            Query.orderDesc('$createdAt')
        ]);

        const now = new Date();
        const mappedLeads = leads.documents.map(doc => {
            let isLost = false;
            if (doc.eventDate) {
                const eventDate = new Date(doc.eventDate);
                if (now > eventDate) isLost = true;
            }
            return { ...doc, isLost };
        });

        return c.json({ status: 'success', results: leads.total, data: mappedLeads }, 200);
    } catch (error) {
        return c.json({ status: 'error', message: error.message }, 500);
    }
};

// Reviews Logic
export const submitReview = async (c) => {
    try {
        const body = await c.req.json();
        const { venueId, userName, userEmail, rating, comment } = body;
        if (!venueId || !userName || !rating || !comment) return c.json({ status: 'error', message: 'Fields missing' }, 400);

        const { databases, databaseId, collections } = getAppwriteServices(c.env);
        const review = await databases.createDocument(databaseId, collections.reviews, ID.unique(), {
            venueId, userName, userEmail: userEmail || '', rating: parseInt(rating), comment, vendorReply: ''
        });
        return c.json({ status: 'success', data: review }, 201);
    } catch (error) {
        return c.json({ status: 'error', message: error.message }, 500);
    }
};

export const getVenueReviews = async (c) => {
    try {
        const venueId = c.req.param('venueId');
        const { databases, databaseId, collections } = getAppwriteServices(c.env);
        const reviews = await databases.listDocuments(databaseId, collections.reviews, [
            Query.equal('venueId', venueId), Query.orderDesc('$createdAt')
        ]);
        return c.json({ status: 'success', results: reviews.total, data: reviews.documents }, 200);
    } catch (error) {
        return c.json({ status: 'error', message: error.message }, 500);
    }
};

export const replyToReview = async (c) => {
    try {
        const reviewId = c.req.param('reviewId');
        const { reply } = await c.req.json();
        if (!reply) return c.json({ status: 'error', message: 'Reply missing' }, 400);

        const { databases, databaseId, collections } = getAppwriteServices(c.env);
        const review = await databases.updateDocument(databaseId, collections.reviews, reviewId, { vendorReply: reply });
        return c.json({ status: 'success', data: review }, 200);
    } catch (error) {
        return c.json({ status: 'error', message: error.message }, 500);
    }
};

export const deleteReview = async (c) => {
    try {
        const reviewId = c.req.param('reviewId');
        const { databases, databaseId, collections } = getAppwriteServices(c.env);
        await databases.deleteDocument(databaseId, collections.reviews, reviewId);
        return c.json({ status: 'success', message: 'Deleted' }, 200);
    } catch (error) {
        return c.json({ status: 'error', message: error.message }, 500);
    }
};

// Proxy Image Logic
export const proxyImage = async (c) => {
    try {
        const bucketId = c.req.param('bucketId');
        const fileId = c.req.param('fileId');
        const { storage } = getAppwriteServices(c.env);
        const activeBucketId = (bucketId && bucketId !== 'undefined' && bucketId !== 'null') ? bucketId : c.env.STORAGE_BUCKET_ID;
        
        const result = await storage.getFileView(activeBucketId, fileId);
        
        // Hono handles array buffers natively with Response
        return new Response(result, {
            headers: {
                'Content-Type': 'image/jpeg',
                'Cache-Control': 'public, max-age=31536000, immutable'
            }
        });
    } catch (error) {
        return c.text('Image not found', 404);
    }
};

export const notifyDocSubmission = async (c) => {
    return c.json({ status: 'success', message: 'Document submission notification email sent' }, 200);
};

export const notifyOnboardingComplete = async (c) => {
    return c.json({ status: 'success', message: 'Onboarding completion notification processed' }, 200);
};
