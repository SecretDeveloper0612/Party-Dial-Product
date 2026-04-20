const { databases, DATABASE_ID, VENUES_COLLECTION_ID } = require('../config/appwrite');
const { Query } = require('node-appwrite');

exports.getEligibleUsers = async (req, res) => {
  try {
    // Fetch users who are either paid or onboardingComplete
    // For this example, we'll fetch all venues that are on-boarded
    const result = await databases.listDocuments(DATABASE_ID, VENUES_COLLECTION_ID, [
      Query.equal('onboardingComplete', true),
      Query.limit(100),
      Query.orderDesc('$createdAt')
    ]);
    res.json({ status: 'success', data: result.documents });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.grantAccess = async (req, res) => {
  try {
    const { venueId, days, startDate, planName = 'Manual Access' } = req.body;
    
    const start = new Date(startDate || new Date());
    const expiry = new Date(start);
    expiry.setDate(start.getDate() + parseInt(days));

    const updated = await databases.updateDocument(
      DATABASE_ID,
      VENUES_COLLECTION_ID,
      venueId,
      {
        subscriptionPlan: planName,
        subscriptionExpiry: expiry.toISOString()
      }
    );

    res.json({ 
      status: 'success', 
      message: `Access granted for ${days} days until ${expiry.toLocaleDateString()}`,
      data: updated
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.revokeAccess = async (req, res) => {
  try {
    const { venueId } = req.body;
    
    const updated = await databases.updateDocument(
      DATABASE_ID,
      VENUES_COLLECTION_ID,
      venueId,
      {
        subscriptionPlan: '',
        subscriptionExpiry: new Date(0).toISOString() // Set to epoch to ensure it's expired
      }
    );

    res.json({ 
      status: 'success', 
      message: `Access revoked successfully for ${updated.venueName || 'this partner'}.`,
      data: updated
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
