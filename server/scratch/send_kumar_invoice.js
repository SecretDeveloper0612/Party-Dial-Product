require('dotenv').config();
const { sendPaymentConfirmationEmail } = require('../utils/emailService');

const testEmail = 'lucifergaming94s@gmail.com';
const testName = 'Kumar (Venue Partner)';
const testPlan = '0-50 PAX Membership';
const testAmount = 14045;

const testInvoiceInfo = {
    invoiceNumber: 'INV-' + Date.now().toString().slice(-6),
    date: new Date().toLocaleDateString(),
    basePrice: 12045,
    addons: [
        { name: '50 PAX Add-on', price: 2000 }
    ],
    discount: 0,
    billingDetails: {
        name: 'Kumar',
        address: 'Haldwani Main Road',
        city: 'Haldwani',
        state: 'Uttarakhand',
        pincode: '263139'
    }
};

console.log(`Sending invoice to Kumar at ${testEmail}...`);

sendPaymentConfirmationEmail(testEmail, testName, testPlan, testAmount, testInvoiceInfo)
    .then(() => {
        console.log('✅ Invoice sent to Kumar successfully!');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Failed to send invoice:', err);
        process.exit(1);
    });
