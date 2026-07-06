import { sendQuotationEmail } from '../utils/emailService';

export const sendQuotation = async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const { email, venueName, planName, amount, checkoutLink, pdfData } = body;

    if (!email) {
      return c.json({ status: 'error', message: 'Recipient email is required' }, 400);
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

    await sendQuotationEmail(c.env, email, venueName, planName, amount, checkoutLink, attachments);

    return c.json({ status: 'success', message: 'Quotation sent to ' + email }, 200);
  } catch (error) {
    console.error('Email send error:', error);
    return c.json({ status: 'error', message: error.message }, 500);
  }
};
