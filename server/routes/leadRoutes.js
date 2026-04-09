const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');

// Admin Lead Distribution routes
router.post('/distribute', leadController.distributeLeads);
router.get('/distribution-logs', leadController.getDistributionLogs);
router.get('/user/:userId', leadController.getLeadsForUser);

module.exports = router;
