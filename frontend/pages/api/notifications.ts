import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/server/db";
import Event from "@/models/Event";
import Post from "@/models/Post";

/**
 * GET /api/notifications
 * Query:
 *   - since?: number (ms epoch)
 *   - limit?: number (1..50) default 20
 *
 * Returns lightweight items suitable for the bell and full page.
 * We surface public events only, and resolve post slugs for linking.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  await dbConnect();

  const limit = Math.max(1, Math.min(50, parseInt(String(req.query.limit ?? "20"), 10) || 20));
  const since = req.query.since ? new Date(Number(req.query.since)) : null;

  const allowedTypes = ["article_published", "thread_hot", "follow", "like"] as const;

  const match: any = {
    visibility: "public",
    type: { $in: allowedTypes },
  };
  if (since && !isNaN(since.getTime())) {
    match.createdAt = { $gt: since };
  }

  // Pull events newest first
  const events = await Event.find(match)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  // Resolve posts for any targetIds that are posts
  const targetIds = events.map((e: any) => e.targetId).filter(Boolean);
  const posts = targetIds.length
    ? await Post.find({ _id: { $in: targetIds } }).select("_id slug title").lean()
    : [];
  const postById = new Map(posts.map((p: any) => [String(p._id), p]));

  const items = events.map((e: any) => {
    const createdAt = e.createdAt instanceof Date ? e.createdAt : new Date(e.createdAt);
    const base = {
      id: String(e._id),
      type: e.type as string,
      createdAt: createdAt.toISOString(),
    };

    // Try resolve to a post href/title
    const p = e.targetId ? postById.get(String(e.targetId)) : null;
    if (p) {
      return {
        ...base,
        href: `/news/${p.slug}`,
        title: p.title,
        summary:
          e.type === "article_published"
            ? "New story published"
            : e.type === "thread_hot"
            ? "Trending story update"
            : e.redactedText || "",
      };
    }

    // Fallback: non-post event or unresolved target
    return {
      ...base,
      href: null as string | null,
      title:
        e.type === "follow"
          ? "New follow activity"
          : e.type === "like"
          ? "Someone liked a story you follow"
          : "Update",
      summary: e.redactedText || "",
    };
  });

  // Small CDN-friendly cache
  res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
  res.json({ items });
}
