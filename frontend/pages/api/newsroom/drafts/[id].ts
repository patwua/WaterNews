import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/server/db";
import Draft from "@/models/Draft";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { id } = req.query as { id: string };

  if (req.method === "GET") {
    const doc = await Draft.findById(id).lean();
    if (!doc) return res.status(404).json({ error: "Not found" });
    return res.json({ draft: doc });
  }

  if (req.method === "PUT") {
    const payload = req.body || {};
    const doc = await Draft.findByIdAndUpdate(id, payload, { new: true });
    if (!doc) return res.status(404).json({ error: "Not found" });
    return res.json({ ok: true, draft: doc });
  }

  if (req.method === "DELETE") {
    await Draft.findByIdAndDelete(id);
    return res.json({ ok: true });
  }

  // Simple publish stub (promote to "published")
  if (req.method === "POST") {
    const action = (req.query as any).action;
    if (action === "publish") {
      const doc = await Draft.findByIdAndUpdate(id, { status: "published", scheduledFor: null }, { new: true });
      if (!doc) return res.status(404).json({ error: "Not found" });
      // TODO: create a Post document / trigger feed reindex
      return res.json({ ok: true, draft: doc });
    }
    return res.status(400).json({ error: "Unknown action" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
