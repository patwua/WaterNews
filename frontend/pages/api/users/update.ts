import { getDb } from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { displayName, handle, bio, prefs } = req.body || {};
    const db = await getDb();
    const email = (req as any).user?.email || (req.headers["x-user-email"] as string);
    if (!email) return res.status(401).json({ error: "Unauthorized" });

    const update: any = {};
    if (displayName) update.displayName = String(displayName).trim().slice(0, 120);
    if (handle) {
      update.handle = String(handle).toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 24);
      // ensure uniqueness (simple check)
      const exists = await db.collection("users").findOne({ handle: update.handle, email: { $ne: email.toLowerCase() } });
      if (exists) return res.status(409).json({ error: "Handle already taken" });
    }
    if (bio !== undefined) update.bio = String(bio).slice(0, 2000);
    if (prefs) update.prefs = prefs;

    const r = await db.collection("users").updateOne({ email: email.toLowerCase() }, { $set: update });
    return res.json({ ok: true, modified: r.modifiedCount });
  } catch (e) {
    return res.status(500).json({ error: "Unexpected error" });
  }
}
