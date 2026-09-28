const express = require('express');
const router = express.Router();
const { Client, Databases, ID } = require('node-appwrite');

const client = new Client()
    .setEndpoint('https://sgp.cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '69ae84bc001ca4edf8c2')
    .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);

// Create a new ticket
router.post('/', async (req, res) => {
    try {
        const { subject, category, description, vendorId } = req.body;
        
        const response = await databases.createDocument(
            '69c2305e000ecd6d04c1', 
            'support-tickets', 
            ID.unique(),
            {
                subject,
                category,
                description,
                vendorId: vendorId || 'anonymous',
                status: 'Open',
                date: new Date().toISOString()
            }
        );
        
        res.json({ status: 'success', data: response });
    } catch (error) {
        console.error('Error creating ticket:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Get tickets for a vendor
router.get('/vendor/:vendorId', async (req, res) => {
    try {
        const { Query } = require('node-appwrite');
        const response = await databases.listDocuments(
            '69c2305e000ecd6d04c1',
            'support-tickets',
            [
                Query.equal('vendorId', req.params.vendorId),
                Query.orderDesc('$createdAt')
            ]
        );
        res.json({ status: 'success', data: response.documents });
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Get all tickets (for admin)
router.get('/all', async (req, res) => {
    try {
        const { Query } = require('node-appwrite');
        const response = await databases.listDocuments(
            '69c2305e000ecd6d04c1',
            'support-tickets',
            [Query.orderDesc('$createdAt')]
        );
        res.json({ status: 'success', data: response.documents });
    } catch (error) {
        console.error('Error fetching all tickets:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Update ticket status (for admin)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const response = await databases.updateDocument(
            '69c2305e000ecd6d04c1',
            'support-tickets',
            req.params.id,
            { status }
        );
        res.json({ status: 'success', data: response });
    } catch (error) {
        console.error('Error updating ticket:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;
