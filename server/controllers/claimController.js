const Claim = require('../models/Claim');
const Venue = require('../models/Venue');

// @desc    Submit a new claim
// @route   POST /api/claims/submit
// @access  Private
exports.submitClaim = async (req, res) => {
  try {
    const { venueId, claimantName, claimantRole, phone, email, documents } = req.body;
    
    // Check if venue exists
    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({ success: false, message: 'Venue not found' });
    }
    
    // Check if already claimed
    if (venue.claimStatus === 'CLAIMED') {
      return res.status(400).json({ success: false, message: 'Venue is already claimed' });
    }
    
    // Check if user already has a pending claim for this venue
    const existingClaim = await Claim.findOne({ venueId, claimantUserId: req.user._id, status: 'PENDING' });
    if (existingClaim) {
      return res.status(400).json({ success: false, message: 'You already have a pending claim for this venue' });
    }

    const claim = await Claim.create({
      venueId,
      claimantUserId: req.user._id,
      claimantName,
      claimantRole,
      phone,
      email,
      documents: documents || [],
      status: 'PENDING',
      riskLevel: 'MEDIUM' // Default, should be calculated based on signals
    });
    
    // Update venue claim status
    venue.claimStatus = 'CLAIM_PENDING';
    await venue.save();

    res.status(201).json({ success: true, data: claim });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get logged in user's claims
// @route   GET /api/claims/my-claims
// @access  Private
exports.getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ claimantUserId: req.user._id }).populate('venueId', 'name location city');
    res.status(200).json({ success: true, data: claims });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get all claims
// @route   GET /api/claims
// @access  Private/Admin
exports.getAllClaims = async (req, res) => {
  try {
    const claims = await Claim.find().populate('venueId', 'name city').populate('claimantUserId', 'name email');
    res.status(200).json({ success: true, data: claims });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get single claim
// @route   GET /api/claims/:id
// @access  Private/Admin
exports.getClaimById = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate('venueId')
      .populate('claimantUserId', 'name email');
      
    if (!claim) {
      return res.status(404).json({ success: false, message: 'Claim not found' });
    }
    
    res.status(200).json({ success: true, data: claim });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update claim status (Approve/Reject)
// @route   PUT /api/claims/:id/status
// @access  Private/Admin
exports.updateClaimStatus = async (req, res) => {
  try {
    const { status, adminNotes, rejectionReason } = req.body;
    
    const claim = await Claim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({ success: false, message: 'Claim not found' });
    }
    
    claim.status = status;
    claim.reviewedBy = req.user._id;
    claim.reviewedAt = Date.now();
    
    if (adminNotes) claim.adminNotes = adminNotes;
    if (rejectionReason) claim.rejectionReason = rejectionReason;
    
    await claim.save();
    
    // If approved, update the Venue
    if (status === 'APPROVED') {
      const venue = await Venue.findById(claim.venueId);
      if (venue) {
        venue.claimStatus = 'CLAIMED';
        venue.claimedBy = claim.claimantUserId;
        venue.partnerId = claim.claimantUserId; // Or create a specific partner profile logic here
        venue.claimedAt = Date.now();
        await venue.save();
      }
    } else if (status === 'REJECTED') {
      const venue = await Venue.findById(claim.venueId);
      if (venue && venue.claimStatus === 'CLAIM_PENDING') {
        // Only revert to UNCLAIMED if no other pending claims exist. Simplified for now.
        venue.claimStatus = 'UNCLAIMED';
        await venue.save();
      }
    }
    
    res.status(200).json({ success: true, data: claim });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
