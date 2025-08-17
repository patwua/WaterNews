import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/server/db";
import Event from "@/models/Event";
import Post from "@/models/Post";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  await dbConnect();
  // Pagination params
  const limit = Math.min(
    Math.max(parseInt(String(req.query.limit || "20"), 10) || 20, 5),
    50
  );
  const cursor = String(req.query.cursor || "");
  const before = cursor ? new Date(cursor) : undefined;

  const find: any = { visibility: { $in: ["public", "reader"] } };
  if (!isNaN(before?.getTime?.() || NaN)) find.createdAt = { $lt: before };

  const events = await Event.find(find)
    .sort({ createdAt: -1 })
    .limit(limit + 1) // fetch one extra to know if there's a next page
    .lean();

  // Resolve any post slugs referenced by events (lightweight join)
  const postIds = events.map((e: any) => e.targetId).filter(Boolean);
  const posts = await Post.find({ _id: { $in: postIds } })
    .select("_id slug title tags")
    .lean();
  const postMap = new Map(posts.map((p: any) => [String(p._id), p]));

  const items = events.slice(0, limit).map((e: any) => {
    const p = postMap.get(String(e.targetId));
    return {
      id: String(e._id),
      type: e.type,
      createdAt: e.createdAt,
      title: p?.title || e.title || "Update",
      slug: p?.slug || e.slug || "",
      tags: p?.tags || e.tags || [],
    };
  });

  const nextCursor = events.length > limit ? events[limit].createdAt.toISOString() : null;

  res.setHeader("Cache-Control", "private, max-age=30"); // short client cache
  return res.status(200).json({ items, nextCursor });
}
