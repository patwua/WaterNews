import { getDb } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const db = await getDb();
  const posts = db.collection('posts');
  const events = db.collection('events'); // falls back if unavailable

  // Latest posts (simple & reliable)
  const latest = await posts.find({})
    .project({ title: 1, slug: 1, excerpt: 1, media: 1, authorEmail: 1, publishedAt: 1 })
    .sort({ publishedAt: -1 }).limit(10).toArray();

  // Trending: last 48h by view events (best-effort)
  const sinceIso = new Date(Date.now() - 48*60*60*1000).toISOString();
  let trending = [];
  try {
    const agg = await events.aggregate([
      { $match: { type: 'view', ts: { $gte: sinceIso } } },
      { $project: {
          postSlug: { $ifNull: ['$postSlug', '$target.slug'] },
          ts: 1
        } },
      { $match: { postSlug: { $ne: null } } },
      { $group: { _id: '$postSlug', views: { $sum: 1 }, last: { $max: '$ts' } } },
      { $sort: { views: -1, last: -1 } },
      { $limit: 10 }
    ]).toArray();
    if (agg.length) {
      const slugs = agg.map(a => a._id);
      const map = new Map(agg.map(a => [a._id, a.views]));
      const docs = await posts.find({ slug: { $in: slugs } })
        .project({ title: 1, slug: 1, excerpt: 1, media: 1, authorEmail: 1, publishedAt: 1 }).toArray();
      trending = docs.sort((a, b) => (map.get(b.slug) || 0) - (map.get(a.slug) || 0));
    }
  } catch {
    trending = [];
  }
  if (!trending.length) trending = latest.slice(0, 6);

  res.json({ trending, latest });
}
