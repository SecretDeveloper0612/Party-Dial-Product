const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

const { generateInvoicePDF } = require('../utils/invoiceGenerator');
const { sendPaymentConfirmationEmail } = require('../utils/emailService');

async function testInvoiceEmail() {
    const targetEmail = "starkirondigital@gmail.com";
    console.log(`--- Sending Test Invoice to ${targetEmail} ---`);

    const addons = [
        { name: "Expansion Pack: 200-500 Guests Coverage", price: 6999 }
    ];

    const planPrice = 28105; // Priority Pack (₹77/day billed annually)
    const addonPrice = 6999;
    const totalInr = planPrice + addonPrice;
    const basePrice = totalInr / 1.18;
    const gstAmount = totalInr - basePrice;

    const invoiceData = {
        invoiceNumber: "INV-PD-2026-991",
        invoiceDate: new Date().toLocaleDateString('en-IN'),
        venueName: "Royal Orchid Banquet",
        ownerName: "Akash Sharma",
        billingAddress: "Nainital Road, Haldwani, Uttarakhand - 263139",
        email: targetEmail,
        mobile: "8679933302",
        gstNumber: "05AAHCP4413A1Z7",
        planName: "Priority Pack (100-200 PAX)",
        planDuration: '1 Year',
        planPrice: basePrice.toFixed(2),
        items: [
            { description: "Priority Pack Subscription (100-200 PAX)", duration: "1 Year", price: (planPrice / 1.18).toFixed(2) },
            { description: "Extra Coverage: 200-500 Guests Expansion", duration: "1 Year", price: (addonPrice / 1.18).toFixed(2) }
        ],
        gstAmount: gstAmount.toFixed(2),
        totalAmount: totalInr.toFixed(2),
        paymentMethod: "Razorpay",
        transactionId: "pay_ORCHID_PRIORITY_991",
        paymentDate: new Date().toLocaleDateString('en-IN')
    };

    try {
        console.log('Generating PDF...');
        const pdfBuffer = await generateInvoicePDF(invoiceData);
        
        const attachments = [{
            filename: `Invoice_${invoiceData.invoiceNumber}.pdf`,
            content: pdfBuffer
        }];

        console.log('Sending Email...');
        await sendPaymentConfirmationEmail(
            targetEmail,
            invoiceData.venueName,
            invoiceData.planName,
            totalInr,
            {
                invoiceNumber: invoiceData.invoiceNumber,
                billingDetails: {
                    name: invoiceData.venueName,
                    address: invoiceData.billingAddress,
                    email: targetEmail,
                    gstNumber: invoiceData.gstNumber
                },
                date: invoiceData.invoiceDate,
                addons: addons,
                basePrice: planPrice
            },
            attachments
        );

        console.log('✅ Test Invoice sent successfully!');
    } catch (error) {
        console.error('❌ Failed to send test invoice:', error.message);
    }
}

testInvoiceEmail();
