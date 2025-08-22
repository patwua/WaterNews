import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const who = session?.user?.email || null;
  if (!who) return res.status(401).json({ error: 'Unauthorized' });
  const { id } = req.query || {};
  if (!id) return res.status(400).json({ error: 'id required' });
  const db = await getDb();
  const col = db.collection('draftComments');
  await col.createIndex({ draftId: 1, createdAt: -1 });
  if (req.method === 'GET') {
    const items = await col.find({ draftId: new ObjectId(String(id)) }).sort({ createdAt: -1 }).limit(200).toArray();
    return res.json({ items });
  }
  if (req.method === 'POST') {
    const body = (req.body?.body || '').toString().slice(0, 5000);
    if (!body) return res.status(400).json({ error: 'body required' });
    const doc = { draftId: new ObjectId(String(id)), authorEmail: who, body, createdAt: new Date().toISOString(), resolved: false };
    const r = await col.insertOne(doc);
    return res.json({ ok: true, comment: { _id: r.insertedId, ...doc } });
  }
  res.setHeader('Allow','GET,POST'); res.status(405).end();
}
