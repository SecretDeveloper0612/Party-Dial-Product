require('dotenv').config({ path: '../.env' });
const emailService = require('../utils/emailService');

const testEmail = "starkirondigital@gmail.com";
const testName = "Stark Iron Digital";

async function runTests() {
    console.log("🚀 Starting Bulk Email Test for:", testEmail);
    
    try {
        // 1. Welcome Email
        console.log("Sending Welcome Email...");
        await emailService.sendWelcomeEmail(testEmail, testName);

        // 2. Profile Reminder (The one I just updated)
        console.log("Sending Profile Reminder Email...");
        await emailService.sendProfileReminder(testEmail, testName);

        // 3. Document Submission Received
        console.log("Sending Doc Verification Received Email...");
        await emailService.sendDocVerificationEmail(testEmail, testName);

        // 4. Doc Approved
        console.log("Sending Doc Approved Email...");
        await emailService.sendDocStatusEmail(testEmail, testName, 'approved');

        // 5. Doc Rejected
        console.log("Sending Doc Rejected Email...");
        await emailService.sendDocStatusEmail(testEmail, testName, 'rejected', 'The license document is expired.');

        // 6. Password Reset
        console.log("Sending Password Reset Email...");
        await emailService.sendPasswordResetEmail(testEmail, "https://partner.partydial.com/reset-password?token=test_token");

        // 7. Payment Confirmation
        console.log("Sending Payment Confirmation Email...");
        await emailService.sendPaymentConfirmationEmail(testEmail, testName, "Introductory Offer", "11");

        // 8. Profile Status Approved
        console.log("Sending Profile Status Approved Email...");
        await emailService.sendProfileStatusEmail(testEmail, testName, true);

        // 9. Profile Status Rejected
        console.log("Sending Profile Status Rejected Email...");
        await emailService.sendProfileStatusEmail(testEmail, testName, false, "Incomplete photos provided.");

        // 10. Payment Reminder
        console.log("Sending Payment Reminder Email...");
        await emailService.sendPaymentReminderEmail(testEmail, testName);

        console.log("✅ All emails sent successfully to", testEmail);
    } catch (error) {
        console.error("❌ Test failed:", error);
    }
}

runTests();
