const express = require('express');
const router = express.Router();
const venueController = require('../controllers/venueController');

// Define routes for venues
router.get('/', venueController.getAllVenues);
router.post('/leads', venueController.submitLead);
router.get('/:venueId/leads', venueController.getVenueLeads);
router.get('/:id', venueController.getVenueById);

// Define routes for reviews
router.get('/:venueId/reviews', venueController.getVenueReviews);
router.post('/reviews', venueController.submitReview);
router.patch('/reviews/:reviewId/reply', venueController.replyToReview);
router.delete('/reviews/:reviewId', venueController.deleteReview);

// Image Proxy (To bypass CORS/Permissions)
router.get('/proxy/image/:bucketId/:fileId', venueController.proxyImage);

module.exports = router;
