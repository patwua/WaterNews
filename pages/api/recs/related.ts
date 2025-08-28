import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/server/db";
import Post from "@/models/Post";
import { scoreRelated, applyAffinityBoosts } from "@/lib/server/similarity";

/**
 * GET /api/recs/related
 * Query:
 *  - slug=... (optional; if present, seeds from that post)
 *  - title=...&tags=a,b,c (optional; used if slug not provided)
 *  - affinityTags=t1,t2 (optional; boosts)
 *  - affinityAuthors=u1,u2 (optional; boosts)
 *  - limit=10 (optional)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const {
    slug,
    title = "",
    tags = "",
    affinityTags = "",
    affinityAuthors = "",
    limit = "10",
  } = req.query as Record<string, string | undefined>;

  let seedTitle = String(title || "");
  let seedTags = String(tags || "")
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

  const affTags = String(affinityTags || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  const affAuthors = String(affinityAuthors || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  const lim = Math.max(1, Math.min(20, parseInt(String(limit || "10"), 10) || 10));

  // Pool size 200 keeps it snappy; adjust as your DB grows
  const pool = await Post.find({}).sort({ publishedAt: -1 }).limit(200).lean();

  const scored = pool
    .filter(p => !slug || p.slug !== slug)
    .map(p => {
      const base = scoreRelated(seedTitle, seedTags, p.title || "", p.tags || []);
      const boosted = applyAffinityBoosts(base, {
        postTags: p.tags || [],
        postAuthorId: p.authorId || null,
        affinityTags: affTags,
        affinityAuthors: affAuthors,
        engagementScore: typeof p.engagementScore === "number" ? p.engagementScore : null,
      });
      return { p, s: boosted };
    })
    .filter(x => x.s > 0.01)
    .sort((a, b) => b.s - a.s)
    .slice(0, lim)
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

