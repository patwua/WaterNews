// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { isAdminEmail, isAdminUser } from "@/lib/admin-auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ ok: false, error: "Method not allowed" });
  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email || null;
  const ok = (await isAdminEmail(email)) || (await isAdminUser(email));
  if (!ok) return res.status(401).json({ ok: false, error: "Unauthorized" });
  const { id } = req.query;
  if (!id) return res.status(400).json({ ok: false, error: "Missing id" });
  const db = await getDb();
  if (!db) return res.status(404).json({ ok: false, error: "Not found" });
  const ticket = await db.collection("tickets").findOne({ _id: new ObjectId(String(id)) });
  if (!ticket) return res.status(404).json({ ok: false, error: "Not found" });
  return res.status(200).json({ ok: true, ticket });
}
