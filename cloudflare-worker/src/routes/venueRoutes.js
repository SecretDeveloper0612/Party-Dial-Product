import { Hono } from 'hono';
import * as venueController from '../controllers/venueController';

const router = new Hono();

router.get('/', venueController.getAllVenues);
router.post('/leads', venueController.submitLead);
router.get('/:venueId/leads', venueController.getVenueLeads);
router.patch('/:id/approve', venueController.approveVenue);
router.patch('/:id/reject', venueController.rejectVenue);
router.put('/:id', venueController.updateVenue);
router.get('/:id', venueController.getVenueById);

router.get('/:venueId/reviews', venueController.getVenueReviews);
router.post('/reviews', venueController.submitReview);
router.patch('/reviews/:reviewId/reply', venueController.replyToReview);
router.delete('/reviews/:reviewId', venueController.deleteReview);

router.get('/proxy/image/:bucketId/:fileId', venueController.proxyImage);
router.post('/notify-documents', venueController.notifyDocSubmission);
router.post('/notify-onboarding', venueController.notifyOnboardingComplete);

export default router;
