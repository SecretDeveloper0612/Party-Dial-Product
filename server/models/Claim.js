const mongoose = require('mongoose');

const ClaimSchema = new mongoose.Schema({
  venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
  claimantUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  claimantName: { type: String, required: true },
  claimantRole: { type: String, required: true },
  
  phone: { type: String, required: true },
  email: { type: String },
  
  phoneVerified: { type: Boolean, default: false },
  emailVerified: { type: Boolean, default: false },
  
  verificationMethods: [{ type: String }],
  
  documents: [{
    type: { type: String },
    url: { type: String },
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' }
  }],
  
  videoVerification: {
    url: { type: String },
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'] }
  },
  
  riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'] },
  
  status: {
    type: String,
    enum: ['PENDING', 'NEEDS_INFORMATION', 'APPROVED', 'REJECTED', 'DISPUTED'],
    default: 'PENDING'
  },
  
  adminNotes: { type: String },
  rejectionReason: { type: String },
  
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
ClaimSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Claim', ClaimSchema);
