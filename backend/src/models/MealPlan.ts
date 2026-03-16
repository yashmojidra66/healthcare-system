import mongoose, { Document, Schema } from 'mongoose';

interface IMeal {
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  instructions?: string;
  imageUrl?: string;
  prepTime?: number;
}

export interface IMealPlan extends Document {
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meals: IMeal[];
  tags: string[];
  imageUrl?: string;
  createdBy?: mongoose.Types.ObjectId;
}

const MealSchema = new Schema<IMeal>({
  name:         { type: String, required: true },
  type:         { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'] },
  calories:     { type: Number, default: 0 },
  protein:      { type: Number, default: 0 },
  carbs:        { type: Number, default: 0 },
  fat:          { type: Number, default: 0 },
  ingredients:  [{ type: String }],
  instructions: { type: String },
  imageUrl:     { type: String },
  prepTime:     { type: Number },
}, { _id: false });

const MealPlanSchema = new Schema<IMealPlan>(
  {
    name:        { type: String, required: true },
    description: { type: String },
    calories:    { type: Number, default: 0 },
    protein:     { type: Number, default: 0 },
    carbs:       { type: Number, default: 0 },
    fat:         { type: Number, default: 0 },
    meals:       [MealSchema],
    tags:        [{ type: String }],
    imageUrl:    { type: String },
    createdBy:   { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model<IMealPlan>('MealPlan', MealPlanSchema);
