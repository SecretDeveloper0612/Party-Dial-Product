const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public/User routes
router.post('/submit', protect, claimController.submitClaim);
router.get('/my-claims', protect, claimController.getMyClaims);

// Admin routes
router.get('/', protect, admin, claimController.getAllClaims);
router.get('/:id', protect, admin, claimController.getClaimById);
router.put('/:id/status', protect, admin, claimController.updateClaimStatus);

module.exports = router;
