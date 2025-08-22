import { getDb } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email || null;
  if (!email) return res.status(401).json({ error: 'Unauthorized' });
  const db = await getDb();
  const col = db.collection('notices');
  await col.createIndex({ createdAt: -1 });

  if (req.method === 'GET') {
    const items = await col.find({}).sort({ createdAt: -1 }).limit(200).toArray();
    return res.json({ items });
  }
  if (req.method === 'POST') {
    const { title, body } = req.body || {};
    if (!title || !body) return res.status(400).json({ error: 'title and body required' });
    const now = new Date().toISOString();
    const doc = { title: String(title).slice(0,200), body: String(body).slice(0,5000), authorEmail: email, createdAt: now, updatedAt: now };
    const r = await col.insertOne(doc);
    return res.json({ ok: true, notice: { _id: r.insertedId, ...doc } });
  }
  res.setHeader('Allow', 'GET,POST'); res.status(405).end();
}
