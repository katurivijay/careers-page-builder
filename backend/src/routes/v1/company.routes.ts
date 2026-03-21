import { Router } from 'express';
import { createCompany, getCompany, updateCompany } from '../../controllers/company.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/', getCompany);
router.post('/', createCompany);
router.put('/', updateCompany);

export default router;
