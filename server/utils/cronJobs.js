const cron = require('node-cron');
const { databases, DATABASE_ID, LEADS_COLLECTION_ID, VENUES_COLLECTION_ID } = require('../config/appwrite');
const { Query } = require('node-appwrite');
const { sendPaymentReminderEmail, sendProfileReminder } = require('./emailService');

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
        const leads = await databases.listDocuments(
            DATABASE_ID,
            LEADS_COLLECTION_ID,
            [
                Query.lessThan('$createdAt', isoDate), // Base expiry on creation date for strict 1-week limit
                Query.notEqual('status', 'Lost Leads'),
                Query.notEqual('status', 'Booked'),
                Query.limit(1000) 
            ]
        );

        console.log(`Found ${leads.documents.length} leads older than 1 week to mark as Lost.`);

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

/**
 * Automatically send payment reminders to unpaid vendors.
 * Rule: onboardingComplete is true AND (subscriptionPlan is 'free', 'None', or empty)
 * Frequency: Once per day at 10:00 AM.
 */
const automatePaymentReminders = async () => {
    console.log('--- Starting Payment Reminder Automation ---');
    try {
        // Fetch venues that are onboarded but not paid
        const result = await databases.listDocuments(
            DATABASE_ID,
            VENUES_COLLECTION_ID,
            [
                Query.equal('onboardingComplete', true),
                Query.limit(1000)
            ]
        );

        // Filter for unpaid ones, but EXCLUDE venues the admin has deactivated/rejected
        // and venues on 'free' plan (admin-managed accounts that shouldn't get reminders)
        const unpaidVenues = result.documents.filter(v => {
            // Skip if admin has deactivated this venue
            if (v.isVerified === false || v.status === 'rejected') return false;
            
            // Skip if admin has assigned 'free' plan deliberately
            if (v.subscriptionPlan === 'free') return false;
            
            // Only target venues with no subscription plan at all
            const hasNoPlan = !v.subscriptionPlan || 
                v.subscriptionPlan === 'None' || 
                v.subscriptionPlan === '';
            
            return hasNoPlan;
        });

        console.log(`Found ${unpaidVenues.length} unpaid vendors to remind.`);

        for (const venue of unpaidVenues) {
            if (venue.contactEmail) {
                try {
                    await sendPaymentReminderEmail(venue.contactEmail, venue.ownerName || venue.venueName);
                    console.log(`✅ Payment reminder sent to ${venue.contactEmail}`);
                } catch (emailErr) {
                    console.error(`Failed to send reminder to ${venue.contactEmail}:`, emailErr.message);
                }
            }
        }
        console.log('--- Payment Reminder Automation Completed ---');
    } catch (error) {
        console.error('Error in Payment Reminder Automation:', error);
    }
};

/**
 * Automatically send profile completion reminders to users who haven't completed onboarding.
 * Rule: onboardingComplete is false AND registered at least 24 hours ago.
 * Frequency: Once per day at 09:00 AM.
 */
const automateProfileReminders = async () => {
    console.log('--- Starting Profile Completion Reminder Automation ---');
    try {
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1);
        const isoDate = twentyFourHoursAgo.toISOString();

        // Fetch venues that haven't completed onboarding and were registered more than 24h ago
        const result = await databases.listDocuments(
            DATABASE_ID,
            VENUES_COLLECTION_ID,
            [
                Query.equal('onboardingComplete', false),
                Query.lessThan('registrationDate', isoDate),
                Query.limit(1000)
            ]
        );

        console.log(`Found ${result.documents.length} incomplete profiles to remind.`);

        for (const venue of result.documents) {
            if (venue.contactEmail) {
                try {
                    await sendProfileReminder(venue.contactEmail, venue.ownerName || venue.venueName);
                    console.log(`✅ Profile completion reminder sent to ${venue.contactEmail}`);
                } catch (emailErr) {
                    console.error(`Failed to send profile reminder to ${venue.contactEmail}:`, emailErr.message);
                }
            }
        }
        console.log('--- Profile Completion Reminder Automation Completed ---');
    } catch (error) {
        console.error('Error in Profile Completion Reminder Automation:', error);
    }
};

/**
 * Automatically sync leads from Google Sheet if URL is provided in ENV.
 * Frequency: Every 5 minutes.
 */
const automateGSheetSync = async () => {
    const sheetUrl = process.env.GOOGLE_SHEET_LEADS_URL;
    if (!sheetUrl) return;

    console.log('--- Starting Automated GSheet Sync ---');
    try {
        const leadController = require('../controllers/leadController');
        // Mock req/res for the controller function if needed, or call internal helper
        const leads = await leadController.performGSheetSync(sheetUrl);
        
        if (Array.isArray(leads) && leads.length > 0) {
            // Internal call to distribute
            const mockReq = { body: { leads } };
            const mockRes = { 
                status: () => ({ json: (data) => console.log('Sync Result:', data.message) }) 
            };
            await leadController.distributeLeadsToVenues(mockReq, mockRes);
        }
    } catch (error) {
        console.error('Error in Automated GSheet Sync:', error.message);
    }
};

// Schedule Lead Status cleanup at 00:00 (Midnight)
cron.schedule('0 0 * * *', () => {
    automateLeadStatus();
});

// Schedule Payment Reminders at 10:00 AM daily
// cron.schedule('0 10 * * *', () => {
//     automatePaymentReminders();
// });

// Schedule Profile Completion Reminders at 09:00 AM daily
// cron.schedule('0 9 * * *', () => {
//     automateProfileReminders();
// });

// Schedule GSheet Sync every 5 minutes
cron.schedule('*/5 * * * *', () => {
    automateGSheetSync();
});

// Run once on server start for immediate testing
automateGSheetSync();

module.exports = { 
    automateLeadStatus, 
    automatePaymentReminders, 
    automateProfileReminders,
    automateGSheetSync
};
