/**
 * Seed script — populates MongoDB with demo data
 * Run: npx ts-node src/seed.ts
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User';
import MealPlan from './models/MealPlan';
import WorkoutPlan from './models/WorkoutPlan';
import BlogPost from './models/BlogPost';
import CommunityPost from './models/CommunityPost';

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    MealPlan.deleteMany({}),
    WorkoutPlan.deleteMany({}),
    BlogPost.deleteMany({}),
    CommunityPost.deleteMany({}),
  ]);
  console.log('Cleared existing data');

  // ── Users ──────────────────────────────────────────────────────────────────
  const [patient, doctor, admin] = await User.create([
    {
      name: 'Alex Johnson', email: 'user@health.com', password: 'pass1234', role: 'user',
      height: 175, weight: 72, bloodType: 'O+', gender: 'male', dateOfBirth: '1990-05-15',
    },
    {
      name: 'Dr. Sarah Mitchell', email: 'doctor@health.com', password: 'pass1234', role: 'doctor',
      specialty: 'General Physician', experience: 12, rating: 4.9, reviewCount: 234,
      consultationFee: 80, bio: 'Experienced GP focused on preventive care and holistic health.',
      hospital: 'City Medical Center', availability: ['Mon', 'Wed', 'Fri'],
    },
    {
      name: 'Admin User', email: 'admin@health.com', password: 'pass1234', role: 'admin',
    },
  ]);

  // Extra doctors
  await User.create([
    {
      name: 'Dr. James Carter', email: 'james@health.com', password: 'pass1234', role: 'doctor',
      specialty: 'Cardiologist', experience: 18, rating: 4.8, reviewCount: 189,
      consultationFee: 150, bio: 'Board-certified cardiologist specializing in preventive cardiology.',
      hospital: 'Heart Institute', availability: ['Tue', 'Thu'],
    },
    {
      name: 'Dr. Emily Chen', email: 'emily@health.com', password: 'pass1234', role: 'doctor',
      specialty: 'Nutritionist', experience: 8, rating: 4.7, reviewCount: 156,
      consultationFee: 90, bio: 'Clinical nutritionist helping patients achieve optimal health through diet.',
      hospital: 'Wellness Clinic', availability: ['Mon', 'Tue', 'Thu', 'Fri'],
    },
    {
      name: 'Dr. Robert Kim', email: 'robert@health.com', password: 'pass1234', role: 'doctor',
      specialty: 'Psychiatrist', experience: 15, rating: 4.9, reviewCount: 201,
      consultationFee: 120, bio: 'Compassionate psychiatrist specializing in anxiety and depression.',
      hospital: 'Mind & Body Clinic', availability: ['Wed', 'Thu', 'Fri'],
    },
  ]);
  console.log('Users seeded');

  // ── Meal Plans ─────────────────────────────────────────────────────────────
  await MealPlan.create([
    { name: 'Mediterranean Diet', description: 'Heart-healthy eating inspired by Mediterranean cuisine', calories: 1800, protein: 90, carbs: 220, fat: 65, tags: ['heart-healthy', 'balanced', 'anti-inflammatory'], imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', createdBy: admin._id },
    { name: 'High Protein Plan', description: 'Muscle building diet with optimal protein intake', calories: 2200, protein: 180, carbs: 200, fat: 70, tags: ['muscle-gain', 'high-protein', 'fitness'], imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400', createdBy: admin._id },
    { name: 'Weight Loss Plan', description: 'Calorie-controlled plan for sustainable weight loss', calories: 1400, protein: 100, carbs: 150, fat: 45, tags: ['weight-loss', 'low-calorie', 'balanced'], imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400', createdBy: admin._id },
    { name: 'Plant-Based Diet', description: 'Nutrient-rich vegan meal plan', calories: 1700, protein: 75, carbs: 250, fat: 55, tags: ['vegan', 'plant-based', 'sustainable'], imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400', createdBy: admin._id },
  ]);
  console.log('Meal plans seeded');

  // ── Workout Plans ──────────────────────────────────────────────────────────
  await WorkoutPlan.create([
    { name: 'Full Body Blast', description: 'Complete full-body workout for all fitness levels', level: 'beginner', duration: 45, category: 'Strength', tags: ['full-body', 'strength', 'beginner'], imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', caloriesBurn: 350, createdBy: admin._id },
    { name: 'HIIT Cardio', description: 'High-intensity interval training for maximum fat burn', level: 'intermediate', duration: 30, category: 'Cardio', tags: ['hiit', 'cardio', 'fat-burn'], imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400', caloriesBurn: 450, createdBy: admin._id },
    { name: 'Yoga Flow', description: 'Relaxing yoga session for flexibility and mindfulness', level: 'beginner', duration: 60, category: 'Flexibility', tags: ['yoga', 'flexibility', 'mindfulness'], imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400', caloriesBurn: 200, createdBy: admin._id },
    { name: 'Advanced Strength', description: 'Heavy lifting program for experienced athletes', level: 'advanced', duration: 75, category: 'Strength', tags: ['strength', 'advanced', 'powerlifting'], imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400', caloriesBurn: 500, createdBy: admin._id },
  ]);
  console.log('Workout plans seeded');

  // ── Blog Posts ─────────────────────────────────────────────────────────────
  await BlogPost.create([
    { title: '10 Science-Backed Ways to Improve Your Sleep', excerpt: 'Quality sleep is the foundation of good health. Discover evidence-based strategies.', content: 'Full article content here...', author: doctor._id, authorName: doctor.name, category: 'Sleep', tags: ['sleep', 'wellness'], imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400', readTime: 8, likes: 234, comments: 45 },
    { title: 'The Ultimate Guide to Intermittent Fasting', excerpt: 'Everything you need to know about IF and how it can transform your health.', content: 'Full article content here...', author: doctor._id, authorName: doctor.name, category: 'Nutrition', tags: ['fasting', 'nutrition'], imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400', readTime: 12, likes: 189, comments: 67 },
    { title: 'Mental Health in the Digital Age', excerpt: 'How to maintain psychological wellbeing in an always-connected world.', content: 'Full article content here...', author: doctor._id, authorName: doctor.name, category: 'Mental Health', tags: ['mental-health', 'digital'], imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400', readTime: 10, likes: 312, comments: 89 },
  ]);
  console.log('Blog posts seeded');

  // ── Community Posts ────────────────────────────────────────────────────────
  await CommunityPost.create([
    { userId: patient._id, userName: patient.name, userAvatar: patient.avatar, content: 'Just completed my first 5K run! Feeling amazing after 3 months of training. Never give up!', likes: 42, tags: ['running', 'fitness'] },
    { userId: doctor._id, userName: doctor.name, userAvatar: doctor.avatar, content: 'Reminder: staying hydrated is one of the simplest things you can do for your health. Aim for 8 glasses a day!', likes: 65, tags: ['health', 'hydration'] },
  ]);
  console.log('Community posts seeded');

  console.log('\n✅ Database seeded successfully!');
  console.log('Demo credentials:');
  console.log('  Patient  → user@health.com    / pass1234');
  console.log('  Doctor   → doctor@health.com  / pass1234');
  console.log('  Admin    → admin@health.com   / pass1234');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
