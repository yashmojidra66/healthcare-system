import { Router } from 'express';
import { getStats, getUsers, updateUser, deleteUser, getPendingDoctors, approveDoctor, rejectDoctor } from '../controllers/admin.controller';
import { protect } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

router.use(protect, requireRole('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/pending-doctors', getPendingDoctors);
router.put('/users/:id', updateUser);
router.put('/users/:id/approve', approveDoctor);
router.put('/users/:id/reject', rejectDoctor);
router.delete('/users/:id', deleteUser);

export default router;
