import { Hono } from 'hono';
import * as leadController from '../controllers/leadController';

const router = new Hono();

router.post('/distribute', leadController.distributeLeads);
router.post('/distribute-venues', leadController.distributeLeadsToVenues);
router.post('/sync-gsheet', leadController.syncGoogleSheetLeads);
router.get('/distribution-logs', leadController.getDistributionLogs);
router.get('/user/:userId', leadController.getLeadsForUser);
router.post('/public-inquiry', leadController.processPublicInquiry);
router.post('/partner-enquiry', leadController.savePartnerEnquiry);
router.get('/price-leads', leadController.getPriceLeads);
router.get('/venue-leads-check', leadController.getVenueLeadsForAdmin);
router.post('/redistribute-old', leadController.redistributeOldLeads);

export default router;
