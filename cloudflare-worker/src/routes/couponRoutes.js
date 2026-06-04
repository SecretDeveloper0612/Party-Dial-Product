import { Hono } from 'hono';
import * as couponController from '../controllers/couponController';

const router = new Hono();

router.get('/', couponController.getAllCoupons);
router.post('/', couponController.createCoupon);
router.patch('/:id', couponController.updateCoupon);
router.delete('/:id', couponController.deleteCoupon);
router.post('/validate', couponController.validateCoupon);

export default router;
