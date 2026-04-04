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
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Venue', VenueSchema);
