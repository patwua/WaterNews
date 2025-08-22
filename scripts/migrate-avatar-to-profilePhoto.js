import { MongoClient } from "mongodb";
const uri = process.env.MONGODB_URI; const dbName = process.env.MONGODB_DB || "waternews";

(async () => {
  const c = new MongoClient(uri); await c.connect(); const db = c.db(dbName);
  const users = db.collection("users");
  const cur = users.find({ avatarUrl: { $exists: true } });
  let n = 0;
  for await (const u of cur) {
    await users.updateOne({ _id: u._id }, { $set: { profilePhotoUrl: u.avatarUrl }, $unset: { avatarUrl: "" } });
    n++;
  }
  console.log(`Migrated ${n} user(s).`);
  await c.close();
})();
