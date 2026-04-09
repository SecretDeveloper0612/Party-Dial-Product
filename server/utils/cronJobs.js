const cron = require('node-cron');
const { databases, DATABASE_ID, LEADS_COLLECTION_ID } = require('../config/appwrite');
const { Query } = require('node-appwrite');

/**
 * Automatically move inactive leads to "Lost Leads" category.
 * Rule: Leads not updated for 7+ days.
 * Frequency: Once per day at midnight.
 */
const automateLeadStatus = async () => {
    console.log('--- Starting Lead Status Automation ---');
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const isoDate = sevenDaysAgo.toISOString();

        // 1. Fetch leads that haven't been updated for 7 days
        // We exclude leads that are already "Lost Leads" or "Booked"
        // Note: Appwrite listDocuments max limit is 5000
        const leads = await databases.listDocuments(
            DATABASE_ID,
            LEADS_COLLECTION_ID,
            [
                Query.lessThan('$updatedAt', isoDate),
                Query.notEqual('status', 'Lost Leads'),
                Query.notEqual('status', 'Booked'),
                Query.limit(1000) 
            ]
        );

        console.log(`Found ${leads.documents.length} leads to process.`);

        // 2. Update each lead to "Lost Leads"
        const updatePromises = leads.documents.map(lead => {
            return databases.updateDocument(
                DATABASE_ID,
                LEADS_COLLECTION_ID,
                lead.$id,
                {
                    status: 'Lost Leads'
                }
            ).catch(err => {
                console.error(`Failed to update lead ${lead.$id}:`, err.message);
            });
        });

        await Promise.all(updatePromises);
        console.log('--- Lead Status Automation Completed ---');

    } catch (error) {
        console.error('Error in Lead Status Automation:', error);
    }
};

// Schedule the task to run once per day at 00:00 (Midnight)
cron.schedule('0 0 * * *', () => {
    automateLeadStatus();
});

// Run once on server start for immediate effect during development/testing (optional)
// automateLeadStatus();

module.exports = { automateLeadStatus };
