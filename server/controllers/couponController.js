const { databases, DATABASE_ID } = require('../config/appwrite');
const { ID, Query } = require('node-appwrite');

const COUPONS_COLLECTION_ID = process.env.APPWRITE_COUPONS_COLLECTION_ID || 'coupons';

exports.getAllCoupons = async (req, res) => {
  try {
    const result = await databases.listDocuments(DATABASE_ID, COUPONS_COLLECTION_ID, [Query.orderDesc('$createdAt')]);
    res.json({ status: 'success', data: result.documents });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.createCoupon = async (req, res) => {
  try {
    const { code, discountValue, discountType, expiryDate, status = 'active' } = req.body;
    
    // Check if code exists
    const existing = await databases.listDocuments(DATABASE_ID, COUPONS_COLLECTION_ID, [Query.equal('code', code.toUpperCase())]);
    if (existing.total > 0) {
      return res.status(400).json({ status: 'error', message: 'Coupon code already exists' });
    }

    const coupon = await databases.createDocument(
      DATABASE_ID,
      COUPONS_COLLECTION_ID,
      ID.unique(),
      {
        code: code.toUpperCase(),
        discountValue: parseFloat(discountValue),
        discountType,
        expiryDate,
        status,
      }
    );
    res.json({ status: 'success', data: coupon });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (updateData.code) updateData.code = updateData.code.toUpperCase();

    const coupon = await databases.updateDocument(DATABASE_ID, COUPONS_COLLECTION_ID, id, updateData);
    res.json({ status: 'success', data: coupon });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    await databases.deleteDocument(DATABASE_ID, COUPONS_COLLECTION_ID, id);
    res.json({ status: 'success', message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const result = await databases.listDocuments(DATABASE_ID, COUPONS_COLLECTION_ID, [
      Query.equal('code', code.toUpperCase()),
      Query.equal('status', 'active')
    ]);

    if (result.total === 0) {
      return res.status(404).json({ status: 'error', message: 'Invalid or inactive coupon code' });
    }

    const coupon = result.documents[0];
    const now = new Date();
    const expiry = new Date(coupon.expiryDate);

    if (now > expiry) {
      return res.status(400).json({ status: 'error', message: 'Coupon has expired' });
    }

    res.json({ status: 'success', data: coupon });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
