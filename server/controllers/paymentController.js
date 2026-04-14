const Razorpay = require('razorpay');
const crypto = require('crypto');
const { databases, DATABASE_ID, VENUES_COLLECTION_ID } = require('../config/appwrite');
const { ID, Query } = require('node-appwrite');
const { sendPaymentConfirmationEmail } = require('../utils/emailService');


// Payments collection ID from env (we'll create it or use a hardcoded fallback)
const PAYMENTS_COLLECTION_ID = process.env.APPWRITE_PAYMENTS_COLLECTION_ID || 'payments';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, venueId } = req.body;
    const amountVal = parseInt(String(amount));

    // Dynamic Plan Check (optional enhancement)
    let isPromotional = amountVal === 1100;
    
    // Check if promotional plans have been overridden in DB
    try {
      const plansResult = await databases.listDocuments(DATABASE_ID, 'plans', [Query.equal('price', 11), Query.equal('status', 'inactive')]);
      if (plansResult.total > 0 && isPromotional) {
         return res.status(403).json({ status: 'error', message: "This promotional plan has been deactivated by the administrator." });
      }
    } catch (e) { /* collection might not exist yet */ }

    // ── DUPLICATE PURCHASE CHECK ──
    // If it's a trial plan (1100 paise), check if venue already has it
    if (venueId && parseInt(String(amount)) === 1100) {
      try {
        const venue = await databases.getDocument(DATABASE_ID, VENUES_COLLECTION_ID, venueId);
        if (venue.subscriptionPlan) {
          return res.status(403).json({ 
            status: 'error', 
            message: "You already have an active subscription and cannot purchase the trial pack again." 
          });
        }
      } catch (e) {
        console.warn('Venue check failed during order creation:', e.message);
      }
    }

    const options = {
      amount: amount,
      currency,
      receipt,
    };

    // ── PROMOTIONAL DEADLINE CHECK ──
    // The ₹11 trial plan (1100 paise) is only valid until April 20th, 2026.
    if (parseInt(String(amount)) === 1100) {
        const deadline = new Date('2026-04-20T23:59:59');
        if (new Date() > deadline) {
            return res.status(403).json({ 
                status: 'error', 
                message: "The ₹11 promotional offer has expired. Please select a standard subscription plan." 
            });
        }
    }

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      venueId,
      venueName,
      ownerEmail,
      planId,
      planName,
      amount
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ status: 'error', message: "Invalid signature sent!" });
    }

    // Fetch payment details from Razorpay for complete info
    let paymentDetails = {};
    try {
      paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
    } catch (e) {
      console.warn('Could not fetch Razorpay payment details:', e.message);
    }

    // Store the payment record in Appwrite
    try {
      await databases.createDocument(
        DATABASE_ID,
        PAYMENTS_COLLECTION_ID,
        ID.unique(),
        {
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          venueId: venueId || '',
          venueName: venueName || '',
          ownerEmail: ownerEmail || '',
          planId: planId || '',
          planName: planName || '',
          amount: amount || (paymentDetails.amount ? paymentDetails.amount / 100 : 0),
          currency: paymentDetails.currency || 'INR',
          method: paymentDetails.method || 'razorpay',
          status: 'captured',
          paidAt: new Date().toISOString(),
        }
      );
    } catch (dbErr) {
      // If payments collection doesn't exist yet, log but don't fail the payment
      console.warn('Could not store payment record (collection may not exist):', dbErr.message);
    }

    // ── UPDATE VENUE SUBSCRIPTION STATUS ──
    try {
      if (venueId) {
        // Calculate expiry: ₹11 plan expires April 30, 2026. Others are 1 Year.
        let expiryDate = new Date();
        if (parseInt(String(amount)) === 1100) {
            expiryDate = new Date('2026-04-30T23:59:59');
        } else {
            expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1-year standard
        }

        await databases.updateDocument(
          DATABASE_ID,
          VENUES_COLLECTION_ID,
          venueId,
          {
            subscriptionPlan: planName || 'Standard',
            subscriptionExpiry: expiryDate.toISOString()
          }
        );
        console.log(`Venue ${venueId} updated to ${planName} plan until ${expiryDate.toISOString()}`);
      }
    } catch (venueErr) {
      console.error('Failed to update venue subscription status:', venueErr.message);
    }

    // Send payment confirmation email (Non-blocking but logged)
    if (ownerEmail) {
      sendPaymentConfirmationEmail(
        ownerEmail,
        venueName || 'Partner',
        planName || 'Subscription Plan',
        amount || (paymentDetails.amount ? paymentDetails.amount / 100 : 0)
      )
      .then(() => console.log(`Payment confirmation email triggered for ${ownerEmail}`))
      .catch(err => console.error(`Failed to send payment email to ${ownerEmail}:`, err.message));
    }

    return res.status(200).json({ status: 'success', message: "Payment verified successfully" });
  } catch (error) {
    console.error('Razorpay Verify Error:', error);
    res.status(500).json({ status: 'error', error: error.message });
  }
};

// GET all subscription payments — for admin billing
exports.getAllPayments = async (req, res) => {
  try {
    // Try to fetch from our Appwrite payments collection
    try {
      const result = await databases.listDocuments(
        DATABASE_ID,
        PAYMENTS_COLLECTION_ID,
        [Query.orderDesc('$createdAt'), Query.limit(100)]
      );
      return res.status(200).json({ status: 'success', data: result.documents, source: 'appwrite' });
    } catch (dbErr) {
      // If the collection doesn't exist, fall back to Razorpay API
      console.warn('Appwrite payments collection not available, falling back to Razorpay API');
    }

    // Fallback: fetch payments directly from Razorpay
    const from = Math.floor(Date.now() / 1000) - (90 * 24 * 60 * 60); // last 90 days
    const payments = await razorpay.payments.all({ from, count: 100 });

    const mapped = (payments.items || []).map(p => ({
      $id: p.id,
      razorpayPaymentId: p.id,
      razorpayOrderId: p.order_id,
      venueName: p.description || '—',
      ownerEmail: p.email || '—',
      planName: p.description || '—',
      amount: p.amount / 100,
      currency: p.currency,
      method: p.method,
      status: p.status,
      paidAt: new Date(p.created_at * 1000).toISOString(),
    }));

    return res.status(200).json({ status: 'success', data: mapped, source: 'razorpay' });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
};
