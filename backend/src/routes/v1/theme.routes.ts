import { Router } from 'express';
import { getTheme, updateTheme, getPresets } from '../../controllers/theme.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/', getTheme);
router.put('/', updateTheme);
router.get('/presets', getPresets);

export default router;
