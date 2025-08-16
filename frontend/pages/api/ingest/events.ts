import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/server/db";
import Event from "@/models/Event";
import { redact, stableHash } from "@/lib/server/redact";

/**
 * POST /api/ingest/events
 * Body: {
 *   type: "article_published"|"thread_hot"|"follow"|"like"|"moderation_note",
 *   actorId?: string, targetId?: string,
 *   text?: string, tags?: string[], category?: string|null,
 *   visibility?: "public"|"internal"
 * }
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  await dbConnect();

  const { type, actorId, targetId, text = "", tags = [], category = null, visibility = "public" } = req.body || {};
  if (!type) return res.status(400).json({ error: "type required" });

  const redactedText = redact(String(text || ""));
  const rawTextHash = text ? stableHash(String(text)) : "";

  const doc = await Event.create({
    type,
    actorId: actorId || null,
    targetId: targetId || null,
    visibility,
    redactedText,
    rawTextHash,
    tags: Array.isArray(tags) ? tags : [],
    category: category || null,
    ...(type === "moderation_note" ? { status: "open", secondReview: false } : {}),
  });

  return res.json({ ok: true, id: String(doc._id) });
}
