const { databases, users, DATABASE_ID, VENUES_COLLECTION_ID, LEADS_COLLECTION_ID } = require('../config/appwrite');
const { ID, Query, Permission, Role } = require('node-appwrite');

/**
 * Submit a claim request for a venue from the public client portal.
 * Stored safely in LEADS_COLLECTION_ID with eventType = 'VENUE_CLAIM_REQUEST'.
 * No changes to database schema required.
 */
exports.submitClaim = async (req, res) => {
  try {
    const { venueId, claimantName, claimantRole, phone, email, notes, documents } = req.body;

    if (!venueId || !claimantName || !phone || !email) {
      return res.status(400).json({
        status: 'error',
        message: 'Venue ID, your name, phone number, and email are required to claim this venue.'
      });
    }

    // Fetch venue to verify it exists and is unclaimed
    const venue = await databases.getDocument(DATABASE_ID, VENUES_COLLECTION_ID, venueId);
    if (!venue) {
      return res.status(404).json({ status: 'error', message: 'Venue not found.' });
    }

    if (venue.userId && venue.userId !== 'admin_import' && venue.userId !== 'admin_claimed' && !venue.userId.startsWith('admin_')) {
      return res.status(400).json({
        status: 'error',
        message: 'This venue has already been claimed and verified by its owner.'
      });
    }

    // Prepare claim record
    const claimPayload = {
      venueId: venue.$id,
      venueName: venue.venueName || venue.name || 'Unnamed Venue',
      claimantName: claimantName.trim(),
      claimantRole: claimantRole || 'Owner / Managing Director',
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      city: venue.city || 'Unknown',
      notes: notes || '',
      documents: documents || '',
      submittedAt: new Date().toISOString()
    };

    // Store in LEADS_COLLECTION_ID with eventType: 'VENUE_CLAIM_REQUEST'
    const claimDoc = await databases.createDocument(
      DATABASE_ID,
      LEADS_COLLECTION_ID,
      ID.unique(),
      {
        venueId: venue.$id,
        name: claimantName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        eventType: 'VENUE_CLAIM_REQUEST',
        guests: 1,
        notes: JSON.stringify(claimPayload),
        status: 'Pending Claim',
        createdAt: new Date().toISOString()
      }
    );

    return res.status(201).json({
      status: 'success',
      message: 'Your claim request has been submitted successfully! The PartyDial team will coordinate with you shortly.',
      data: claimDoc
    });
  } catch (error) {
    console.error('Error submitting venue claim:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to submit claim request.'
    });
  }
};

/**
 * Get all claim requests for Admin Claims & Verification dashboard.
 */
exports.getAllClaims = async (req, res) => {
  try {
    const claims = await databases.listDocuments(
      DATABASE_ID,
      LEADS_COLLECTION_ID,
      [
        Query.equal('eventType', 'VENUE_CLAIM_REQUEST'),
        Query.orderDesc('$createdAt'),
        Query.limit(500)
      ]
    );

    const formatted = claims.documents.map(doc => {
      let meta = {};
      try {
        meta = JSON.parse(doc.notes || '{}');
      } catch (e) {
        meta = {};
      }

      return {
        id: doc.$id,
        venueId: doc.venueId,
        venueName: meta.venueName || 'Venue #' + doc.venueId,
        claimantName: doc.name || meta.claimantName || 'Unknown',
        claimantRole: meta.claimantRole || 'Owner',
        phone: doc.phone || meta.phone || '',
        email: doc.email || meta.email || '',
        city: meta.city || '',
        status: doc.status || 'Pending Claim',
        createdAt: doc.createdAt || doc.$createdAt,
        notes: meta.notes || '',
        documents: meta.documents || ''
      };
    });

    return res.status(200).json({
      status: 'success',
      data: formatted
    });
  } catch (error) {
    console.error('Error fetching claims for admin:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch claim requests.'
    });
  }
};

/**
 * Approve a claim:
 * 1. Creates/Links an Appwrite Auth account with 'vendor' label for the claimant.
 * 2. Links the venue document's userId to this claimant's user.$id.
 * 3. Updates permissions so the vendor can manage their venue in the Vendor Portal.
 * 4. Updates claim lead status to 'Approved'.
 */
