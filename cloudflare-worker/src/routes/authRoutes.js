import { Hono } from 'hono';
import * as authController from '../controllers/authController';

const router = new Hono();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/google', authController.googleLogin);
router.post('/logout', authController.logout);
router.post('/update-token', authController.updatePushToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/complete-registration', authController.completeRegistration);
router.post('/check-phone', authController.checkPhone);

export default router;
