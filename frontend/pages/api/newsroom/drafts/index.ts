import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/server/db";
import Draft from "@/models/Draft";
import { slugify } from "@/lib/slugify";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === "GET") {
    const { q, status = "draft" } = req.query as { q?: string; status?: string };
    const find: any = {};
    if (status) find.status = status;
    if (q) find.title = { $regex: q, $options: "i" };
    const rows = await Draft.find(find).sort({ updatedAt: -1 }).limit(200).lean();
    return res.json({ rows });
  }

  if (req.method === "POST") {
    const { id, title, summary, body, coverImage, tags = [], type, status, scheduledFor } = req.body || {};
    if (!title) return res.status(400).json({ error: "title required" });

    const slug = slugify(title);
    const payload = {
      title,
      slug,
      summary: summary || "",
      body: body || "",
      coverImage: coverImage || "",
      tags: Array.isArray(tags) ? tags : [],
      type: type || "news",
      status: status || "draft",
      scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
    };

    const doc = id
      ? await Draft.findByIdAndUpdate(id, payload, { new: true, upsert: false })
      : await new Draft(payload).save();

    return res.json({ ok: true, draft: doc });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
