const { databases, DATABASE_ID, VENUES_COLLECTION_ID, LEADS_COLLECTION_ID } = require('../config/appwrite');
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
                status: 'New',
                createdAt: new Date().toISOString()
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
                Query.orderDesc('createdAt')
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
