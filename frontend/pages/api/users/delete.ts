import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { confirm } = req.body || {};
    const email = (req as any).user?.email || (req.headers["x-user-email"] as string);
    if (!email) return res.status(401).json({ error: "Unauthorized" });
    if (confirm !== "DELETE") return res.status(400).json({ error: "Invalid confirmation" });

    const db = await getDb();
    const now = new Date();
    // Soft-delete: disable account, keep referential integrity
    const r = await db.collection("users").updateOne(
      { email: email.toLowerCase() },
      { $set: { disabled: true, deletedAt: now } }
    );
    return res.json({ ok: true, modified: r.modifiedCount });
  } catch (e) {
    return res.status(500).json({ error: "Unexpected error" });
  }
}
