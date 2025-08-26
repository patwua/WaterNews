// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await getDb();
  const col = db.collection('noticeComments');
  await col.createIndex({ noticeId: 1, createdAt: -1 });

  if (req.method === 'GET') {
    const { id } = req.query || {};
    if (!id) return res.status(400).json({ error: 'id required' });
    const items = await col.find({ noticeId: new ObjectId(String(id)) }).sort({ createdAt: -1 }).limit(200).toArray();
    return res.json({ items });
  }

  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions);
    const email = session?.user?.email || null;
    if (!email) return res.status(401).json({ error: 'Unauthorized' });
    const { id, body } = req.body || {};
    if (!id || !body) return res.status(400).json({ error: 'id and body required' });
    const now = new Date().toISOString();
    const doc = { noticeId: new ObjectId(String(id)), authorEmail: email, body: String(body).slice(0, 3000), createdAt: now };
    const r = await col.insertOne(doc);
    return res.json({ ok: true, comment: { _id: r.insertedId, ...doc } });
  }

  res.setHeader('Allow', 'GET,POST'); res.status(405).end();
}
