import { Router } from 'express';
import { getDoctors, getDoctor, updateDoctor } from '../controllers/doctors.controller';
import { protect } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

router.get('/', getDoctors);
router.get('/:id', getDoctor);
router.put('/:id', protect, requireRole('admin'), updateDoctor);

export default router;
