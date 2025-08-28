import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/server/db";
import Event from "@/models/Event";

/**
 * GET /api/moderation/queue
 * Query:
 *  - q: search in redactedText (optional)
 *  - type: filter by Event.type (optional; e.g., "moderation_note")
 *  - status: open|in_review|flagged|resolved (optional; defaults to non-resolved)
 *  - assignedTo: filter by assignee (optional)
 *  - page: 1-based (default 1)
 *  - limit: default 20, max 100
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  await dbConnect();

  const {
    q = "",
    type = "",
    status = "",
    assignedTo = "",
    page = "1",
    limit = "20",
  } = req.query as Record<string, string>;

  const p = Math.max(1, parseInt(page || "1", 10) || 1);
  const lim = Math.max(1, Math.min(100, parseInt(limit || "20", 10) || 20));

  const find: any = { visibility: "internal" };
  if (q.trim()) find.redactedText = { $regex: q.trim(), $options: "i" };
  if (type.trim()) find.type = type.trim();
  if (status.trim()) {
    find.status = status.trim();
  } else {
    // default to active (non-resolved) items
    find.status = { $in: ["open", "in_review", "flagged"] };
  }
  if (assignedTo.trim()) find.assignedTo = assignedTo.trim();

  const total = await Event.countDocuments(find);
  const rows = await Event.find(find)
    .sort({ updatedAt: -1 })
    .skip((p - 1) * lim)
    .limit(lim)
    .lean();

  return res.json({ rows, page: p, pages: Math.max(1, Math.ceil(total / lim)), total });
}
