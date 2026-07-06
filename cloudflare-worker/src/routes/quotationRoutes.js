import { Hono } from 'hono';
import * as quotationController from '../controllers/quotationController';

const router = new Hono();

router.get('/', (c) => c.json({ status: 'success', message: 'Quotations route migrated to Hono' }));
router.post('/send-email', quotationController.sendQuotation);

export default router;
