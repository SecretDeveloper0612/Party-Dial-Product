const { databases, DATABASE_ID } = require('../config/appwrite');
const { ID, Query } = require('node-appwrite');

const PLANS_COLLECTION_ID = process.env.APPWRITE_PLANS_COLLECTION_ID || 'plans';

// Default plans to return if collection doesn't exist or is empty
const DEFAULT_PLANS = [
  {
    $id: 'plan_partner_pro_monthly',
    name: 'Partner Pro Membership (Monthly)',
    price: 7000,
    mrp: 8999,
    monthlyRate: 7000,
    duration: 30,
    billingDuration: 'monthly',
    leadLimit: 99999,
    features: [
      'Unlimited Verified Leads',
      'Direct WhatsApp & Email Alerts',
      'Top Search & Category Placement',
      'Full CRM & Lead Pipeline Access',
      'Quotation Builder & Digital PDF Invoices',
      'Venue Booking & Event Calendar',
      'Dedicated Account Support'
    ],
    status: 'active'
  },
  {
    $id: 'plan_partner_pro_quarterly',
    name: 'Partner Pro Membership (Quarterly)',
    price: 15000,
    mrp: 26997,
    monthlyRate: 5000,
    duration: 90,
    billingDuration: 'quarterly',
    leadLimit: 99999,
    features: [
      'Unlimited Customer Inquiries',
      'Priority City Search Placement',
      'Direct WhatsApp & Phone Connect',
      'Lead CRM & Status Pipeline',
      'Quotation & Digital Invoice Maker',
      'Priority Email & Chat Support'
    ],
    status: 'active'
  },
  {
    $id: 'plan_partner_pro_halfyearly',
    name: 'Partner Pro Membership (Half-Yearly)',
    price: 24000,
    mrp: 53994,
    monthlyRate: 4000,
    duration: 180,
    billingDuration: 'halfYearly',
    leadLimit: 99999,
    features: [
      'Everything in Quarterly Plan',
      'Billed ₹24,000 for 6 Months (₹4,000/mo)',
      'Save 55% vs Monthly MRP',
      'Priority Lead Dispatch Engine',
      'Verified Partner Listing Badge'
    ],
    status: 'active'
  },
  {
    $id: 'plan_partner_pro_yearly',
    name: 'Partner Pro Membership (Annual)',
    price: 42000,
    mrp: 107988,
    monthlyRate: 3500,
    duration: 365,
    billingDuration: 'annually',
    leadLimit: 99999,
    features: [
      'Everything in Half-Yearly Plan',
      'Billed ₹42,000 for 12 Months (₹3,500/mo)',
      'Maximum Savings: 61% off MRP',
      'Highest City Ranking & Featured Spotlight',
      'Premium Lead Routing Algorithm',
      'Dedicated Account Manager'
    ],
    status: 'active'
  }
];

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
