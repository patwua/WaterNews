// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import { sendEmail } from "@/lib/email";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") return res.status(405).json({ ok: false });
  try {
    const db = await getDb();
    if (!db) return res.status(200).json({ ok: true });
    const { id, patch } = req.body || {};
    const _id = new ObjectId(String(id));
    const set = { updatedAt: new Date() };

    if ("title" in patch) set.title = String(patch.title);
    if ("body" in patch) set.body = String(patch.body);
    if ("status" in patch) set.status = String(patch.status);
    if ("scheduledAt" in patch) set.scheduledAt = patch.scheduledAt ? new Date(patch.scheduledAt) : null;
    if ("assignedTo" in patch) set.assignedTo = patch.assignedTo || null;
    if ("reviewers" in patch) set.reviewers = Array.isArray(patch.reviewers) ? patch.reviewers : [];
    if ("secondReviewRequired" in patch) set.secondReviewRequired = !!patch.secondReviewRequired;
    if ("media" in patch) set.media = Array.isArray(patch.media) ? patch.media : [];

    await db.collection("drafts").updateOne(
      { _id },
      { $set: set, $push: { history: { at: new Date(), by: null, action: "update", meta: patch } } }
    );

    // notify reviewers when moving to in-review
    if (patch.status === "in-review") {
      const doc = await db.collection("drafts").findOne({ _id });
      const emails = (doc.reviewers || []).map(r => r.email).filter(Boolean);
      if (emails.length) {
        await sendEmail({
          to: emails.join(","),
          subject: `Draft ready for review: ${doc.title}`,
          text: `A draft is ready for review.\n\nTitle: ${doc.title}`
        });
      }
    }

    // notify assignee on assign
    if (patch.assignedTo?.email) {
      await sendEmail({
        to: patch.assignedTo.email,
        subject: `Draft assigned to you`,
        text: `You have been assigned a draft.`
      });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(200).json({ ok: false });
  }
}
