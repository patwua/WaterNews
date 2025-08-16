import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/server/db";
import Post from "@/models/Post";
import { scoreRelated } from "@/lib/server/similarity";

/**
 * GET /api/recs/related?slug=... | title=...&tags=a,b,c
 * Returns top related live posts (excludes exact slug).
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { slug, title = "", tags = "" } = req.query as { slug?: string; title?: string; tags?: string };
  let seedTitle = String(title || "");
  let seedTags = (String(tags || ""))
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  if (slug) {
    const cur = await Post.findOne({ slug }).lean();
    if (cur) {
      seedTitle = cur.title || seedTitle;
      seedTags = cur.tags || seedTags;
    }
  }

  // Fetch recent pool to score against (adjust size as needed)
  const pool = await Post.find({}).sort({ publishedAt: -1 }).limit(200).lean();

  const scored = pool
    .filter(p => !slug || p.slug !== slug)
    .map(p => ({
      p,
      s: scoreRelated(seedTitle, seedTags, p.title || "", p.tags || []),
    }))
    .filter(x => x.s > 0) // only keep meaningful relations
    .sort((a, b) => b.s - a.s)
    .slice(0, 10)
    .map(({ p, s }) => ({
      id: String(p._id),
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      coverImage: p.coverImage,
      tags: p.tags,
      score: Number(s.toFixed(3)),
      publishedAt: p.publishedAt,
    }));

  return res.json({ items: scored });
}
