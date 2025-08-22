import { getDb } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const session = await getServerSession(req, res, authOptions);
  const who = session?.user?.email || null;
  if (!who) return res.status(401).json({ error: 'Unauthorized' });
  const { displayName, handle, bio, profilePhotoUrl } = req.body || {};
  const db = await getDb();
  const users = db.collection('users');
  const updates: any = { updatedAt: new Date().toISOString() };
  if (displayName != null) updates.displayName = String(displayName).slice(0, 120);
  if (handle != null) updates.handle = String(handle).slice(0, 60);
  if (bio != null) updates.bio = String(bio).slice(0, 2000);
  if (profilePhotoUrl != null) updates.profilePhotoUrl = String(profilePhotoUrl).slice(0, 2048);
  if (handle) {
    const exists = await users.findOne({ handle: String(handle).toLowerCase(), email: { $ne: who } });
    if (exists) return res.status(409).json({ error: 'Handle already taken' });
    updates.handle = String(handle).toLowerCase();
  }
  const result = await users.updateOne({ email: who }, { $set: { email: who, ...updates } }, { upsert: true });
  const me = await users.findOne(
    { email: who },
    { projection: { email:1, displayName:1, handle:1, bio:1, profilePhotoUrl:1, followers:1, updatedAt:1 } }
  );
  res.json({ ok: true, user: me, upserted: !!result?.upsertedId });
}

