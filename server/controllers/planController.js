const { databases, DATABASE_ID } = require('../config/appwrite');
const { ID, Query } = require('node-appwrite');

const PLANS_COLLECTION_ID = process.env.APPWRITE_PLANS_COLLECTION_ID || 'plans';

// Default plans to return if collection doesn't exist or is empty
const DEFAULT_PLANS = [
  {
    $id: "trial_30",
    name: "₹11 Starter Plan",
    price: 11,
    duration: 30,
    leadLimit: 5,
    features: ["Dashboard Access", "Realtime WhatsApp Alerts", "Priority Support"],
    status: "active",
    $createdAt: new Date().toISOString()
  }
];

exports.getAllPlans = async (req, res) => {
  try {
    const result = await databases.listDocuments(DATABASE_ID, PLANS_COLLECTION_ID);
    
    // If empty, return defaults
    if (result.total === 0) {
      return res.json({ status: 'success', data: DEFAULT_PLANS, message: 'Using default plans' });
    }

    // Parse features if they are stored as JSON strings
    const docs = result.documents.map(doc => ({
      ...doc,
      features: typeof doc.features === 'string' ? JSON.parse(doc.features) : (doc.features || [])
    }));

    res.json({ status: 'success', data: docs });
  } catch (error) {
    // console.warn('Plans collection not found or accessible, using defaults');
    res.json({ status: 'success', data: DEFAULT_PLANS, message: 'Using default plans (Collection missing)' });
  }
};

exports.createPlan = async (req, res) => {
  try {
    const { name, price, duration, leadLimit, features, status } = req.body;
    
    const planData = {
      name,
      price: parseInt(price),
      duration: parseInt(duration),
      leadLimit: parseInt(leadLimit),
      features: Array.isArray(features) ? JSON.stringify(features) : '[]',
      status: status || 'active'
    };

    const result = await databases.createDocument(
      DATABASE_ID,
      PLANS_COLLECTION_ID,
      ID.unique(),
      planData
    );

    res.json({ status: 'success', data: result });
  } catch (error) {
    if (error.message.includes('not be found')) {
      return res.status(404).json({ 
        status: 'error', 
        message: "Appwrite Error: The 'plans' collection is missing. Please create a collection with ID 'plans' in your Appwrite dashboard and add these attributes: name (string), price (integer), duration (integer), leadLimit (integer), features (string), status (string)." 
      });
    }
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, duration, leadLimit, features, status } = req.body;

    const planData = {};
    if (name) planData.name = name;
    if (price !== undefined) planData.price = parseInt(price);
    if (duration !== undefined) planData.duration = parseInt(duration);
    if (leadLimit !== undefined) planData.leadLimit = parseInt(leadLimit);
    if (features) planData.features = Array.isArray(features) ? JSON.stringify(features) : '[]';
    if (status) planData.status = status;

    const result = await databases.updateDocument(
      DATABASE_ID,
      PLANS_COLLECTION_ID,
      id,
      planData
    );

    res.json({ status: 'success', data: result });
  } catch (error) {
    if (error.message.includes('not be found')) {
      return res.status(404).json({ 
        status: 'error', 
        message: "Appwrite Error: The 'plans' collection is missing. Please create a collection with ID 'plans' in your Appwrite dashboard and add these attributes: name (string), price (integer), duration (integer), leadLimit (integer), features (string), status (string)." 
      });
    }
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    await databases.deleteDocument(DATABASE_ID, PLANS_COLLECTION_ID, id);
    res.json({ status: 'success', message: 'Plan deleted' });
  } catch (error) {
    if (error.message.includes('not be found')) {
      return res.status(404).json({ 
        status: 'error', 
        message: "Appwrite Error: The 'plans' collection is missing. Please create a collection with ID 'plans' in your Appwrite dashboard and add these attributes: name (string), price (integer), duration (integer), leadLimit (integer), features (string), status (string)." 
      });
    }
    res.status(500).json({ status: 'error', message: error.message });
  }
};
