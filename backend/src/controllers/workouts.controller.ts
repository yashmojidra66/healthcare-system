import { Request, Response, NextFunction } from 'express';
import WorkoutPlan from '../models/WorkoutPlan';
import { AuthRequest } from '../middleware/auth.middleware';

// GET /api/workouts  (public)
export const getWorkouts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { level, category } = req.query;
    const filter: Record<string, unknown> = {};
    if (level) filter['level'] = level;
    if (category) filter['category'] = category;
    const plans = await WorkoutPlan.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: plans });
  } catch (err) { next(err); }
};

// GET /api/workouts/:id  (public)
export const getWorkout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const plan = await WorkoutPlan.findById(req.params['id']);
    if (!plan) { res.status(404).json({ success: false, message: 'Workout not found' }); return; }
    res.json({ success: true, data: plan });
  } catch (err) { next(err); }
};

// POST /api/workouts  (admin)
export const createWorkout = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const plan = await WorkoutPlan.create({ ...req.body, createdBy: req.user!._id });
    res.status(201).json({ success: true, data: plan });
  } catch (err) { next(err); }
};

// PUT /api/workouts/:id  (admin)
export const updateWorkout = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const plan = await WorkoutPlan.findByIdAndUpdate(req.params['id'], req.body, { new: true, runValidators: true });
    if (!plan) { res.status(404).json({ success: false, message: 'Workout not found' }); return; }
    res.json({ success: true, data: plan });
  } catch (err) { next(err); }
};

// DELETE /api/workouts/:id  (admin)
export const deleteWorkout = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const plan = await WorkoutPlan.findByIdAndDelete(req.params['id']);
    if (!plan) { res.status(404).json({ success: false, message: 'Workout not found' }); return; }
    res.json({ success: true, message: 'Workout deleted' });
  } catch (err) { next(err); }
};
