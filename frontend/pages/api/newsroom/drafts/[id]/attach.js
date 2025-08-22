import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const session = await getServerSession(req, res, authOptions);
  const who = session?.user?.email || null;
  if (!who) return res.status(401).json({ error: 'Unauthorized' });
  const { id } = req.query || {};
  const { url, publicId, width, height, mime } = req.body || {};
  if (!id || !url) return res.status(400).json({ error: 'id and url required' });
  const db = await getDb();
  const col = db.collection('drafts');
  // author-owns or admin update is enforced elsewhere; keep it simple here by scoping to owner
  const doc = await col.findOne({ _id: new ObjectId(String(id)) });
  if (!doc || doc.authorEmail !== who) return res.status(403).json({ error: 'Not allowed' });
  const item = { url, publicId, width, height, mime, addedAt: new Date().toISOString() };
  await col.updateOne({ _id: doc._id }, { $push: { attachments: item }, $set: { updatedAt: new Date().toISOString() } });
  res.json({ ok: true, item });
}
