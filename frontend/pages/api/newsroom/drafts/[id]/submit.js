import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { isAdminEmail, isAdminUser } from '@/lib/admin-auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email || null;
  if (!email) return res.status(401).json({ error: 'Unauthorized' });

  const db = await getDb();
  const drafts = db.collection('drafts');
  const _id = new ObjectId(String(req.query.id));

  const doc = await drafts.findOne({ _id });
  if (!doc) return res.status(404).json({ error: 'Draft not found' });

  const admin = (await isAdminEmail(email)) || (await isAdminUser(email));
  const isOwner = (doc.authorEmail || '').toLowerCase() === email.toLowerCase();
  if (!admin && !isOwner) return res.status(403).json({ error: 'Forbidden' });

  // If second review is required, stay in 'needs_second_review'
  const nextStatus = doc.requireSecondReview ? 'needs_second_review' : 'ready';
  const now = new Date().toISOString();
  await drafts.updateOne({ _id }, { $set: { status: nextStatus, updatedAt: now } });
  const updated = await drafts.findOne({ _id });
  return res.json({ ok: true, draft: updated });
}

