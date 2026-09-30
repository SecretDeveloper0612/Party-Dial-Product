const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  location: { type: String, required: true },
  city: { type: String, required: true },
  type: { type: String, required: true },
  capacity: { type: String, required: true },
  pricePerPlate: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  images: [{ type: String }],
  verified: { type: Boolean, default: false },
  popular: { type: Boolean, default: false },
  isNewVenue: { type: Boolean, default: true },
  bestValue: { type: Boolean, default: false },
  amenities: [{ type: String }],
  categories: [{ type: String }],
  foodTypes: [{ type: String, enum: ['Veg', 'Non-Veg', 'Both'] }],
  
  // Ownership & Claim fields
  source: {
    type: { type: String, enum: ['google', 'manual', 'admin', 'other'], default: 'manual' },
    sourceId: String,
    importedAt: Date,
    lastSyncedAt: Date
  },
  listingStatus: {
    type: String,
    enum: ['DRAFT', 'PUBLISHED', 'UNPUBLISHED', 'SUSPENDED', 'ARCHIVED'],
    default: 'PUBLISHED'
  },
  claimStatus: {
    type: String,
    enum: ['UNCLAIMED', 'CLAIM_PENDING', 'CLAIMED', 'DISPUTED', 'REJECTED'],
    default: 'UNCLAIMED'
  },
  verificationStatus: {
    type: String,
    enum: ['UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED'],
    default: 'UNVERIFIED'
  },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  claimedAt: { type: Date },
  verifiedAt: { type: Date },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Venue', VenueSchema);
