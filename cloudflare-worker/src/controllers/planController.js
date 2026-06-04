import { ID, Query } from 'node-appwrite';
import { getAppwriteServices } from '../utils/appwrite';

const DEFAULT_PLANS = [];

export const getAllPlans = async (c) => {
  try {
    const { databases, databaseId } = getAppwriteServices(c.env);
    const PLANS_COLLECTION_ID = c.env.APPWRITE_PLANS_COLLECTION_ID || 'plans';
    
    let docs = [];
    try {
      const result = await databases.listDocuments(databaseId, PLANS_COLLECTION_ID);
      docs = result.documents.map(doc => ({
        ...doc,
        features: typeof doc.features === 'string' ? JSON.parse(doc.features) : (doc.features || [])
      }));
    } catch (dbErr) {}

    const combinedPlans = [...DEFAULT_PLANS];
    docs.forEach(d => {
       if (!combinedPlans.find(p => p.$id === d.$id)) {
          combinedPlans.push(d);
       }
    });

    return c.json({ status: 'success', data: combinedPlans }, 200);
  } catch (error) {
    return c.json({ status: 'success', data: DEFAULT_PLANS, message: 'System fallback to professional plans' }, 200);
  }
};

export const createPlan = async (c) => {
  try {
    const { name, price, duration, leadLimit, features, status } = await c.req.json();
    const { databases, databaseId } = getAppwriteServices(c.env);
    const PLANS_COLLECTION_ID = c.env.APPWRITE_PLANS_COLLECTION_ID || 'plans';
    
    const planData = {
      name, price: parseInt(price), duration: parseInt(duration), leadLimit: parseInt(leadLimit),
      features: Array.isArray(features) ? JSON.stringify(features) : '[]', status: status || 'active'
    };

    const result = await databases.createDocument(databaseId, PLANS_COLLECTION_ID, ID.unique(), planData);
    return c.json({ status: 'success', data: result }, 201);
  } catch (error) {
    return c.json({ status: 'error', message: error.message }, 500);
  }
};

export const updatePlan = async (c) => {
  try {
    const id = c.req.param('id');
    const { name, price, duration, leadLimit, features, status } = await c.req.json();
    const { databases, databaseId } = getAppwriteServices(c.env);
    const PLANS_COLLECTION_ID = c.env.APPWRITE_PLANS_COLLECTION_ID || 'plans';

    const planData = {};
    if (name) planData.name = name;
    if (price !== undefined) planData.price = parseInt(price);
    if (duration !== undefined) planData.duration = parseInt(duration);
    if (leadLimit !== undefined) planData.leadLimit = parseInt(leadLimit);
    if (features) planData.features = Array.isArray(features) ? JSON.stringify(features) : '[]';
    if (status) planData.status = status;

    const result = await databases.updateDocument(databaseId, PLANS_COLLECTION_ID, id, planData);
    return c.json({ status: 'success', data: result }, 200);
  } catch (error) {
    return c.json({ status: 'error', message: error.message }, 500);
  }
};

export const deletePlan = async (c) => {
  try {
    const id = c.req.param('id');
    const { databases, databaseId } = getAppwriteServices(c.env);
    const PLANS_COLLECTION_ID = c.env.APPWRITE_PLANS_COLLECTION_ID || 'plans';
    await databases.deleteDocument(databaseId, PLANS_COLLECTION_ID, id);
    return c.json({ status: 'success', message: 'Plan deleted' }, 200);
  } catch (error) {
    return c.json({ status: 'error', message: error.message }, 500);
  }
};
