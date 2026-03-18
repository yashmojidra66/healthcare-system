import { Response, NextFunction } from 'express';
import User from '../models/User';
import Appointment from '../models/Appointment';
import HealthLog from '../models/HealthLog';
import BlogPost from '../models/BlogPost';
import CommunityPost from '../models/CommunityPost';
import { AuthRequest } from '../middleware/auth.middleware';
import { userResponse } from '../utils/jwt';

// GET /api/admin/stats
export const getStats = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [totalUsers, totalDoctors, totalAppointments, totalPosts] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'doctor', status: 'active' }),
      Appointment.countDocuments(),
      CommunityPost.countDocuments(),
    ]);
    res.json({ success: true, data: { totalUsers, totalDoctors, totalAppointments, totalPosts } });
  } catch (err) { next(err); }
};

// GET /api/admin/users
export const getUsers = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users.map(userResponse) });
  } catch (err) { next(err); }
};

// PUT /api/admin/users/:id
export const updateUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(req.params['id'], req.body, { new: true }).select('-password');
    if (!user) { res.status(404).json({ success: false, message: 'User not found' }); return; }
    res.json({ success: true, data: userResponse(user) });
  } catch (err) { next(err); }
};

// DELETE /api/admin/users/:id
export const deleteUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params['id']);
    if (!user) { res.status(404).json({ success: false, message: 'User not found' }); return; }
    // Cascade delete user data
    await Promise.all([
      HealthLog.deleteMany({ userId: req.params['id'] }),
      Appointment.deleteMany({ userId: req.params['id'] }),
      CommunityPost.deleteMany({ userId: req.params['id'] }),
    ]);
    res.json({ success: true, message: 'User and associated data deleted' });
  } catch (err) { next(err); }
};

// GET /api/admin/pending-doctors
export const getPendingDoctors = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const doctors = await User.find({ role: 'doctor', status: 'pending' }).sort({ createdAt: -1 });
    res.json({ success: true, data: doctors.map(userResponse) });
  } catch (err) { next(err); }
};

// PUT /api/admin/users/:id/approve
export const approveDoctor = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(req.params['id'], { status: 'active' }, { new: true });
    if (!user) { res.status(404).json({ success: false, message: 'User not found' }); return; }
    res.json({ success: true, message: 'Doctor approved', data: userResponse(user) });
  } catch (err) { next(err); }
};

// PUT /api/admin/users/:id/reject
export const rejectDoctor = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(req.params['id'], { status: 'rejected' }, { new: true });
    if (!user) { res.status(404).json({ success: false, message: 'User not found' }); return; }
    res.json({ success: true, message: 'Doctor rejected', data: userResponse(user) });
  } catch (err) { next(err); }
};
