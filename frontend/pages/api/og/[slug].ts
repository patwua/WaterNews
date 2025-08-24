import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/lib/server/db';
import Post from '@/models/Post';
import { buildOgForPost } from '@/lib/og';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }
  const { slug } = req.query;
  if (!slug || Array.isArray(slug)) {
    res.status(400).json({ error: 'Invalid slug' });
    return;
  }
  await dbConnect();
  const post = await Post.findOne({ slug }).lean();
  if (!post) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  const url = buildOgForPost(post);
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=86400');
  res.status(302).setHeader('Location', url);
  res.end();
}
