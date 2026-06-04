import Razorpay from 'razorpay';
import crypto from 'node:crypto';
import { ID, Query } from 'node-appwrite';
import { getAppwriteServices } from '../utils/appwrite';

const getRazorpayInstance = (env) => {
  return new Razorpay({
    key_id: env.RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_KEY_SECRET,
  });
};

export const createOrder = async (c) => {
  try {
    const body = await c.req.json();
    const { amount, currency = 'INR', receipt, venueId } = body;
    const amountVal = parseInt(String(amount));
    let isPromotional = amountVal === 1100;

    const { databases, databaseId, collections } = getAppwriteServices(c.env);

    try {
      const plansResult = await databases.listDocuments(databaseId, 'plans', [Query.equal('price', 11), Query.equal('status', 'inactive')]);
      if (plansResult.total > 0 && isPromotional) {
         return c.json({ status: 'error', message: "This promotional plan has been deactivated by the administrator." }, 403);
      }
    } catch (e) { }

    if (venueId && amountVal === 1100) {
      try {
        const venue = await databases.getDocument(databaseId, collections.venues, venueId);
        if (venue.subscriptionPlan) {
          return c.json({ status: 'error', message: "You already have an active subscription and cannot purchase the trial pack again." }, 403);
        }
      } catch (e) {}
    }

    if (amountVal === 1100) {
        const deadline = new Date('2026-04-20T23:59:59');
        if (new Date() > deadline) {
            return c.json({ status: 'error', message: "The ₹11 promotional offer has expired." }, 403);
        }
    }

    const razorpay = getRazorpayInstance(c.env);
    const order = await razorpay.orders.create({ amount, currency, receipt });
    return c.json(order, 200);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
};

export const verifyPayment = async (c) => {
  try {
    const body = await c.req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, venueId, venueName, ownerEmail, planId, planName, billingDuration, amount, billingDetails, couponUsed } = body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", c.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return c.json({ status: 'error', message: "Invalid signature sent!" }, 400);
    }

    const razorpay = getRazorpayInstance(c.env);
    let paymentDetails = {};
    try {
      paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
    } catch (e) {}

    const { databases, databaseId, collections } = getAppwriteServices(c.env);
    const PAYMENTS_COLLECTION_ID = c.env.APPWRITE_PAYMENTS_COLLECTION_ID || 'payments';
    let invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
    
    // PDF Generation Logic (Stubbed for Cloudflare Workers limits)
    let invoiceFileId = null;

    try {
      await databases.createDocument(databaseId, PAYMENTS_COLLECTION_ID, ID.unique(), {
          razorpayOrderId: razorpay_order_id, razorpayPaymentId: razorpay_payment_id,
          venueId: venueId || '', venueName: venueName || billingDetails?.name || '',
          ownerEmail: ownerEmail || billingDetails?.email || '', planId: planId || '',
          planName: planName || '', amount: amount, currency: paymentDetails.currency || 'INR',
          method: paymentDetails.method || 'razorpay', status: 'captured', paidAt: new Date().toISOString(),
          invoiceNumber, billingDetails: JSON.stringify(billingDetails), couponUsed: couponUsed || '',
          invoiceFileId: invoiceFileId || ''
      });
    } catch (e) {}

    try {
      if (venueId) {
        const startDate = new Date();
        let expiryDate = new Date(startDate);
        const durationMonths = billingDuration === 'quarterly' ? 3 : billingDuration === 'halfYearly' ? 6 : 12;
        expiryDate.setMonth(expiryDate.getMonth() + durationMonths);

        let updatedBilling = typeof billingDetails === 'string' ? JSON.parse(billingDetails) : (billingDetails || {});
        updatedBilling.paidSince = startDate.toISOString();

        await databases.updateDocument(databaseId, collections.venues, venueId, {
            subscriptionPlan: planName || 'Standard',
            subscriptionExpiry: expiryDate.toISOString(),
            billingDetails: JSON.stringify(updatedBilling)
        });
      }
    } catch (e) {}

    return c.json({ status: 'success', message: "Payment verified successfully" }, 200);
  } catch (error) {
    return c.json({ status: 'error', error: error.message }, 500);
  }
};

export const getAllPayments = async (c) => {
  try {
    const { databases, databaseId } = getAppwriteServices(c.env);
    const PAYMENTS_COLLECTION_ID = c.env.APPWRITE_PAYMENTS_COLLECTION_ID || 'payments';

    try {
      const result = await databases.listDocuments(databaseId, PAYMENTS_COLLECTION_ID, [Query.orderDesc('$createdAt'), Query.limit(100)]);
      return c.json({ status: 'success', data: result.documents, source: 'appwrite' }, 200);
    } catch (dbErr) {}

    const razorpay = getRazorpayInstance(c.env);
    const from = Math.floor(Date.now() / 1000) - (90 * 24 * 60 * 60);
    const payments = await razorpay.payments.all({ from, count: 100 });

    const mapped = (payments.items || []).map(p => ({
      $id: p.id, razorpayPaymentId: p.id, razorpayOrderId: p.order_id,
      venueName: p.description || '—', ownerEmail: p.email || '—', planName: p.description || '—',
      amount: p.amount / 100, currency: p.currency, method: p.method, status: p.status,
      paidAt: new Date(p.created_at * 1000).toISOString(),
    }));

    return c.json({ status: 'success', data: mapped, source: 'razorpay' }, 200);
  } catch (error) {
    return c.json({ status: 'error', message: error.message }, 500);
  }
};
