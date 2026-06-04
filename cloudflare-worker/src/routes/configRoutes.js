import { Hono } from 'hono';
const router = new Hono();
router.get('/', (c) => c.json({ status: 'success', message: 'Config route migrated to Hono' }));
export default router;
