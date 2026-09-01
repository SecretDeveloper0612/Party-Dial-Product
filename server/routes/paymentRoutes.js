const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.get('/', paymentController.getAllPayments);
router.post('/create-order', paymentController.createOrder);
router.post('/verify-payment', paymentController.verifyPayment);
router.patch('/:id/status', paymentController.updateStatus);
router.delete('/:id', paymentController.deletePayment);

module.exports = router;
