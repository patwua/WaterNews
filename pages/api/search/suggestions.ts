import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/server/db";
import Post from "@/models/Post";

/**
 * GET /api/search/suggestions
 * Returns:
 *  - tags: [{ tag, count }]
 *  - headlines: [{ slug, title, publishedAt }]
 *
 * Notes:
 *  - Popular tags are aggregated from recent posts (last 90 days, up to 2000 docs).
 *  - Headlines are recent posts (limit 8), newest first.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  // recent horizon: 90d
  const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  // Aggregate popular tags
  const tagAgg = await Post.aggregate([
    { $match: { publishedAt: { $gte: since } } },
    { $project: { tags: 1 } },
    { $unwind: "$tags" },
    { $group: { _id: { $toLower: "$tags" }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 12 },
  ]);

  // Recent headlines
  const recents = await Post.find({ publishedAt: { $gte: since } })
    .sort({ publishedAt: -1 })
    .limit(8)
    .select({ slug: 1, title: 1, publishedAt: 1 })
    .lean();

  res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=60");
  res.json({
    tags: tagAgg.map(t => ({ tag: t._id, count: t.count })),
    headlines: recents.map(r => ({
      slug: r.slug,
      title: r.title,
      publishedAt: r.publishedAt,
    })),
  });
}
