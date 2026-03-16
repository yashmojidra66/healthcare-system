import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

export const signToken = (user: IUser): string => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
  );
};

export const userResponse = (user: IUser) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  avatar: user.avatar,
  phone: user.phone,
  dateOfBirth: user.dateOfBirth,
  gender: user.gender,
  height: user.height,
  weight: user.weight,
  bloodType: user.bloodType,
  allergies: user.allergies,
  conditions: user.conditions,
  specialty: user.specialty,
  experience: user.experience,
  rating: user.rating,
  reviewCount: user.reviewCount,
  availability: user.availability,
  consultationFee: user.consultationFee,
  bio: user.bio,
  hospital: user.hospital,
  createdAt: user.createdAt,
});
