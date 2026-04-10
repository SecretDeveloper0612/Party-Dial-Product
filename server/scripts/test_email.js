const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

const emailService = require('../utils/emailService');

async function testEmail() {
    console.log('--- Email Service Test ---');
    console.log('Host:', process.env.EMAIL_HOST);
    console.log('User:', process.env.EMAIL_USER);
    console.log('From:', process.env.EMAIL_FROM);
    
    // Use the EMAIL_FROM or EMAIL_USER as the recipient for the test
    const testRecipient = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'admin@partydial.in';
    
    console.log('Sending test welcome email to:', testRecipient);
    
    try {
        const result = await emailService.sendWelcomeEmail(testRecipient, 'Test User');
        console.log('Test result:', result ? 'SUCCESS' : 'FAILURE');
        if (result) {
            console.log('Message ID:', result.messageId);
        }
    } catch (error) {
        console.error('Test failed with error:');
        console.error(error);
    }
}

testEmail();
