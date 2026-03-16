import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth.middleware';
import { userResponse } from '../utils/jwt';

// GET /api/doctors  (public)
export const getDoctors = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { specialty, search } = req.query;
    const filter: Record<string, unknown> = { role: 'doctor' };

    if (specialty) filter['specialty'] = specialty;
    if (search) {
      filter['$or'] = [
        { name: { $regex: search, $options: 'i' } },
        { specialty: { $regex: search, $options: 'i' } },
      ];
    }

    const doctors = await User.find(filter).select('-password');
    res.json({ success: true, data: doctors.map(userResponse) });
  } catch (err) { next(err); }
};

// GET /api/doctors/:id  (public)
export const getDoctor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const doctor = await User.findOne({ _id: req.params['id'], role: 'doctor' }).select('-password');
    if (!doctor) { res.status(404).json({ success: false, message: 'Doctor not found' }); return; }
    res.json({ success: true, data: userResponse(doctor) });
  } catch (err) { next(err); }
};

// PUT /api/doctors/:id  (admin only)
export const updateDoctor = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const allowed = ['specialty', 'experience', 'consultationFee', 'bio', 'hospital', 'availability', 'rating', 'reviewCount'];
    const updates: Record<string, unknown> = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const doctor = await User.findOneAndUpdate(
      { _id: req.params['id'], role: 'doctor' },
      updates,
      { new: true }
    ).select('-password');
    if (!doctor) { res.status(404).json({ success: false, message: 'Doctor not found' }); return; }
    res.json({ success: true, data: userResponse(doctor) });
  } catch (err) { next(err); }
};
