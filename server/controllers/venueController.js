const { databases, DATABASE_ID, VENUES_COLLECTION_ID, LEADS_COLLECTION_ID, REVIEWS_COLLECTION_ID } = require('../config/appwrite');
const { ID, Query } = require('node-appwrite');

// Get all venues
// ... (omitting unchanged getAllVenues for brevity but keeping logic)
exports.getAllVenues = async (req, res) => {
    try {
        const venues = await databases.listDocuments(
            DATABASE_ID,
            VENUES_COLLECTION_ID
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

// Submit a new lead
exports.submitLead = async (req, res) => {
    try {
        const { venueId, name, phone, email, eventType, guests, notes } = req.body;

        if (!venueId || !name || !phone || !eventType || !guests) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide all required fields: venueId, name, phone, eventType, guests'
            });
        }

        const lead = await databases.createDocument(
            DATABASE_ID,
            LEADS_COLLECTION_ID,
            ID.unique(),
            {
                venueId,
                name,
                phone,
                email: email || '',
                eventType,
                guests: parseInt(guests),
                notes: notes || '',
                status: 'New'
            }
        );

        return res.status(201).json({
            status: 'success',
            message: 'Lead submitted successfully',
            data: lead
        });
    } catch (error) {
        console.error('Error submitting lead:', error);
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
        const leads = await databases.listDocuments(
            DATABASE_ID,
            LEADS_COLLECTION_ID,
            [
                Query.equal('venueId', venueId),
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
