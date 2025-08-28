// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query || {};
  if (!slug) return res.status(400).json({ error: 'slug required' });
  if (req.method !== 'GET') return res.status(405).end();
  const db = await getDb();
  const post = await db.collection('posts').findOne({ slug: String(slug) }, { projection: { patwuaThreadUrl: 1 } });
  return res.json({ patwuaThreadUrl: post?.patwuaThreadUrl || null });
}
