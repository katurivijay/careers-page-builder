import { Router } from 'express';
import { getPublicCareersPage, getPublicJobs, trackAnalytics } from '../../controllers/public.controller';

const router = Router();

router.get('/:slug/careers', getPublicCareersPage);
router.get('/:slug/jobs', getPublicJobs);
router.post('/:slug/analytics', trackAnalytics);

export default router;
