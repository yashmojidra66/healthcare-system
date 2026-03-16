import mongoose, { Document, Schema } from 'mongoose';

interface IExercise {
  name: string;
  sets?: number;
  reps?: number;
  duration?: number;
  restTime?: number;
  description: string;
  muscleGroup: string;
  imageUrl?: string;
}

export interface IWorkoutPlan extends Document {
  name: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  category: string;
  exercises: IExercise[];
  tags: string[];
  imageUrl?: string;
  caloriesBurn: number;
  createdBy?: mongoose.Types.ObjectId;
}

const ExerciseSchema = new Schema<IExercise>({
  name:        { type: String, required: true },
  sets:        { type: Number },
  reps:        { type: Number },
  duration:    { type: Number },
  restTime:    { type: Number },
  description: { type: String, default: '' },
  muscleGroup: { type: String, default: '' },
  imageUrl:    { type: String },
}, { _id: false });

const WorkoutPlanSchema = new Schema<IWorkoutPlan>(
  {
    name:         { type: String, required: true },
    description:  { type: String },
    level:        { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    duration:     { type: Number, default: 30 },
    category:     { type: String, default: 'General' },
    exercises:    [ExerciseSchema],
    tags:         [{ type: String }],
    imageUrl:     { type: String },
    caloriesBurn: { type: Number, default: 0 },
    createdBy:    { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model<IWorkoutPlan>('WorkoutPlan', WorkoutPlanSchema);
