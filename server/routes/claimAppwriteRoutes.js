const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimAppwriteController');

// Public route to submit venue claim from client portal
router.post('/submit', claimController.submitClaim);

// Admin routes to view and coordinate claims
router.get('/', claimController.getAllClaims);
router.post('/:id/approve', claimController.approveClaim);
router.put('/:id/status', claimController.updateClaimStatus);

module.exports = router;
