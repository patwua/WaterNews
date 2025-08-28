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
  if (!email) return res.status(401).json({ error: 'Unauthorized' });

  const db = await getDb();
  const posts = db.collection('posts');

  const admin = (await isAdminEmail(email)) || (await isAdminUser(email));
  const { all, author, q } = req.query || {};
  const filter = {};
  if (admin && all === '1' && author) {
    filter.authorEmail = String(author).toLowerCase();
  } else {
    filter.authorEmail = email.toLowerCase();
  }
  if (q) filter.title = { $regex: String(q), $options: 'i' };
  const items = await posts.find(filter).sort({ publishedAt: -1 }).limit(200).toArray();
  res.json({ items });
}
