import { Request, Response, NextFunction } from 'express';
import MealPlan from '../models/MealPlan';
import { AuthRequest } from '../middleware/auth.middleware';

// GET /api/meal-plans  (public)
export const getMealPlans = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { tag } = req.query;
    const filter = tag ? { tags: tag } : {};
    const plans = await MealPlan.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: plans });
  } catch (err) { next(err); }
};

// GET /api/meal-plans/:id  (public)
export const getMealPlan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const plan = await MealPlan.findById(req.params['id']);
    if (!plan) { res.status(404).json({ success: false, message: 'Meal plan not found' }); return; }
    res.json({ success: true, data: plan });
  } catch (err) { next(err); }
};

// POST /api/meal-plans  (admin)
export const createMealPlan = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const plan = await MealPlan.create({ ...req.body, createdBy: req.user!._id });
    res.status(201).json({ success: true, data: plan });
  } catch (err) { next(err); }
};

// PUT /api/meal-plans/:id  (admin)
export const updateMealPlan = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const plan = await MealPlan.findByIdAndUpdate(req.params['id'], req.body, { new: true, runValidators: true });
    if (!plan) { res.status(404).json({ success: false, message: 'Meal plan not found' }); return; }
    res.json({ success: true, data: plan });
  } catch (err) { next(err); }
};

// DELETE /api/meal-plans/:id  (admin)
export const deleteMealPlan = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const plan = await MealPlan.findByIdAndDelete(req.params['id']);
    if (!plan) { res.status(404).json({ success: false, message: 'Meal plan not found' }); return; }
    res.json({ success: true, message: 'Meal plan deleted' });
  } catch (err) { next(err); }
};
