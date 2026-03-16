import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointment extends Document {
  userId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  doctorName: string;
  specialty: string;
  date: Date;
  time: string;
  type: 'in-person' | 'video' | 'phone';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  prescription?: string;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    userId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
    doctorName:  { type: String, required: true },
    specialty:   { type: String, required: true },
    date:        { type: Date, required: true },
    time:        { type: String, required: true },
    type:        { type: String, enum: ['in-person', 'video', 'phone'], default: 'video' },
    status:      { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
    notes:       { type: String },
    prescription:{ type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema);
