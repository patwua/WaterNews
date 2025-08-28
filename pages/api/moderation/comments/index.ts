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

  const { status = 'pending', q = '' } = req.query || {};
  const db = await getDb();
  const col = db.collection('comments');
  const filter = { status: Array.isArray(status) ? { $in: status } : status };
  if (q) {
    filter['$or'] = [
      { body: { $regex: String(q), $options: 'i' } },
      { authorEmail: { $regex: String(q), $options: 'i' } },
      { postSlug: { $regex: String(q), $options: 'i' } },
    ];
  }
  const items = await col.find(filter).sort({ createdAt: -1 }).limit(300).toArray();
  res.json({ items });
}
