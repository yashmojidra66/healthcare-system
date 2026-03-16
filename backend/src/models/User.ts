import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'user' | 'doctor' | 'admin';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: 'active' | 'pending' | 'rejected';
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  height?: number;
  weight?: number;
  bloodType?: string;
  allergies?: string[];
  conditions?: string[];
  // Doctor-specific
  specialty?: string;
  experience?: number;
  rating?: number;
  reviewCount?: number;
  availability?: string[];
  consultationFee?: number;
  bio?: string;
  hospital?: string;
  createdAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name:            { type: String, required: true, trim: true },
    email:           { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:        { type: String, required: true, minlength: 4, select: false },
    role:            { type: String, enum: ['user', 'doctor', 'admin'], default: 'user' },
    status:          { type: String, enum: ['active', 'pending', 'rejected'], default: 'active' },
    avatar:          { type: String },
    phone:           { type: String },
    dateOfBirth:     { type: String },
    gender:          { type: String },
    height:          { type: Number },
    weight:          { type: Number },
    bloodType:       { type: String },
    allergies:       [{ type: String }],
    conditions:      [{ type: String }],
    // Doctor fields
    specialty:       { type: String },
    experience:      { type: Number },
    rating:          { type: Number, default: 0 },
    reviewCount:     { type: Number, default: 0 },
    availability:    [{ type: String }],
    consultationFee: { type: Number },
    bio:             { type: String },
    hospital:        { type: String },
  },
  { timestamps: true }
);

// Hash password before save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

// Auto-generate avatar if not provided
UserSchema.pre('save', function (next) {
  if (!this.avatar) {
    this.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(this.name)}`;
  }
  next();
});

export default mongoose.model<IUser>('User', UserSchema);
