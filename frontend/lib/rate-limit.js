import { getDb } from '@/lib/db';

let ensured = false;
async function ensureIndexes(db) {
  if (ensured) return;
  const col = db.collection('ratelimits');
  await col.createIndex({ key: 1, ip: 1 }, { unique: true });
  await col.createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 });
  ensured = true;
}

export async function checkRateLimit({ req, key, max = 5, windowMs = 60000 }) {
  const db = await getDb();
  await ensureIndexes(db);
  const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').toString();
  const expireAt = new Date(Date.now() + Number(windowMs));
  const col = db.collection('ratelimits');
  const r = await col.findOneAndUpdate(
    { key, ip },
    { $inc: { count: 1 }, $setOnInsert: { expireAt } },
    { upsert: true, returnDocument: 'after' }
  );
  if ((r.value?.count || 0) > Number(max)) return false;
  return true;
}
