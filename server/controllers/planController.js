const { databases, DATABASE_ID } = require('../config/appwrite');
const { ID, Query } = require('node-appwrite');

const PLANS_COLLECTION_ID = process.env.APPWRITE_PLANS_COLLECTION_ID || 'plans';

// Default plans to return if collection doesn't exist or is empty
const DEFAULT_PLANS = [];

exports.getAllPlans = async (req, res) => {
  try {
    // We prioritize the specialized professional plans for the quotation system
    // even if the database has other operational plans.
    let docs = [];
    try {
      const result = await databases.listDocuments(DATABASE_ID, PLANS_COLLECTION_ID);
      docs = result.documents.map(doc => ({
        ...doc,
        features: typeof doc.features === 'string' ? JSON.parse(doc.features) : (doc.features || [])
      }));
    } catch (dbErr) {
      console.log("Database plans not found, using professional defaults only.");
    }

    // Merge or prioritize default professional plans
    const combinedPlans = [...DEFAULT_PLANS];
    
    // Only add database plans if they don't overlap with our professional IDs
    docs.forEach(d => {
       if (!combinedPlans.find(p => p.$id === d.$id)) {
          combinedPlans.push(d);
       }
    });

    res.json({ status: 'success', data: combinedPlans });
  } catch (error) {
    res.json({ status: 'success', data: DEFAULT_PLANS, message: 'System fallback to professional plans' });
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
