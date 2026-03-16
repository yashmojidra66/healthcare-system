export interface HealthLog {
  id: string;
  userId: string;
  date: Date;
  calories: number;
  water: number; // ml
  steps: number;
  sleepHours: number;
  heartRate?: number;
  weight?: number;
  mood: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
  notes?: string;
}

export interface MealPlan {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meals: Meal[];
  tags: string[];
  imageUrl?: string;
  createdBy?: string;
}

export interface Meal {
  id: string;
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

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutes
  category: string;
  exercises: Exercise[];
  tags: string[];
  imageUrl?: string;
  caloriesBurn: number;
}

export interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: number;
  duration?: number; // seconds
  restTime?: number;
  description: string;
  muscleGroup: string;
  imageUrl?: string;
}

export interface Appointment {
  id: string;
  userId: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: Date;
  time: string;
  type: 'in-person' | 'video' | 'phone';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  prescription?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorAvatar?: string;
  category: string;
  tags: string[];
  imageUrl: string;
  publishedAt: Date;
  readTime: number;
  likes: number;
  comments: number;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: Comment[];
  tags: string[];
  createdAt: Date;
  liked?: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
}

export interface MentalHealthEntry {
  id: string;
  userId: string;
  date: Date;
  mood: number; // 1-10
  anxiety: number; // 1-10
  stress: number; // 1-10
  journalEntry?: string;
  activities: string[];
}

export interface ProgressData {
  date: Date;
  weight?: number;
  calories?: number;
  steps?: number;
  workoutsCompleted?: number;
  sleepHours?: number;
  waterIntake?: number;
}
