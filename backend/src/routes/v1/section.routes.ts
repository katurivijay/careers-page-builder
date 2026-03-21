import { Router } from 'express';
import { getSections, createSection, updateSection, deleteSection, reorderSections } from '../../controllers/section.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/', getSections);
router.post('/', createSection);
router.put('/reorder', reorderSections);
router.put('/:id', updateSection);
router.delete('/:id', deleteSection);

export default router;
