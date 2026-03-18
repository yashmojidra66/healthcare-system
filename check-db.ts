import mongoose from 'mongoose';
import 'dotenv/config';

async function check() {
  await mongoose.connect(process.env.MONGO_URI as string);
  const db = mongoose.connection.db!;
  const collections = ['users','appointments','healthlogs','mealplans','workoutplans','blogposts','communityposts'];
  for (const col of collections) {
    const count = await db.collection(col).countDocuments();
    console.log(col + ': ' + count);
  }
  const users = await db.collection('users').find({}, { projection: { name:1, email:1, role:1, status:1, specialty:1 } }).toArray();
  users.forEach((u: any) => console.log('USER|' + u.name + '|' + u.email + '|' + u.role + '|' + (u.status||'active') + '|' + (u.specialty||'-')));
  await mongoose.disconnect();
}
check().catch(console.error);
