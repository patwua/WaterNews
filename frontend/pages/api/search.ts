import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/server/db";
import Post from "@/models/Post";

/**
 * GET /api/search?q=...&tags=a,b&limit=20
 * Basic text search across title/excerpt and optional tag filter.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  await dbConnect();
  const { q = "", tags = "", limit = "20" } = req.query as Record<string, string>;
  const lim = Math.max(1, Math.min(50, parseInt(limit || "20", 10) || 20));
  const tagList = String(tags || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const find: any = {};
  if (q.trim()) {
    const rx = new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    find.$or = [{ title: rx }, { excerpt: rx }];
  }
  if (tagList.length) {
    find.tags = { $in: tagList };
  }

  const rows = await Post.find(find)
    .sort({ publishedAt: -1 })
    .limit(lim)
    .select({
      _id: 1,
      slug: 1,
      title: 1,
      excerpt: 1,
      tags: 1,
      publishedAt: 1,
    })
    .lean();

  res.setHeader("Cache-Control", "s-maxage=20, stale-while-revalidate=30");
  res.json({
    items: rows.map((r) => ({
      id: String(r._id),
      slug: r.slug,
      title: r.title,
      excerpt: r.excerpt,
      tags: r.tags || [],
      publishedAt: r.publishedAt,
    })),
  });
}

