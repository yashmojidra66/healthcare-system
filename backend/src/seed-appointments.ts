/**
 * Appointment-only seed — adds sample appointments without clearing other data
 * Run: npx ts-node src/seed-appointments.ts
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User';
import Appointment from './models/Appointment';

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log('Connected to MongoDB');

  // Clear only appointments
  await Appointment.deleteMany({});
  console.log('Cleared appointments');

  // Find users
  const patient  = await User.findOne({ email: 'user@health.com' });
  const doctor   = await User.findOne({ email: 'doctor@health.com' });

  if (!patient || !doctor) {
    console.error('❌ Run the main seed first: npx ts-node src/seed.ts');
    process.exit(1);
  }

  // Find or create extra patients
  const extras = [
    { name: 'Maria Garcia',  email: 'maria@health.com',  password: 'pass1234', role: 'user' as const, height: 162, weight: 58, bloodType: 'A+',  gender: 'female', dateOfBirth: '1985-03-22' },
    { name: 'Tom Bennett',   email: 'tom@health.com',    password: 'pass1234', role: 'user' as const, height: 180, weight: 85, bloodType: 'B+',  gender: 'male',   dateOfBirth: '1992-07-10' },
    { name: 'Lisa Kumar',    email: 'lisa@health.com',   password: 'pass1234', role: 'user' as const, height: 168, weight: 63, bloodType: 'O-',  gender: 'female', dateOfBirth: '1995-11-05' },
    { name: 'James Okafor',  email: 'james2@health.com', password: 'pass1234', role: 'user' as const, height: 175, weight: 78, bloodType: 'AB+', gender: 'male',   dateOfBirth: '1988-09-18' },
  ];

  const patients: any[] = [patient];
  for (const e of extras) {
    const existing = await User.findOne({ email: e.email });
    patients.push(existing ?? await User.create(e));
  }

  const [p1, p2, p3, p4, p5] = patients; // p1 = Alex, p2-p5 = extras

  const d = doctor as any;
  const dId   = d._id;
  const dName = d.name;
  const dSpec = d.specialty;

  const future = (n: number) => { const x = new Date(); x.setDate(x.getDate() + n); return x; };
  const past   = (n: number) => { const x = new Date(); x.setDate(x.getDate() - n); return x; };

  await Appointment.create([
    // ── Today ────────────────────────────────────────────────────────────────
    { userId: p2._id, doctorId: dId, doctorName: dName, specialty: dSpec, date: new Date(), time: '9:00 AM',  type: 'in-person', status: 'confirmed', notes: 'Routine physical exam' },
    { userId: p3._id, doctorId: dId, doctorName: dName, specialty: dSpec, date: new Date(), time: '11:00 AM', type: 'video',     status: 'pending',   notes: 'Fever and sore throat' },
    { userId: p4._id, doctorId: dId, doctorName: dName, specialty: dSpec, date: new Date(), time: '2:00 PM',  type: 'in-person', status: 'confirmed', notes: 'Follow-up on lab results' },
    { userId: p5._id, doctorId: dId, doctorName: dName, specialty: dSpec, date: new Date(), time: '4:00 PM',  type: 'phone',     status: 'pending',   notes: 'Medication review' },

    // ── Upcoming ─────────────────────────────────────────────────────────────
    { userId: p2._id, doctorId: dId, doctorName: dName, specialty: dSpec, date: future(2),  time: '10:00 AM', type: 'video',     status: 'confirmed', notes: 'Diabetes management check' },
    { userId: p3._id, doctorId: dId, doctorName: dName, specialty: dSpec, date: future(4),  time: '3:00 PM',  type: 'in-person', status: 'pending',   notes: 'Back pain consultation' },
    { userId: p4._id, doctorId: dId, doctorName: dName, specialty: dSpec, date: future(6),  time: '9:00 AM',  type: 'video',     status: 'pending',   notes: 'Thyroid follow-up' },
    { userId: p5._id, doctorId: dId, doctorName: dName, specialty: dSpec, date: future(9),  time: '1:00 PM',  type: 'in-person', status: 'confirmed', notes: 'Skin rash evaluation' },
    { userId: p1._id, doctorId: dId, doctorName: dName, specialty: dSpec, date: future(3),  time: '10:00 AM', type: 'video',     status: 'confirmed', notes: 'Annual checkup' },
    { userId: p1._id, doctorId: dId, doctorName: dName, specialty: dSpec, date: future(11), time: '11:00 AM', type: 'video',     status: 'pending',   notes: 'General wellness check' },

    // ── Completed ────────────────────────────────────────────────────────────
    { userId: p2._id, doctorId: dId, doctorName: dName, specialty: dSpec, date: past(3),  time: '10:00 AM', type: 'in-person', status: 'completed', notes: 'Flu symptoms',           prescription: 'Paracetamol 500mg, rest for 3 days' },
    { userId: p3._id, doctorId: dId, doctorName: dName, specialty: dSpec, date: past(7),  time: '2:00 PM',  type: 'video',     status: 'completed', notes: 'Hypertension review',    prescription: 'Amlodipine 5mg daily' },
    { userId: p4._id, doctorId: dId, doctorName: dName, specialty: dSpec, date: past(12), time: '9:00 AM',  type: 'in-person', status: 'completed', notes: 'Post-surgery follow-up', prescription: 'Continue physiotherapy' },
    { userId: p5._id, doctorId: dId, doctorName: dName, specialty: dSpec, date: past(15), time: '3:00 PM',  type: 'phone',     status: 'completed', notes: 'Migraine management',    prescription: 'Sumatriptan 50mg as needed' },
    { userId: p1._id, doctorId: dId, doctorName: dName, specialty: dSpec, date: past(10), time: '9:00 AM',  type: 'in-person', status: 'completed', notes: 'Blood pressure check',   prescription: 'Continue current medication' },

    // ── Cancelled ────────────────────────────────────────────────────────────
    { userId: p2._id, doctorId: dId, doctorName: dName, specialty: dSpec, date: past(25), time: '11:00 AM', type: 'video',     status: 'cancelled', notes: 'Patient cancelled' },
    { userId: p1._id, doctorId: dId, doctorName: dName, specialty: dSpec, date: past(5),  time: '4:00 PM',  type: 'video',     status: 'cancelled' },
  ]);

  console.log('✅ Appointments seeded! (17 total for Dr. Sarah Mitchell)');
  console.log('   Today:     4  |  Upcoming: 6  |  Completed: 5  |  Cancelled: 2');
  console.log('   Patients:  Alex Johnson, Maria Garcia, Tom Bennett, Lisa Kumar, James Okafor');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