exports.approveClaim = async (req, res) => {
  try {
    const { id } = req.params; // lead/claim id
    const { password } = req.body; // optional initial password

    const claimDoc = await databases.getDocument(DATABASE_ID, LEADS_COLLECTION_ID, id);
    if (!claimDoc) {
      return res.status(404).json({ status: 'error', message: 'Claim request not found.' });
    }

    let meta = {};
    try {
      meta = JSON.parse(claimDoc.notes || '{}');
    } catch (e) {
      meta = {};
    }

    const email = (claimDoc.email || meta.email)?.trim().toLowerCase();
    const phone = claimDoc.phone || meta.phone;
    const name = claimDoc.name || meta.claimantName || 'Vendor Partner';
    const venueId = claimDoc.venueId;

    if (!venueId || !email) {
      return res.status(400).json({ status: 'error', message: 'Missing venueId or email in claim record.' });
    }

    // 1. Create or Find Appwrite User in Auth
    let authUserId = null;
    try {
      const existingUsers = await users.list([Query.equal('email', email)]);
      if (existingUsers.total > 0) {
        const u = existingUsers.users[0];
        authUserId = u.$id;
        const currentLabels = u.labels || [];
        if (!currentLabels.includes('vendor')) {
          await users.updateLabels(authUserId, [...currentLabels, 'vendor']);
        }
        if (password) {
          await users.updatePassword(authUserId, password);
        }
      } else {
        const tempPassword = password || `PD@${Math.floor(100000 + Math.random() * 900000)}`;
        const newUser = await users.create(ID.unique(), email, undefined, tempPassword, name);
        authUserId = newUser.$id;
        try {
          await users.updateLabels(authUserId, ['vendor']);
        } catch (labelErr) {
          console.warn('Failed to assign vendor label:', labelErr.message);
        }
      }
    } catch (authErr) {
      console.error('Appwrite Auth user error in approveClaim:', authErr);
      return res.status(400).json({
        status: 'error',
        message: `Failed to create/assign vendor login account: ${authErr.message}`
      });
    }

    // 2. Link Venue to authUserId and set permissions
    const permissions = [
      Permission.read(Role.user(authUserId)),
      Permission.update(Role.user(authUserId)),
      Permission.delete(Role.user(authUserId)),
      Permission.read(Role.any())
    ];

    await databases.updateDocument(
      DATABASE_ID,
      VENUES_COLLECTION_ID,
      venueId,
      {
        userId: authUserId,
        ownerName: name,
        contactEmail: email,
        contactNumber: phone || '',
        isVerified: true
      },
      permissions
    );

    // 3. Mark claim as Approved
    meta.approvedAt = new Date().toISOString();
    meta.assignedUserId = authUserId;
    await databases.updateDocument(
      DATABASE_ID,
      LEADS_COLLECTION_ID,
      id,
      {
        status: 'Approved',
        notes: JSON.stringify(meta)
      }
    );

    return res.status(200).json({
      status: 'success',
      message: 'Claim approved successfully! Venue is now transferred to the vendor partner account.',
      authUserId
    });
  } catch (error) {
    console.error('Error approving claim:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to approve claim.'
    });
  }
};

/**
 * Reject or coordinate a claim request
 */
exports.updateClaimStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, coordinatorNotes } = req.body;

    const claimDoc = await databases.getDocument(DATABASE_ID, LEADS_COLLECTION_ID, id);
    if (!claimDoc) {
      return res.status(404).json({ status: 'error', message: 'Claim request not found.' });
    }

    let meta = {};
    try {
      meta = JSON.parse(claimDoc.notes || '{}');
    } catch (e) {
      meta = {};
    }

    if (coordinatorNotes) {
      meta.coordinatorNotes = coordinatorNotes;
    }
    meta.updatedAt = new Date().toISOString();

    const updated = await databases.updateDocument(
      DATABASE_ID,
      LEADS_COLLECTION_ID,
      id,
      {
        status: status || claimDoc.status,
        notes: JSON.stringify(meta)
      }
    );

    return res.status(200).json({
      status: 'success',
      message: `Claim request status updated to ${status}.`,
      data: updated
    });
  } catch (error) {
    console.error('Error updating claim status:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to update claim status.'
    });
  }
};
