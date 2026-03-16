import { Router } from 'express';
import { getMealPlans, getMealPlan, createMealPlan, updateMealPlan, deleteMealPlan } from '../controllers/mealplans.controller';
import { protect } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

router.get('/', getMealPlans);
router.get('/:id', getMealPlan);
router.post('/', protect, requireRole('admin'), createMealPlan);
router.put('/:id', protect, requireRole('admin'), updateMealPlan);
router.delete('/:id', protect, requireRole('admin'), deleteMealPlan);

export default router;
