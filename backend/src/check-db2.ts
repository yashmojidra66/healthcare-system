import mongoose from 'mongoose';
import 'dotenv/config';

async function check() {
  await mongoose.connect(process.env.MONGO_URI as string);
  const db = mongoose.connection.db!;

  const sarah = await db.collection('users').findOne({ email: 'doctor@health.com' });
  console.log('Dr. Sarah _id:', sarah?._id.toString());

  const appts = await db.collection('appointments').find({}).toArray();
  console.log('\nAll appointments doctorIds:');
  appts.forEach((a: any) => {
    const match = a.doctorId?.toString() === sarah?._id.toString();
    console.log(`  ${a.doctorName} | doctorId: ${a.doctorId} | matches Sarah: ${match} | status: ${a.status}`);
  });

  await mongoose.disconnect();
}
check().catch(console.error);
