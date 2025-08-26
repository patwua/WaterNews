// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { isAdminEmail, isAdminUser } from '@/lib/admin-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query || {};
  if (!slug) return res.status(400).json({ error: 'slug required' });
  if (req.method !== 'POST') return res.status(405).end();
  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email || null;
  const admin = email && ((await isAdminEmail(email)) || (await isAdminUser(email)));
  if (!admin) return res.status(401).json({ error: 'Unauthorized' });
  const { url } = req.body || {};
  if (!url || !/^https?:\/\//i.test(String(url))) return res.status(400).json({ error: 'Valid url required' });
  const db = await getDb();
  await db.collection('posts').updateOne({ slug: String(slug) }, { $set: { patwuaThreadUrl: String(url) } });
  return res.json({ ok: true });
}
