import mongoose from 'mongoose';
import 'dotenv/config';

async function check() {
  await mongoose.connect(process.env.MONGO_URI as string);
  const db = mongoose.connection.db!;

  const alex = await db.collection('users').findOne({ email: 'user@health.com' });
  console.log('Alex _id:', alex?._id.toString());

  const appts = await db.collection('appointments').find({ userId: alex?._id }).toArray();
  console.log('Alex appointments count:', appts.length);
  appts.forEach((a: any) => console.log(`  ${a.doctorName} | ${a.status} | ${new Date(a.date).toDateString()}`));

  await mongoose.disconnect();
}
check().catch(console.error);
