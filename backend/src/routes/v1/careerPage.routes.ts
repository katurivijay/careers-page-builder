import { Router } from 'express';
import { getCareerPage, updateCareerPage, publishCareerPage, unpublishCareerPage } from '../../controllers/careerPage.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/', getCareerPage);
router.put('/', updateCareerPage);
router.post('/publish', publishCareerPage);
router.post('/unpublish', unpublishCareerPage);

export default router;
