const { databases, DATABASE_ID, VENUES_COLLECTION_ID } = require('../config/appwrite');

// Get all venues
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
