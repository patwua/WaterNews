// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
// Lightweight stub that surfaces related internal posts by keyword and echoes suggestions.
// Replace later with a proper retrieval + web search pipeline.
import { getDb } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { text } = req.body || {};
  if (!text || String(text).length < 10) return res.status(400).json({ error: 'text too short' });
  const db = await getDb();
  const posts = db.collection('posts');
  const q = String(text).slice(0,200);
  const related = await posts.find({ $or: [{ title: { $regex: q, $options: 'i' } }, { excerpt: { $regex: q, $options: 'i' } }] })
    .project({ title:1, slug:1, excerpt:1 }).limit(5).toArray();
  const web = []; // fill with web search results later
  const angles = [
    'Add specific local context (locations, names, dates).',
    'Verify all figures and include sources inline.',
    'Balance sources: add at least one dissenting voice.',
    'Clarify timeline; add a short “What’s next” section.'
  ];
  const media = ['Insert a map or timeline graphic', 'Add a pull quote image for social', 'Attach 1–2 contextual photos'];
  res.json({
    related: related.map(p=>({ title: p.title, url: `/news/${p.slug}` })),
    web,
    angles,
    media
  });
}
