const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');

// Admin Lead Distribution routes
router.post('/distribute', leadController.distributeLeads);
router.post('/distribute-venues', leadController.distributeLeadsToVenues);
router.post('/sync-gsheet', leadController.syncGoogleSheetLeads);
router.get('/distribution-logs', leadController.getDistributionLogs);
router.get('/user/:userId', leadController.getLeadsForUser);
router.post('/public-inquiry', leadController.processPublicInquiry);
router.post('/partner-enquiry', leadController.savePartnerEnquiry);
router.get('/price-leads', leadController.getPriceLeads);

module.exports = router;
