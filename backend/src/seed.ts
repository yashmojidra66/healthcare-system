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
import Appointment from './models/Appointment';
import HealthLog from './models/HealthLog';

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
    Appointment.deleteMany({}),
    HealthLog.deleteMany({}),
  ]);
  console.log('Cleared existing data');

  // ── Users ──────────────────────────────────────────────────────────────────
  const [patient, doctor, admin] = await User.create([
    {
      name: 'Alex Johnson', email: 'user@health.com', password: 'pass1234', role: 'user',
      height: 175, weight: 72, bloodType: 'O+', gender: 'male', dateOfBirth: '1990-05-15',
    },
    {
      name: 'Dr. Sarah Mitchell', email: 'doctor@health.com', password: 'pass1234', role: 'doctor', status: 'active',
      specialty: 'General Physician', experience: 12, rating: 4.9, reviewCount: 234,
      consultationFee: 80, bio: 'Experienced GP focused on preventive care and holistic health.',
      hospital: 'City Medical Center', availability: ['Mon', 'Wed', 'Fri'],
      avatar: 'https://png.pngtree.com/png-clipart/20200225/original/pngtree-doctor-icon-circle-png-image_5281907.jpg',
    },
    {
      name: 'Admin User', email: 'admin@health.com', password: 'pass1234', role: 'admin',
    },
  ]);

  // Extra doctors
  await User.create([
    {
      name: 'Dr. James Carter', email: 'james@health.com', password: 'pass1234', role: 'doctor', status: 'active',
      specialty: 'Cardiologist', experience: 18, rating: 4.8, reviewCount: 189,
      consultationFee: 150, bio: 'Board-certified cardiologist specializing in preventive cardiology.',
      hospital: 'Heart Institute', availability: ['Tue', 'Thu'],
      avatar: 'https://png.pngtree.com/png-clipart/20200225/original/pngtree-doctor-icon-circle-png-image_5281907.jpg',
    },
    {
      name: 'Dr. Emily Chen', email: 'emily@health.com', password: 'pass1234', role: 'doctor', status: 'active',
      specialty: 'Nutritionist', experience: 8, rating: 4.7, reviewCount: 156,
      consultationFee: 90, bio: 'Clinical nutritionist helping patients achieve optimal health through diet.',
      hospital: 'Wellness Clinic', availability: ['Mon', 'Tue', 'Thu', 'Fri'],
      avatar: 'https://png.pngtree.com/png-clipart/20200225/original/pngtree-doctor-icon-circle-png-image_5281907.jpg',
    },
    {
      name: 'Dr. Robert Kim', email: 'robert@health.com', password: 'pass1234', role: 'doctor', status: 'active',
      specialty: 'Psychiatrist', experience: 15, rating: 4.9, reviewCount: 201,
      consultationFee: 120, bio: 'Compassionate psychiatrist specializing in anxiety and depression.',
      hospital: 'Mind & Body Clinic', availability: ['Wed', 'Thu', 'Fri'],
      avatar: 'https://png.pngtree.com/png-clipart/20200225/original/pngtree-doctor-icon-circle-png-image_5281907.jpg',
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
  const ex = (name: string, muscleGroup: string, sets?: number, reps?: number, duration?: number) =>
    ({ name, muscleGroup, sets, reps, duration, description: '', restTime: 30 });

  await WorkoutPlan.create([
    { name: 'Full Body Blast', description: 'Complete full-body workout for all fitness levels', level: 'beginner', duration: 45, category: 'Strength', tags: ['full-body', 'strength', 'beginner'], imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', caloriesBurn: 350, createdBy: admin._id, exercises: [ex('Squats','Legs',3,12), ex('Push-ups','Chest',3,15), ex('Lunges','Legs',3,10), ex('Plank','Core',3,undefined,60), ex('Dumbbell Rows','Back',3,12)] },
    { name: 'HIIT Cardio', description: 'High-intensity interval training for maximum fat burn', level: 'intermediate', duration: 30, category: 'HIIT', tags: ['hiit', 'cardio', 'fat-burn'], imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400', caloriesBurn: 450, createdBy: admin._id, exercises: [ex('Burpees','Full Body',4,10), ex('Jump Squats','Legs',4,12), ex('Mountain Climbers','Core',4,undefined,30), ex('High Knees','Cardio',4,undefined,30), ex('Box Jumps','Legs',4,10)] },
    { name: 'Yoga Flow', description: 'Relaxing yoga session for flexibility and mindfulness', level: 'beginner', duration: 60, category: 'Yoga', tags: ['yoga', 'flexibility', 'mindfulness'], imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400', caloriesBurn: 200, createdBy: admin._id, exercises: [ex('Sun Salutation','Full Body',undefined,undefined,300), ex('Warrior I','Legs',undefined,undefined,60), ex('Warrior II','Legs',undefined,undefined,60), ex("Child's Pose",'Back',undefined,undefined,120), ex('Savasana','Full Body',undefined,undefined,300)] },
    { name: 'Advanced Strength', description: 'Heavy lifting program for experienced athletes', level: 'advanced', duration: 75, category: 'Strength', tags: ['strength', 'advanced', 'powerlifting'], imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400', caloriesBurn: 500, createdBy: admin._id, exercises: [ex('Deadlift','Back',5,5), ex('Bench Press','Chest',5,5), ex('Barbell Squat','Legs',5,5), ex('Overhead Press','Shoulders',4,6), ex('Barbell Rows','Back',4,8)] },
    { name: 'Morning Yoga', description: 'Energizing morning yoga routine to start your day right', level: 'beginner', duration: 30, category: 'Yoga', tags: ['yoga', 'morning', 'energy'], imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400', caloriesBurn: 150, createdBy: admin._id, exercises: [ex('Cat-Cow Stretch','Spine',undefined,undefined,60), ex('Downward Dog','Full Body',undefined,undefined,60), ex('Standing Forward Fold','Hamstrings',undefined,undefined,60), ex('Tree Pose','Balance',undefined,undefined,60), ex('Seated Twist','Spine',undefined,undefined,60)] },
    { name: 'Power Yoga', description: 'Dynamic yoga combining strength and flexibility', level: 'intermediate', duration: 50, category: 'Yoga', tags: ['yoga', 'strength', 'flexibility'], imageUrl: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400', caloriesBurn: 280, createdBy: admin._id, exercises: [ex('Chaturanga','Chest',undefined,undefined,30), ex('Crow Pose','Arms',undefined,undefined,30), ex('Warrior III','Balance',undefined,undefined,60), ex('Chair Pose','Legs',undefined,undefined,60), ex('Boat Pose','Core',undefined,undefined,60)] },
    { name: '5K Runner Training', description: 'Structured running program to build endurance', level: 'beginner', duration: 40, category: 'Cardio', tags: ['running', 'cardio', 'endurance'], imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400', caloriesBurn: 380, createdBy: admin._id, exercises: [ex('Warm-up Walk','Legs',undefined,undefined,300), ex('Interval Run/Walk','Cardio',undefined,undefined,600), ex('Steady Jog','Cardio',undefined,undefined,900), ex('Cool-down Stretch','Full Body',undefined,undefined,300), ex('Breathing Exercises','Core',undefined,undefined,120)] },
    { name: 'Core Crusher', description: 'Intense core workout for a strong midsection', level: 'intermediate', duration: 25, category: 'Strength', tags: ['core', 'abs', 'stability'], imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400', caloriesBurn: 220, createdBy: admin._id, exercises: [ex('Crunches','Abs',3,20), ex('Bicycle Kicks','Abs',3,20), ex('Leg Raises','Lower Abs',3,15), ex('Russian Twists','Obliques',3,20), ex('Plank Variations','Core',3,undefined,45)] },
    { name: 'Flexibility & Stretch', description: 'Full-body stretching to improve mobility', level: 'beginner', duration: 35, category: 'Flexibility', tags: ['stretching', 'flexibility', 'recovery'], imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400', caloriesBurn: 120, createdBy: admin._id, exercises: [ex('Hip Flexor Stretch','Hips',undefined,undefined,60), ex('Hamstring Stretch','Hamstrings',undefined,undefined,60), ex('Shoulder Rolls','Shoulders',undefined,undefined,60), ex('Spinal Twist','Spine',undefined,undefined,60), ex('Pigeon Pose','Hips',undefined,undefined,90)] },
    { name: 'Tabata Burn', description: '20 seconds on, 10 seconds off — ultimate fat-burning protocol', level: 'advanced', duration: 20, category: 'HIIT', tags: ['tabata', 'hiit', 'fat-burn', 'intense'], imageUrl: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400', caloriesBurn: 400, createdBy: admin._id, exercises: [ex('Squat Jumps','Legs',8,undefined,20), ex('Push-up Burpees','Full Body',8,undefined,20), ex('Tuck Jumps','Cardio',8,undefined,20), ex('Speed Skaters','Cardio',8,undefined,20), ex('Plank Jacks','Core',8,undefined,20)] },
    { name: 'Basketball Conditioning', description: 'Sport-specific drills for agility and court performance', level: 'intermediate', duration: 55, category: 'Sports', tags: ['sports', 'basketball', 'agility'], imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400', caloriesBurn: 480, createdBy: admin._id, exercises: [ex('Defensive Slides','Legs',4,undefined,30), ex('Suicide Sprints','Cardio',6,undefined,20), ex('Jump Rope','Cardio',3,undefined,60), ex('Cone Drills','Agility',4,undefined,30), ex('Box Jumps','Legs',3,10)] },
    { name: 'Upper Body Sculpt', description: 'Targeted upper body workout for arms, shoulders and back', level: 'intermediate', duration: 40, category: 'Strength', tags: ['upper-body', 'arms', 'shoulders', 'back'], imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400', caloriesBurn: 300, createdBy: admin._id, exercises: [ex('Pull-ups','Back',4,8), ex('Dumbbell Curls','Biceps',3,12), ex('Tricep Dips','Triceps',3,12), ex('Lateral Raises','Shoulders',3,15), ex('Face Pulls','Rear Delts',3,15)] },
    { name: 'Leg Day Power', description: 'Comprehensive lower body workout for quads, hamstrings and glutes', level: 'advanced', duration: 60, category: 'Strength', tags: ['legs', 'glutes', 'lower-body', 'power'], imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400', caloriesBurn: 520, createdBy: admin._id, exercises: [ex('Barbell Squats','Legs',5,5), ex('Romanian Deadlifts','Hamstrings',4,8), ex('Leg Press','Quads',4,12), ex('Walking Lunges','Legs',3,12), ex('Calf Raises','Calves',4,20)] },
    { name: 'Swim Fit', description: 'Pool-based cardio for a full-body low-impact workout', level: 'beginner', duration: 45, category: 'Cardio', tags: ['swimming', 'cardio', 'low-impact', 'endurance'], imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400', caloriesBurn: 420, createdBy: admin._id, exercises: [ex('Freestyle Laps','Full Body',undefined,undefined,300), ex('Backstroke','Back',undefined,undefined,300), ex('Kickboard Drills','Legs',undefined,undefined,180), ex('Water Jogging','Cardio',undefined,undefined,300), ex('Cool-down Float','Full Body',undefined,undefined,120)] },
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
    { userId: patient._id, userName: patient.name, userAvatar: patient.avatar, content: 'Just completed my first 5K run! Feeling amazing after 3 months of training. Never give up! 🏃‍♂️', likes: 42, tags: ['running', 'fitness'] },
    { userId: doctor._id, userName: doctor.name, userAvatar: doctor.avatar, content: 'Reminder: staying hydrated is one of the simplest things you can do for your health. Aim for 8 glasses a day! 💧', likes: 65, tags: ['health', 'hydration'] },
    { userId: patient._id, userName: patient.name, userAvatar: patient.avatar, content: 'Meal prepped for the entire week! Feeling so organized. Chicken, rice, and veggies for days 🥗', likes: 38, tags: ['nutrition', 'mealprep'] },
    { userId: doctor._id, userName: doctor.name, userAvatar: doctor.avatar, content: 'Sleep is the most underrated health tool. 7-9 hours per night can reduce your risk of heart disease, diabetes, and depression. Prioritize it! 😴', likes: 91, tags: ['sleep', 'wellness'] },
    { userId: patient._id, userName: patient.name, userAvatar: patient.avatar, content: '30 days of meditation complete! My anxiety levels have dropped significantly. Highly recommend the 10-minute morning sessions 🧘', likes: 57, tags: ['mentalhealth', 'meditation'] },
  ]);
  console.log('Community posts seeded');

  // ── Extra patients (for doctor's appointment list) ────────────────────────
  const [patient2, patient3, patient4, patient5] = await User.create([
    { name: 'Maria Garcia',   email: 'maria@health.com',   password: 'pass1234', role: 'user', height: 162, weight: 58, bloodType: 'A+', gender: 'female', dateOfBirth: '1985-03-22' },
    { name: 'Tom Bennett',    email: 'tom@health.com',     password: 'pass1234', role: 'user', height: 180, weight: 85, bloodType: 'B+', gender: 'male',   dateOfBirth: '1992-07-10' },
    { name: 'Lisa Kumar',     email: 'lisa@health.com',    password: 'pass1234', role: 'user', height: 168, weight: 63, bloodType: 'O-', gender: 'female', dateOfBirth: '1995-11-05' },
    { name: 'James Okafor',   email: 'james2@health.com',  password: 'pass1234', role: 'user', height: 175, weight: 78, bloodType: 'AB+', gender: 'male',  dateOfBirth: '1988-09-18' },
  ]);
  console.log('Extra patients seeded');

  // ── Appointments ───────────────────────────────────────────────────────────
  const doctors = await User.find({ role: 'doctor', status: 'active' });
  const [doc1, doc2, doc3, doc4] = doctors;

  const futureDate = (daysFromNow: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d;
  };
  const pastDate = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d;
  };

  await Appointment.create([
    // ── Alex Johnson's appointments ──────────────────────────────────────────
    { userId: patient._id, doctorId: doc1._id, doctorName: doc1.name, specialty: (doc1 as any).specialty, date: futureDate(3),  time: '10:00 AM', type: 'video',      status: 'confirmed', notes: 'Annual checkup' },
    { userId: patient._id, doctorId: doc2?._id || doc1._id, doctorName: doc2?.name || doc1.name, specialty: (doc2 as any)?.specialty || (doc1 as any).specialty, date: futureDate(7),  time: '2:00 PM',  type: 'in-person',  status: 'pending',   notes: 'Heart palpitations follow-up' },
    { userId: patient._id, doctorId: doc3?._id || doc1._id, doctorName: doc3?.name || doc1.name, specialty: (doc3 as any)?.specialty || (doc1 as any).specialty, date: futureDate(14), time: '11:00 AM', type: 'video',      status: 'pending',   notes: 'Diet consultation' },
    { userId: patient._id, doctorId: doc1._id, doctorName: doc1.name, specialty: (doc1 as any).specialty, date: pastDate(10),  time: '9:00 AM',  type: 'in-person',  status: 'completed', notes: 'Blood pressure check', prescription: 'Continue current medication' },
    { userId: patient._id, doctorId: doc4?._id || doc1._id, doctorName: doc4?.name || doc1.name, specialty: (doc4 as any)?.specialty || (doc1 as any).specialty, date: pastDate(20),  time: '3:00 PM',  type: 'phone',      status: 'completed', notes: 'Anxiety management session' },
    { userId: patient._id, doctorId: doc2?._id || doc1._id, doctorName: doc2?.name || doc1.name, specialty: (doc2 as any)?.specialty || (doc1 as any).specialty, date: pastDate(5),   time: '4:00 PM',  type: 'video',      status: 'cancelled' },

    // ── Dr. Sarah Mitchell (doc1) — today's appointments ────────────────────
    { userId: patient2._id,  doctorId: doc1._id, doctorName: doc1.name, specialty: (doc1 as any).specialty, date: new Date(), time: '9:00 AM',  type: 'in-person', status: 'confirmed', notes: 'Routine physical exam' },
    { userId: patient3._id,  doctorId: doc1._id, doctorName: doc1.name, specialty: (doc1 as any).specialty, date: new Date(), time: '11:00 AM', type: 'video',     status: 'pending',   notes: 'Fever and sore throat' },
    { userId: patient4._id,  doctorId: doc1._id, doctorName: doc1.name, specialty: (doc1 as any).specialty, date: new Date(), time: '2:00 PM',  type: 'in-person', status: 'confirmed', notes: 'Follow-up on lab results' },
    { userId: patient5._id,  doctorId: doc1._id, doctorName: doc1.name, specialty: (doc1 as any).specialty, date: new Date(), time: '4:00 PM',  type: 'phone',     status: 'pending',   notes: 'Medication review' },

    // ── Dr. Sarah Mitchell — upcoming appointments ───────────────────────────
    { userId: patient2._id,  doctorId: doc1._id, doctorName: doc1.name, specialty: (doc1 as any).specialty, date: futureDate(2),  time: '10:00 AM', type: 'video',     status: 'confirmed', notes: 'Diabetes management check' },
    { userId: patient3._id,  doctorId: doc1._id, doctorName: doc1.name, specialty: (doc1 as any).specialty, date: futureDate(4),  time: '3:00 PM',  type: 'in-person', status: 'pending',   notes: 'Back pain consultation' },
    { userId: patient4._id,  doctorId: doc1._id, doctorName: doc1.name, specialty: (doc1 as any).specialty, date: futureDate(6),  time: '9:00 AM',  type: 'video',     status: 'pending',   notes: 'Thyroid follow-up' },
    { userId: patient5._id,  doctorId: doc1._id, doctorName: doc1.name, specialty: (doc1 as any).specialty, date: futureDate(9),  time: '1:00 PM',  type: 'in-person', status: 'confirmed', notes: 'Skin rash evaluation' },
    { userId: patient._id,   doctorId: doc1._id, doctorName: doc1.name, specialty: (doc1 as any).specialty, date: futureDate(11), time: '11:00 AM', type: 'video',     status: 'pending',   notes: 'General wellness check' },

    // ── Dr. Sarah Mitchell — past/completed appointments ─────────────────────
    { userId: patient2._id,  doctorId: doc1._id, doctorName: doc1.name, specialty: (doc1 as any).specialty, date: pastDate(3),  time: '10:00 AM', type: 'in-person', status: 'completed', notes: 'Flu symptoms', prescription: 'Paracetamol 500mg, rest for 3 days' },
    { userId: patient3._id,  doctorId: doc1._id, doctorName: doc1.name, specialty: (doc1 as any).specialty, date: pastDate(7),  time: '2:00 PM',  type: 'video',     status: 'completed', notes: 'Hypertension review', prescription: 'Amlodipine 5mg daily' },
    { userId: patient4._id,  doctorId: doc1._id, doctorName: doc1.name, specialty: (doc1 as any).specialty, date: pastDate(12), time: '9:00 AM',  type: 'in-person', status: 'completed', notes: 'Post-surgery follow-up', prescription: 'Continue physiotherapy' },
    { userId: patient5._id,  doctorId: doc1._id, doctorName: doc1.name, specialty: (doc1 as any).specialty, date: pastDate(15), time: '3:00 PM',  type: 'phone',     status: 'completed', notes: 'Migraine management', prescription: 'Sumatriptan 50mg as needed' },
    { userId: patient2._id,  doctorId: doc1._id, doctorName: doc1.name, specialty: (doc1 as any).specialty, date: pastDate(25), time: '11:00 AM', type: 'video',     status: 'cancelled', notes: 'Patient cancelled' },
  ]);
  console.log('Appointments seeded');

  // ── Health Logs ────────────────────────────────────────────────────────────
  const moods: Array<'great' | 'good' | 'okay' | 'bad' | 'terrible'> = ['great', 'good', 'good', 'okay', 'great', 'good', 'great', 'okay', 'good', 'great', 'bad', 'good', 'great', 'good'];
  await HealthLog.create(
    moods.map((mood, i) => ({
      userId: patient._id,
      date: pastDate(moods.length - 1 - i),
      calories: 1600 + Math.floor(Math.random() * 700),
      water: 1800 + Math.floor(Math.random() * 800),
      steps: 5000 + Math.floor(Math.random() * 7000),
      sleepHours: 6 + Math.random() * 2.5,
      heartRate: 65 + Math.floor(Math.random() * 20),
      weight: 71 + (Math.random() - 0.5),
      mood,
      notes: i % 3 === 0 ? 'Feeling good today, hit my step goal!' : undefined,
    }))
  );
  console.log('Health logs seeded');

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
