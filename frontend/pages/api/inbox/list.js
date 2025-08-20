import { getDb } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ ok: false, error: "Method not allowed" });
  const db = await getDb();
  if (!db) return res.status(200).json({ ok: true, items: [] });
  const items = await db.collection("tickets").find().sort({ createdAt: -1 }).limit(100).toArray();
  return res.status(200).json({ ok: true, items });
}
