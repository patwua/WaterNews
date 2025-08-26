import { getDb } from '@/lib/db';
import type { Db } from 'mongodb';

let ensured = false;
async function ensureIndexes(db: Db): Promise<void> {
  if (ensured) return;
  const col = db.collection('ratelimits');
  await col.createIndex({ key: 1, ip: 1 }, { unique: true });
  await col.createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 });
  ensured = true;
}

export interface RateLimitOptions {
  req: any;
  key: string;
  max?: number;
  windowMs?: number;
}

export async function checkRateLimit({
  req,
  key,
  max = 5,
  windowMs = 60000,
}: RateLimitOptions): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
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
