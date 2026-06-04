import { Hono } from 'hono';
import * as paymentController from '../controllers/paymentController';

const router = new Hono();

router.get('/', paymentController.getAllPayments);
router.post('/create-order', paymentController.createOrder);
router.post('/verify-payment', paymentController.verifyPayment);

export default router;
