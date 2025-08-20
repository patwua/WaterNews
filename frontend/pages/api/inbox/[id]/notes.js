import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { isAdminEmail, isAdminUser } from "@/lib/admin-auth";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email || null;
  const ok = (await isAdminEmail(email)) || (await isAdminUser(email));
  if (!ok) return res.status(401).json({ ok: false, error: "Unauthorized" });
  const { id } = req.query;
  if (!id) return res.status(400).json({ ok: false, error: "Missing id" });
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });
  const { note, by = null } = req.body || {};
  if (!note) return res.status(400).json({ ok: false, error: "Note required" });
  const db = await getDb();
  if (!db) return res.status(404).json({ ok: false, error: "Not found" });
  const entry = { note: String(note), by, at: new Date() };
  await db.collection("tickets").updateOne({ _id: new ObjectId(String(id)) }, { $push: { notes: entry } });
  return res.status(200).json({ ok: true });
}
