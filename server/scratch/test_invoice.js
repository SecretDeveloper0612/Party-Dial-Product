require('dotenv').config();
const { sendPaymentConfirmationEmail } = require('../utils/emailService');

const testEmail = 'starkirondigital@gmail.com';
const testName = 'Stark Iron Digital (Test Venue)';
const testPlan = '200-500 PAX Membership';
const testAmount = 45000;

const testInvoiceInfo = {
    invoiceNumber: 'TEST-' + Date.now().toString().slice(-6),
    date: new Date().toLocaleDateString(),
    basePrice: 38000,
    addons: [
        { name: 'Priority Placement Add-on', price: 5000 },
        { name: 'Lead SMS Alerts', price: 4000 }
    ],
    discount: 2000,
    billingDetails: {
        name: 'Stark Iron Digital',
        address: '123 Test Street, Cyber City',
        city: 'Haldwani',
        state: 'Uttarakhand',
        pincode: '263139',
        gstNumber: '05AAAAA0000A1Z5'
    }
};

console.log(`Sending test invoice to ${testEmail}...`);

sendPaymentConfirmationEmail(testEmail, testName, testPlan, testAmount, testInvoiceInfo)
    .then(() => {
        console.log('✅ Test invoice sent successfully!');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Failed to send test invoice:', err);
        process.exit(1);
    });
