// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { isAdminEmail, isAdminUser } from "@/lib/admin-auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email || null;
  const ok = (await isAdminEmail(email)) || (await isAdminUser(email));
  if (!ok) return res.status(401).json({ ok: false });
  try {
    const db = await getDb();
    if (!db) return res.status(200).json({ ok: true, id: null });
    const { ticketId } = req.body || {};
    const t = await db.collection("tickets").findOne({ _id: new ObjectId(String(ticketId)) });
    if (!t) return res.status(404).json({ ok: false, error: "Ticket not found" });

    const now = new Date();
    const draft = {
      title: `[From Ticket] ${t.subject} • ${t.name || "Anonymous"}`,
      body: t.body || "",
      ticketId: t._id,
      status: "draft",
      scheduledAt: null,
      assignedTo: null,
      reviewers: [],
      secondReviewRequired: false,
      media: t.attachments || [],
      createdAt: now,
      updatedAt: now,
      history: [{ at: now, by: null, action: "created-from-ticket", meta: { ticketId: t._id } }]
    };
    const r = await db.collection("drafts").insertOne(draft);
    await db.collection("tickets").updateOne(
      { _id: t._id },
      { $set: { draftId: r.insertedId }, $push: { history: { at: now, by: null, action: "linked-to-draft", meta: { draftId: r.insertedId } } } }
    );
    return res.status(200).json({ ok: true, id: r.insertedId });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false });
  }
}
