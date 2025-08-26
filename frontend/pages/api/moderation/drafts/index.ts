// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { isAdminEmail, isAdminUser } from '@/lib/admin-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email || null;
  const admin = email && ((await isAdminEmail(email)) || (await isAdminUser(email)));
  if (!admin) return res.status(401).json({ error: 'Unauthorized' });

  const db = await getDb();
  const col = db.collection('drafts');
  const { status = 'ready', q = '' } = req.query || {};

  const filter = { status: { $in: Array.isArray(status) ? status : [status] } };
  if (q) {
    filter['$or'] = [
      { title: { $regex: String(q), $options: 'i' } },
      { authorEmail: { $regex: String(q), $options: 'i' } }
    ];
  }
  const items = await col.find(filter).sort({ updatedAt: -1 }).limit(500).toArray();
  res.json({ items });
}
