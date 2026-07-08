const { sendQuotationEmail, sendClientQuotationEmail } = require('../utils/emailService');
const { databases, DATABASE_ID, ID } = require('../config/appwrite');
const PAYMENTS_COLLECTION_ID = process.env.APPWRITE_PAYMENTS_COLLECTION_ID || 'payments';

exports.sendQuotationEmail = async (req, res) => {
  try {
    const { email, venueName, planName, amount, checkoutLink, pdfData } = req.body;

    if (!email) {
      return res.status(400).json({ status: 'error', message: 'Recipient email is required' });
    }

    let attachments = [];
    if (pdfData) {
       attachments = [
          {
             filename: `Proposal_${venueName.replace(/\s+/g, '_')}.pdf`,
             content: pdfData,
             encoding: 'base64',
             contentType: 'application/pdf'
          }
       ];
    }

    await sendQuotationEmail(email, venueName, planName, amount, checkoutLink, attachments);

    // Save quotation record to Appwrite so it shows in Super Admin Dashboard
    try {
      await databases.createDocument(
        DATABASE_ID,
        PAYMENTS_COLLECTION_ID,
        ID.unique(),
        {
          razorpayOrderId: 'QUOTE_' + Date.now(),
          razorpayPaymentId: 'QUOTE_' + Date.now(),
          venueId: '',
          venueName: venueName || 'Private Client',
          ownerEmail: email || '',
          planId: '',
          planName: planName || 'Custom Quotation',
          amount: amount || 0,
          currency: 'INR',
          method: 'quote',
          status: 'Sent',
          paidAt: new Date().toISOString(), // Using as sent date for UI compatibility
          invoiceNumber: '',
          billingDetails: JSON.stringify({ email, name: venueName }),
          couponUsed: '',
          invoiceFileId: ''
        }
      );
    } catch (dbErr) {
      console.warn('Could not store quotation record in DB:', dbErr.message);
    }

    res.json({ status: 'success', message: 'Quotation sent to ' + email });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.sendClientQuotation = async (req, res) => {
  try {
    const { clientEmail, pdfData, ...quotationData } = req.body;

    if (!clientEmail) {
      return res.status(400).json({ status: 'error', message: 'Client email is required' });
    }

    let attachments = [];
    if (pdfData) {
       const fileName = `Quotation_${(quotationData.clientName || 'Client').replace(/\s+/g, '_')}_${quotationData.venueName || 'Venue'}.pdf`;
       attachments = [
          {
             filename: fileName,
             content: pdfData,
             encoding: 'base64',
             contentType: 'application/pdf'
          }
       ];
    }

    await sendClientQuotationEmail(clientEmail, quotationData, attachments);

    res.json({ status: 'success', message: 'Quotation emailed to ' + clientEmail });
  } catch (error) {
    console.error('Client email send error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};
