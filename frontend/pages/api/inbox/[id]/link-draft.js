import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { isAdminEmail, isAdminUser } from '@/lib/admin-auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email || null;
  const ok = (await isAdminEmail(email)) || (await isAdminUser(email));
  if (!ok) return res.status(401).json({ error: 'Unauthorized' });

  const db = await getDb();
  if (!db) return res.status(500).json({ error: 'DB unavailable' });

  const ticketId = req.query.id;
  const { draftId } = req.body || {};
  if (!draftId) return res.status(400).json({ error: 'draftId required' });

  const now = new Date().toISOString();
  await db.collection('tickets').updateOne(
    { _id: new ObjectId(String(ticketId)) },
    { $set: { draftId: new ObjectId(String(draftId)), updatedAt: now } }
  );
  await db.collection('drafts').updateOne(
    { _id: new ObjectId(String(draftId)) },
    { $set: { ticketId: new ObjectId(String(ticketId)), updatedAt: now } }
  );
  return res.json({ ok: true });
}
