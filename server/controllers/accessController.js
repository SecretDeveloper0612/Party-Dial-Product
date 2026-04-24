const { databases, DATABASE_ID, VENUES_COLLECTION_ID } = require('../config/appwrite');
const { Query } = require('node-appwrite');

exports.getEligibleUsers = async (req, res) => {
  try {
    // Fetch all venues so admin can grant access to anyone (even if onboarding is incomplete)
    const result = await databases.listDocuments(DATABASE_ID, VENUES_COLLECTION_ID, [
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

    // --- FETCH & UPDATE BILLING DETAILS FOR PAID_SINCE ---
    let billingDetails = '{}';
    let currentVenue = null;
    try {
      currentVenue = await databases.getDocument(DATABASE_ID, VENUES_COLLECTION_ID, venueId);
      let billingObj = {};
      try {
        billingObj = typeof currentVenue.billingDetails === 'string' ? JSON.parse(currentVenue.billingDetails) : (currentVenue.billingDetails || {});
      } catch (e) { billingObj = {}; }
      
      // Use the start date for paidSince to ensure they see leads from that day onwards
      billingObj.paidSince = start.toISOString();
      billingDetails = JSON.stringify(billingObj);
    } catch (e) { console.warn('Could not update billingDetails during manual grant'); }

    const updatePayload = {
      subscriptionPlan: planName,
      subscriptionExpiry: expiry.toISOString(),
      billingDetails: billingDetails,
      isVerified: true,
      status: 'active',
      onboardingComplete: true
    };

    // Ensure capacity is present and valid as it's required for lead distribution
    if (!currentVenue || currentVenue.capacity === undefined || currentVenue.capacity === null || currentVenue.capacity < 1) {
      updatePayload.capacity = 1;
    }

    let updated;
    try {
      updated = await databases.updateDocument(
        DATABASE_ID,
        VENUES_COLLECTION_ID,
        venueId,
        updatePayload
      );
    } catch (updateErr) {
      // Fallback: If billingDetails attribute doesn't exist in Appwrite yet,
      // retry the update without it so the access can still be granted.
      if (updateErr.message && updateErr.message.includes('billingDetails')) {
        console.warn('billingDetails attribute missing, retrying update without it...');
        const safePayload = { ...updatePayload };
        delete safePayload.billingDetails;
        updated = await databases.updateDocument(
          DATABASE_ID,
          VENUES_COLLECTION_ID,
          venueId,
          safePayload
        );
      } else {
        throw updateErr;
      }
    }

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
        subscriptionExpiry: new Date(0).toISOString(), // Set to epoch to ensure it's expired
        status: 'inactive'
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
