import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/server/db";
import Event from "@/models/Event";

/**
 * GET /api/moderation/notes
 * Query:
 *  - q: string (search in redactedText)
 *  - targetId: string
 *  - actorId: string
 *  - from: ISO date (inclusive)
 *  - to:   ISO date (exclusive)
 *  - page: number (1-based)
 *  - limit: number (default 20, max 100)
 *
 * Returns: { rows, page, pages, total }
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  await dbConnect();

  const {
    q = "",
    targetId = "",
    actorId = "",
    from = "",
    to = "",
    page = "1",
    limit = "20",
    status = "",
    assignedTo = "",
  } = req.query as Record<string, string>;

  const p = Math.max(1, parseInt(page || "1", 10) || 1);
  const lim = Math.max(1, Math.min(100, parseInt(limit || "20", 10) || 20));

  const find: any = { type: "moderation_note", visibility: "internal" };

  if (q.trim()) {
    find.redactedText = { $regex: q.trim(), $options: "i" };
  }
  if (targetId.trim()) {
    find.targetId = targetId.trim();
  }
  if (actorId.trim()) {
    find.actorId = actorId.trim();
  }
  if (status.trim()) find.status = status.trim();
  if (assignedTo.trim()) find.assignedTo = assignedTo.trim();
  if (from || to) {
    find.createdAt = {};
    if (from) find.createdAt.$gte = new Date(from);
    if (to) find.createdAt.$lt = new Date(to);
  }

  const total = await Event.countDocuments(find);
  const rows = await Event.find(find)
    .sort({ createdAt: -1 })
    .skip((p - 1) * lim)
    .limit(lim)
    .lean();

  const pages = Math.max(1, Math.ceil(total / lim));
  return res.json({ rows, page: p, pages, total });
}
