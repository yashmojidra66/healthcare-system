import { Router } from 'express';
import { getWorkouts, getWorkout, createWorkout, updateWorkout, deleteWorkout } from '../controllers/workouts.controller';
import { protect } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

router.get('/', getWorkouts);
router.get('/:id', getWorkout);
router.post('/', protect, requireRole('admin'), createWorkout);
router.put('/:id', protect, requireRole('admin'), updateWorkout);
router.delete('/:id', protect, requireRole('admin'), deleteWorkout);

export default router;
