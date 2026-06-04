import { Hono } from 'hono';
const router = new Hono();
router.get('/', (c) => c.json({ status: 'success', message: 'AI route migrated to Hono' }));
export default router;
