import { Response, NextFunction } from 'express';
import HealthLog from '../models/HealthLog';
import { AuthRequest } from '../middleware/auth.middleware';

// GET /api/health
export const getLogs = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const logs = await HealthLog.find({ userId: req.user!._id }).sort({ date: -1 }).limit(30);
    res.json({ success: true, data: logs });
  } catch (err) { next(err); }
};

// POST /api/health
export const createLog = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const log = await HealthLog.create({ ...req.body, userId: req.user!._id });
    res.status(201).json({ success: true, data: log });
  } catch (err) { next(err); }
};

// PUT /api/health/:id
export const updateLog = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const log = await HealthLog.findOneAndUpdate(
      { _id: req.params['id'], userId: req.user!._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!log) { res.status(404).json({ success: false, message: 'Log not found' }); return; }
    res.json({ success: true, data: log });
  } catch (err) { next(err); }
};

// DELETE /api/health/:id
export const deleteLog = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const log = await HealthLog.findOneAndDelete({ _id: req.params['id'], userId: req.user!._id });
    if (!log) { res.status(404).json({ success: false, message: 'Log not found' }); return; }
    res.json({ success: true, message: 'Log deleted' });
  } catch (err) { next(err); }
};
