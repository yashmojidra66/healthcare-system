export type UserRole = 'user' | 'doctor' | 'admin';
export type UserStatus = 'active' | 'pending' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: UserStatus;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  height?: number;
  weight?: number;
  bloodType?: string;
  allergies?: string[];
  conditions?: string[];
  // Doctor fields
  specialty?: string;
  experience?: number;
  rating?: number;
  reviewCount?: number;
  availability?: string[];
  consultationFee?: number;
  bio?: string;
  hospital?: string;
  createdAt: Date;
}

export interface Doctor extends User {
  role: 'doctor';
  specialty: string;
  experience: number;
  rating: number;
  reviewCount: number;
  availability: string[];
  consultationFee: number;
  bio: string;
  education: string[];
  hospital?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
