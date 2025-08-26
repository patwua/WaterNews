// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email || null;
  if (!email) return res.status(401).json({ error: 'Unauthorized' });
  const { id } = req.body || {};
  if (!id) return res.status(400).json({ error: 'id required' });
  const db = await getDb();
  const col = db.collection('drafts');
  await col.updateOne({ _id: new ObjectId(String(id)), visibility: 'network' }, { $addToSet: { collabHelpers: email }, $set: { updatedAt: new Date().toISOString() } });
  res.json({ ok: true });
}
