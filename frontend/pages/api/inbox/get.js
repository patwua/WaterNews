import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ ok: false, error: "Method not allowed" });
  const { id } = req.query;
  if (!id) return res.status(400).json({ ok: false, error: "Missing id" });
  const db = await getDb();
  if (!db) return res.status(404).json({ ok: false, error: "Not found" });
  const ticket = await db.collection("tickets").findOne({ _id: new ObjectId(String(id)) });
  if (!ticket) return res.status(404).json({ ok: false, error: "Not found" });
  return res.status(200).json({ ok: true, ticket });
}
