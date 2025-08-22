import { getDb } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email || null;
  if (!email) return res.status(401).json({ error: 'Unauthorized' });
  const db = await getDb();
  await db.collection('users').updateOne(
    { email: email.toLowerCase() },
    { $set: { noticesSeenAt: new Date().toISOString() } },
    { upsert: true }
  );
  res.json({ ok: true });
}
