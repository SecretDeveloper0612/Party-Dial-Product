const express = require('express');
const router = express.Router();
const quotationController = require('../controllers/quotationController');

router.post('/send-email', quotationController.sendQuotationEmail);
router.post('/send-client-email', quotationController.sendClientQuotation);

module.exports = router;
