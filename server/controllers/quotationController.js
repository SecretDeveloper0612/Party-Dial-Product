const { sendQuotationEmail } = require('../utils/emailService');

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

    res.json({ status: 'success', message: 'Quotation sent to ' + email });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};
