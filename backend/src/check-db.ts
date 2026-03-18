import mongoose from 'mongoose';
import 'dotenv/config';

async function check() {
  await mongoose.connect(process.env.MONGO_URI as string);
  const db = mongoose.connection.db!;

  const cols = ['users','appointments','healthlogs','mealplans','workoutplans','blogposts','communityposts'];
  for (const col of cols) {
    const count = await db.collection(col).countDocuments();
    console.log(`${col}: ${count} docs`);
  }

  console.log('\n--- APPOINTMENTS ---');
  const appts = await db.collection('appointments').find({}).toArray();
  appts.forEach((a: any) => {
    console.log(`  doctorName: ${a.doctorName} | status: ${a.status} | date: ${new Date(a.date).toDateString()} | doctorId: ${a.doctorId}`);
  });

  console.log('\n--- DOCTORS ---');
  const doctors = await db.collection('users').find({ role: 'doctor' }, { projection: { name:1, email:1, status:1, specialty:1 } }).toArray();
  doctors.forEach((d: any) => console.log(`  ${d.name} | ${d.email} | status: ${d.status} | specialty: ${d.specialty}`));

  await mongoose.disconnect();
}
check().catch(console.error);
