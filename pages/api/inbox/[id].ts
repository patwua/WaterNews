// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { isAdminEmail, isAdminUser } from "@/lib/admin-auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email || null;
  const ok = (await isAdminEmail(email)) || (await isAdminUser(email));
  if (!ok) return res.status(401).json({ ok: false, error: "Unauthorized" });
  const { id } = req.query;
  if (!id) return res.status(400).json({ ok: false, error: "Missing id" });
  const db = await getDb();
  if (!db) return res.status(404).json({ ok: false, error: "Not found" });

  if (req.method === "PATCH") {
    const { status, queue, roleTarget, assignedTo } = req.body || {};
    const set = {};
    if (status) set.status = status;
    if (queue) set.queue = queue;
    if (roleTarget) set.roleTarget = roleTarget;
    if (assignedTo) set.assignedTo = assignedTo;
    set.updatedAt = new Date();
    await db.collection("tickets").updateOne({ _id: new ObjectId(String(id)) }, { $set: set });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ ok: false, error: "Method not allowed" });
}
