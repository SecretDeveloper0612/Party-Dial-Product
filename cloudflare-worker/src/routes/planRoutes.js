import { Hono } from 'hono';
import * as planController from '../controllers/planController';

const router = new Hono();

router.get('/', planController.getAllPlans);
router.post('/', planController.createPlan);
router.put('/:id', planController.updatePlan);
router.delete('/:id', planController.deletePlan);

export default router;
