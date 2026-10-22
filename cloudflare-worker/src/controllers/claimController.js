import { ID, Query, Permission, Role } from 'node-appwrite';
import { getAppwriteServices } from '../utils/appwrite';

/**
 * Submit a claim request for a venue from the public client portal.
 * Stored safely in LEADS_COLLECTION_ID with eventType = 'VENUE_CLAIM_REQUEST'.
 */
export const submitClaim = async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const { venueId, claimantName, claimantRole, phone, email, notes, documents } = body;

    if (!venueId || !claimantName || !phone || !email) {
      return c.json({
        status: 'error',
        message: 'Venue ID, your name, phone number, and email are required to claim this venue.'
      }, 400);
    }

    const { databases, databaseId, collections } = getAppwriteServices(c.env);

    // Fetch venue to verify it exists and is unclaimed
    const venue = await databases.getDocument(databaseId, collections.venues, venueId);
    if (!venue) {
      return c.json({ status: 'error', message: 'Venue not found.' }, 404);
    }

    if (venue.userId && venue.userId !== 'admin_import' && venue.userId !== 'admin_claimed' && !venue.userId.startsWith('admin_')) {
      return c.json({
        status: 'error',
        message: 'This venue has already been claimed and verified by its owner.'
      }, 400);
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
      databaseId,
      collections.leads,
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

    return c.json({
      status: 'success',
      message: 'Your claim request has been submitted successfully! The PartyDial team will coordinate with you shortly.',
      data: claimDoc
    }, 201);
  } catch (error) {
    console.error('Error submitting venue claim in worker:', error);
    return c.json({
      status: 'error',
      message: error.message || 'Failed to submit claim request.'
    }, 500);
  }
};

/**
 * Get all claim requests for Admin Claims & Verification dashboard.
 */
export const getAllClaims = async (c) => {
  try {
    const { databases, databaseId, collections } = getAppwriteServices(c.env);

    const claims = await databases.listDocuments(
      databaseId,
      collections.leads,
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

    return c.json({
      status: 'success',
      data: formatted
    }, 200);
  } catch (error) {
    console.error('Error fetching claims in worker:', error);
    return c.json({
      status: 'error',
      message: error.message || 'Failed to fetch claim requests.'
    }, 500);
  }
};

/**
 * Approve a claim in Cloudflare Worker.
 */
export const approveClaim = async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json().catch(() => ({}));
    const { password } = body;

    const { databases, databaseId, collections, users } = getAppwriteServices(c.env);

    const claimDoc = await databases.getDocument(databaseId, collections.leads, id);
    if (!claimDoc) {
      return c.json({ status: 'error', message: 'Claim request not found.' }, 404);
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
      return c.json({ status: 'error', message: 'Missing venueId or email in claim record.' }, 400);
    }

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
      console.error('Appwrite Auth user error in worker approveClaim:', authErr);
      return c.json({
        status: 'error',
        message: `Failed to create/assign vendor login account: ${authErr.message}`
      }, 400);
    }

    const permissions = [
      Permission.read(Role.user(authUserId)),
      Permission.update(Role.user(authUserId)),
      Permission.delete(Role.user(authUserId)),
      Permission.read(Role.any())
    ];

    await databases.updateDocument(
      databaseId,
      collections.venues,
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

    meta.approvedAt = new Date().toISOString();
    meta.assignedUserId = authUserId;
    await databases.updateDocument(
      databaseId,
      collections.leads,
      id,
      {
        status: 'Approved',
        notes: JSON.stringify(meta)
      }
    );

    return c.json({
      status: 'success',
      message: 'Claim approved successfully! Venue is now transferred to the vendor partner account.',
      authUserId
    }, 200);
  } catch (error) {
    console.error('Error approving claim in worker:', error);
    return c.json({
      status: 'error',
      message: error.message || 'Failed to approve claim.'
    }, 500);
  }
};

/**
 * Update claim status
 */
export const updateClaimStatus = async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json().catch(() => ({}));
    const { status, coordinatorNotes } = body;

    const { databases, databaseId, collections } = getAppwriteServices(c.env);

    const claimDoc = await databases.getDocument(databaseId, collections.leads, id);
    if (!claimDoc) {
      return c.json({ status: 'error', message: 'Claim request not found.' }, 404);
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
      databaseId,
      collections.leads,
      id,
      {
        status: status || claimDoc.status,
        notes: JSON.stringify(meta)
      }
    );

    return c.json({
      status: 'success',
      message: `Claim request status updated to ${status}.`,
      data: updated
    }, 200);
  } catch (error) {
    console.error('Error updating claim status in worker:', error);
    return c.json({
      status: 'error',
      message: error.message || 'Failed to update claim status.'
    }, 500);
  }
};
