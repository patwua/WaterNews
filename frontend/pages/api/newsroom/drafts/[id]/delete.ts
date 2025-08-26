// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { isAdminEmail, isAdminUser } from '@/lib/admin-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const session = await getServerSession(req, res, authOptions);
  const who = session?.user?.email || null;
  if (!who) return res.status(401).json({ error: 'Unauthorized' });
  const { id } = req.query || {};
  if (!id) return res.status(400).json({ error: 'id required' });
  const db = await getDb();
  const col = db.collection('drafts');
  const admin = (await isAdminEmail(who)) || (await isAdminUser(who));
  const filter = admin ? { _id: new ObjectId(String(id)) } : { _id: new ObjectId(String(id)), authorEmail: who };
  const r = await col.deleteOne(filter);
  if (!r.deletedCount) return res.status(404).json({ error: 'Draft not found or not allowed' });
  res.json({ ok: true });
}
