import { Response, NextFunction } from 'express';
import Appointment from '../models/Appointment';
import { AuthRequest } from '../middleware/auth.middleware';

// GET /api/appointments  (patient sees own, doctor sees theirs, admin sees all)
export const getAppointments = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filter =
      req.user!.role === 'admin' ? {} :
      req.user!.role === 'doctor' ? { doctorId: req.user!._id } :
      { userId: req.user!._id };

    const appointments = await Appointment.find(filter)
      .populate('doctorId', 'name avatar specialty')
      .populate('userId', 'name avatar')
      .sort({ date: -1 });

    // Merge populated doctor avatar and patient name into the response
    const data = appointments.map(a => {
      const obj = a.toObject() as any;
      if (obj.doctorId && typeof obj.doctorId === 'object') {
        obj.doctorAvatar = obj.doctorId.avatar;
        obj.doctorId = obj.doctorId._id;
      }
      if (obj.userId && typeof obj.userId === 'object') {
        obj.patientName = obj.userId.name;
        obj.patientAvatar = obj.userId.avatar;
        obj.userId = obj.userId._id;
      }
      return obj;
    });

    res.json({ success: true, data });
  } catch (err) { next(err); }
};

// POST /api/appointments
export const createAppointment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const appt = await Appointment.create({ ...req.body, userId: req.user!._id });
    res.status(201).json({ success: true, data: appt });
  } catch (err) { next(err); }
};

// PUT /api/appointments/:id
export const updateAppointment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filter =
      req.user!.role === 'admin' ? { _id: req.params['id'] } :
      req.user!.role === 'doctor' ? { _id: req.params['id'], doctorId: req.user!._id } :
      { _id: req.params['id'], userId: req.user!._id };

    const appt = await Appointment.findOneAndUpdate(filter, req.body, { new: true, runValidators: true });
    if (!appt) { res.status(404).json({ success: false, message: 'Appointment not found' }); return; }
    res.json({ success: true, data: appt });
  } catch (err) { next(err); }
};

// DELETE /api/appointments/:id
export const deleteAppointment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filter =
      req.user!.role === 'admin' ? { _id: req.params['id'] } :
      { _id: req.params['id'], userId: req.user!._id };

    const appt = await Appointment.findOneAndDelete(filter);
    if (!appt) { res.status(404).json({ success: false, message: 'Appointment not found' }); return; }
    res.json({ success: true, message: 'Appointment deleted' });
  } catch (err) { next(err); }
};
