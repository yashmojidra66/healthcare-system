import mongoose, { Document, Schema } from 'mongoose';

export interface IHealthLog extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  calories: number;
  water: number;
  steps: number;
  sleepHours: number;
  heartRate?: number;
  weight?: number;
  mood: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
  notes?: string;
}

const HealthLogSchema = new Schema<IHealthLog>(
  {
    userId:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date:       { type: Date, default: Date.now },
    calories:   { type: Number, default: 0 },
    water:      { type: Number, default: 0 },
    steps:      { type: Number, default: 0 },
    sleepHours: { type: Number, default: 0 },
    heartRate:  { type: Number },
    weight:     { type: Number },
    mood:       { type: String, enum: ['great', 'good', 'okay', 'bad', 'terrible'], default: 'good' },
    notes:      { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IHealthLog>('HealthLog', HealthLogSchema);
