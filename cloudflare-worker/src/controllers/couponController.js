import { ID, Query } from 'node-appwrite';
import { getAppwriteServices } from '../utils/appwrite';

export const getAllCoupons = async (c) => {
  try {
    const { databases, databaseId } = getAppwriteServices(c.env);
    const COUPONS_COLLECTION_ID = c.env.APPWRITE_COUPONS_COLLECTION_ID || 'coupons';
    const result = await databases.listDocuments(databaseId, COUPONS_COLLECTION_ID, [Query.orderDesc('$createdAt')]);
    return c.json({ status: 'success', data: result.documents }, 200);
  } catch (error) {
    return c.json({ status: 'error', message: error.message }, 500);
  }
};

export const createCoupon = async (c) => {
  try {
    const { code, discountValue, discountType, expiryDate, status = 'active' } = await c.req.json();
    const { databases, databaseId } = getAppwriteServices(c.env);
    const COUPONS_COLLECTION_ID = c.env.APPWRITE_COUPONS_COLLECTION_ID || 'coupons';

    const existing = await databases.listDocuments(databaseId, COUPONS_COLLECTION_ID, [Query.equal('code', code.toUpperCase())]);
    if (existing.total > 0) return c.json({ status: 'error', message: 'Coupon code already exists' }, 400);

    const coupon = await databases.createDocument(databaseId, COUPONS_COLLECTION_ID, ID.unique(), {
        code: code.toUpperCase(), discountValue: parseFloat(discountValue), discountType, expiryDate, status
    });
    return c.json({ status: 'success', data: coupon }, 201);
  } catch (error) {
    return c.json({ status: 'error', message: error.message }, 500);
  }
};

export const updateCoupon = async (c) => {
  try {
    const id = c.req.param('id');
    const updateData = await c.req.json();
    if (updateData.code) updateData.code = updateData.code.toUpperCase();

    const { databases, databaseId } = getAppwriteServices(c.env);
    const COUPONS_COLLECTION_ID = c.env.APPWRITE_COUPONS_COLLECTION_ID || 'coupons';
    const coupon = await databases.updateDocument(databaseId, COUPONS_COLLECTION_ID, id, updateData);
    return c.json({ status: 'success', data: coupon }, 200);
  } catch (error) {
    return c.json({ status: 'error', message: error.message }, 500);
  }
};

export const deleteCoupon = async (c) => {
  try {
    const id = c.req.param('id');
    const { databases, databaseId } = getAppwriteServices(c.env);
    const COUPONS_COLLECTION_ID = c.env.APPWRITE_COUPONS_COLLECTION_ID || 'coupons';
    await databases.deleteDocument(databaseId, COUPONS_COLLECTION_ID, id);
    return c.json({ status: 'success', message: 'Coupon deleted' }, 200);
  } catch (error) {
    return c.json({ status: 'error', message: error.message }, 500);
  }
};

export const validateCoupon = async (c) => {
  try {
    const { code } = await c.req.json();
    const { databases, databaseId } = getAppwriteServices(c.env);
    const COUPONS_COLLECTION_ID = c.env.APPWRITE_COUPONS_COLLECTION_ID || 'coupons';
    
    const result = await databases.listDocuments(databaseId, COUPONS_COLLECTION_ID, [
      Query.equal('code', code.toUpperCase()), Query.equal('status', 'active')
    ]);

    if (result.total === 0) return c.json({ status: 'error', message: 'Invalid or inactive coupon code' }, 404);

    const coupon = result.documents[0];
    if (new Date() > new Date(coupon.expiryDate)) return c.json({ status: 'error', message: 'Coupon has expired' }, 400);

    return c.json({ status: 'success', data: coupon }, 200);
  } catch (error) {
    return c.json({ status: 'error', message: error.message }, 500);
  }
};
