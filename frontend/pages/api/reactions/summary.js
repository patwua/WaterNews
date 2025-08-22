import { getDb } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const { slug } = req.query || {};
  if (!slug) return res.status(400).json({ error: 'slug required' });
  const db = await getDb();
  const col = db.collection('reactions');
  const agg = await col.aggregate([
    { $match: { slug: String(slug) } },
    { $group: { _id: '$type', count: { $sum: 1 } } }
  ]).toArray();
  const out = { like: 0, insight: 0, question: 0 };
  for (const a of agg) if (a?._id in out) out[a._id] = a.count;
  res.json(out);
}
