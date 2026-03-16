import { Router } from 'express';
import { getAppointments, createAppointment, updateAppointment, deleteAppointment } from '../controllers/appointments.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.route('/')
  .get(getAppointments)
  .post(createAppointment);

router.route('/:id')
  .put(updateAppointment)
  .delete(deleteAppointment);

export default router;
