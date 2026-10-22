import { Hono } from 'hono';
import * as claimController from '../controllers/claimController';

const router = new Hono();

router.post('/submit', claimController.submitClaim);
router.get('/', claimController.getAllClaims);
router.post('/:id/approve', claimController.approveClaim);
router.put('/:id/status', claimController.updateClaimStatus);

export default router;
