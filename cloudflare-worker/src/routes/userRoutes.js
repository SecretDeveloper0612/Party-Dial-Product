import { Hono } from 'hono';
import * as userController from '../controllers/userController';

const router = new Hono();

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);
router.patch('/:id', userController.updateUser);
router.patch('/:id/status', userController.toggleUserStatus);
router.delete('/:id', userController.deleteUser);
router.post('/reminders', userController.sendProfileReminders);

export default router;
