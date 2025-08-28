import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/server/db";
import Draft from "@/models/Draft";
import { slugify } from "@/lib/slugify";
import { stableHash } from "@/lib/server/redact";

/**
 * POST /api/newsroom/thread-to-draft
 * Body: {
 *   title: string,
 *   summary?: string,
 *   body?: string,
 *   tags?: string[],
 *   type?: "news"|"vip"|"post"|"ads",
 *   threadId: string,
 *   threadTitle?: string,
 *   sources?: { refId: string, label?: string }[]
 * }
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  await dbConnect();

  const { title, summary = "", body = "", tags = [], type = "news", threadId, threadTitle = "", sources = [] } = req.body || {};
  if (!title || !threadId) return res.status(400).json({ error: "title and threadId required" });

  const slug = slugify(title);
  const src = [
    { kind: "thread", refId: String(threadId), hash: stableHash(String(threadTitle || threadId)), label: threadTitle || "Thread" },
    ...((Array.isArray(sources) ? sources : []).map((s: any) => ({
      kind: "external" as const,
      refId: String(s.refId || ""),
      hash: stableHash(String(s.refId || "")),
      label: s.label || "",
    }))),
  ];

  const draft = await Draft.findOneAndUpdate(
    { slug },
    { title, slug, summary, body, tags, type, status: "draft", sources: src },
    { upsert: true, new: true }
  );

  return res.json({ ok: true, id: String(draft._id), slug: draft.slug });
}
