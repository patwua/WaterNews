import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { isAdminEmail, isAdminUser } from "@/lib/admin-auth";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ ok: false, error: "Method not allowed" });
  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email || null;
  const ok = (await isAdminEmail(email)) || (await isAdminUser(email));
  if (!ok) return res.status(401).json({ ok: false, error: "Unauthorized" });
  const db = await getDb();
  if (!db) return res.status(200).json({ ok: true, items: [] });
  const items = await db.collection("tickets").find().sort({ createdAt: -1 }).limit(100).toArray();
  return res.status(200).json({ ok: true, items });
}
