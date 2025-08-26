// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

// POST: log activity { type, data? }
// GET: list recent
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const who = session?.user?.email || null;
  const { id } = req.query || {};
  const db = await getDb();
  const col = db.collection('draftActivity');
  await col.createIndex({ draftId: 1, createdAt: -1 });
  if (req.method === 'POST') {
    if (!who) return res.status(401).json({ error: 'Unauthorized' });
    const { type, data } = req.body || {};
    if (!type) return res.status(400).json({ error: 'type required' });
    const doc = {
      draftId: new ObjectId(String(id)),
      authorEmail: who,
      type: String(type).slice(0, 64),
      data: data || null,
      createdAt: new Date().toISOString(),
    };
    const r = await col.insertOne(doc);
    return res.json({ ok: true, id: r.insertedId });
  }
  if (req.method === 'GET') {
    const items = await col.find({ draftId: new ObjectId(String(id)) }).sort({ createdAt: -1 }).limit(100).toArray();
    return res.json({ items });
  }
  res.setHeader('Allow','GET,POST'); res.status(405).end();
}
