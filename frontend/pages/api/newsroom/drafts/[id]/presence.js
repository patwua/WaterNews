import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

// GET: list active viewers/editors
// POST: heartbeat current user
export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const who = session?.user?.email || null;
  const { id } = req.query || {};
  if (!id) return res.status(400).json({ error: 'id required' });
  const db = await getDb();
  const col = db.collection('draftPresence');
  await col.createIndex({ draftId: 1, email: 1 }, { unique: true });
  await col.createIndex({ seenAt: 1 }, { expireAfterSeconds: 120 }); // TTL-like cleanup (requires MongoDB TTL index on a Date; emulate with cron if not allowed)
  if (req.method === 'POST') {
    if (!who) return res.status(401).json({ error: 'Unauthorized' });
    const now = new Date();
    await col.updateOne(
      { draftId: new ObjectId(String(id)), email: who },
      { $set: { draftId: new ObjectId(String(id)), email: who, seenAt: now, name: session.user.name || null } },
      { upsert: true }
    );
    return res.json({ ok: true });
  }
  if (req.method === 'GET') {
    const cutoff = new Date(Date.now() - 120_000);
    const items = await col.find({ draftId: new ObjectId(String(id)), seenAt: { $gte: cutoff } }).project({ email:1, name:1, seenAt:1 }).toArray();
    return res.json({ items });
  }
  res.setHeader('Allow','GET,POST'); res.status(405).end();
}
