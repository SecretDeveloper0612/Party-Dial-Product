const { databases } = require('../config/appwrite');
const { ID, Query } = require('node-appwrite');

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;

// Create document
exports.createDocument = async (req, res) => {
    try {
        const { collectionId, data } = req.body;
        
        if (!collectionId || !data) {
            return res.status(400).json({ status: 'error', message: 'Collection ID and data are required' });
        }

        // Inject createdAt if missing (required by schema)
        const documentData = {
            ...data,
            createdAt: data.createdAt || new Date().toISOString()
        };
        const document = await databases.createDocument(DATABASE_ID, collectionId, ID.unique(), documentData);
        
        return res.status(201).json({
            status: 'success',
            data: document
        });
    } catch (error) {
        console.error('Error in createDocument:', error);
        return res.status(error.code || 500).json({
            status: 'error',
            message: error.message || 'Error occurred during document creation'
        });
    }
};

// List documents
exports.listDocuments = async (req, res) => {
    try {
        const { collectionId } = req.params;
        
        // Build queries from req.query
        const appwriteQueries = [];
        for (const [key, value] of Object.entries(req.query)) {
            if (key !== 'queries' && value) {
                appwriteQueries.push(Query.equal(key, value));
            }
        }

        const documents = await databases.listDocuments(DATABASE_ID, collectionId, appwriteQueries);

        
        return res.status(200).json({
            status: 'success',
            data: documents.documents,
            total: documents.total
        });
    } catch (error) {
        console.error('Error in listDocuments:', error);
        return res.status(error.code || 500).json({
            status: 'error',
            message: error.message || 'Error occurred during document listing'
        });
    }
};

// Get single document
exports.getDocument = async (req, res) => {
    try {
        const { collectionId, documentId } = req.params;

        const document = await databases.getDocument(DATABASE_ID, collectionId, documentId);
        
        return res.status(200).json({
            status: 'success',
            data: document
        });
    } catch (error) {
        console.error('Error in getDocument:', error);
        return res.status(error.code || 500).json({
            status: 'error',
            message: error.message || 'Error occurred during document retrieval'
        });
    }
};

// Update document
exports.updateDocument = async (req, res) => {
    try {
        const { collectionId, documentId } = req.params;
        const { data } = req.body;

        const document = await databases.updateDocument(DATABASE_ID, collectionId, documentId, data);
        
        return res.status(200).json({
            status: 'success',
            data: document
        });
    } catch (error) {
        console.error('Error in updateDocument:', error);
        return res.status(error.code || 500).json({
            status: 'error',
            message: error.message || 'Error occurred during document update'
        });
    }
};

// Delete document
exports.deleteDocument = async (req, res) => {
    try {
        const { collectionId, documentId } = req.params;

        await databases.deleteDocument(DATABASE_ID, collectionId, documentId);
        
        return res.status(200).json({
            status: 'success',
            message: 'Document deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteDocument:', error);
        return res.status(error.code || 500).json({
            status: 'error',
            message: error.message || 'Error occurred during document deletion'
        });
    }
};
