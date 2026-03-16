import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { signToken, userResponse } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth.middleware';

// POST /api/auth/register
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, role, specialty, experience, consultationFee, bio, hospital } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({ success: false, message: 'Email already registered' });
      return;
    }

    // Doctors start as pending until admin approves
    const status = role === 'doctor' ? 'pending' : 'active';
    const user = await User.create({
      name, email, password,
      role: role === 'doctor' ? 'doctor' : 'user',
      status,
      specialty, experience, consultationFee, bio, hospital,
    });
    const token = signToken(user);

    res.status(201).json({ success: true, token, user: userResponse(user) });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    if (user.status === 'pending') {
      res.status(403).json({ success: false, message: 'Your doctor account is pending admin approval.' });
      return;
    }
    if (user.status === 'rejected') {
      res.status(403).json({ success: false, message: 'Your account has been rejected. Please contact support.' });
      return;
    }

    const token = signToken(user);
    res.json({ success: true, token, user: userResponse(user) });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user!._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.json({ success: true, user: userResponse(user) });
  } catch (err) {
    next(err);
  }
};

// PUT /api/auth/me
export const updateMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const allowed = ['name', 'phone', 'dateOfBirth', 'gender', 'height', 'weight', 'bloodType', 'allergies', 'conditions', 'avatar'];
    const updates: Record<string, unknown> = {};
    allowed.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user!._id, updates, { new: true, runValidators: true });
    res.json({ success: true, user: userResponse(user!) });
  } catch (err) {
    next(err);
  }
};
