const express = require('express');
const router = express.Router();
const venueController = require('../controllers/venueController');

// Define routes for venues
router.get('/', venueController.getAllVenues);
router.post('/leads', venueController.submitLead);
router.get('/:venueId/leads', venueController.getVenueLeads);
router.get('/:id', venueController.getVenueById);

module.exports = router;
