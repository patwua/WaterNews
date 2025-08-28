// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { isAdminEmail, isAdminUser } from '@/lib/admin-auth';
import { createPatwuaThread } from '@/lib/patwua';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { slug } = req.query || {};
  if (!slug) return res.status(400).json({ error: 'slug required' });

  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email || null;
  const admin = email && ((await isAdminEmail(email)) || (await isAdminUser(email)));
  if (!admin) return res.status(401).json({ error: 'Unauthorized' });

  const db = await getDb();
  const posts = db.collection('posts');
  const post = await posts.findOne({ slug: String(slug) });
  if (!post) return res.status(404).json({ error: 'post not found' });
  if (post.patwuaThreadUrl) return res.json({ ok: true, threadUrl: post.patwuaThreadUrl, already: true });

  const base = process.env.NEXTAUTH_URL || '';
  const url = `${base}/news/${post.slug}`;
  const threadUrl = await createPatwuaThread({
    slug: post.slug, title: post.title || 'Untitled', excerpt: post.excerpt || '', url
  });
  if (!threadUrl) return res.status(502).json({ error: 'Failed to create thread' });
  await posts.updateOne({ _id: post._id }, { $set: { patwuaThreadUrl: threadUrl } });
  return res.json({ ok: true, threadUrl });
}
