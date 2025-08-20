import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import { sendEmail } from "@/lib/email";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  try {
    const db = await getDb();
    if (!db) return res.status(200).json({ ok: true, id: null }); // noop

    const {
      title = "Untitled Draft",
      body = "",
      ticketId = null,
      assignedTo = null, // { email, name }
      reviewers = [],     // [{ email, name }]
      secondReviewRequired = false
    } = req.body || {};

    const now = new Date();
    const doc = {
      title: String(title),
      body: String(body),
      ticketId: ticketId ? new ObjectId(String(ticketId)) : null,
      status: "draft",
      scheduledAt: null,
      assignedTo: assignedTo || null,
      reviewers: Array.isArray(reviewers) ? reviewers : [],
      secondReviewRequired: !!secondReviewRequired,
      media: [],
      createdAt: now,
      updatedAt: now,
      history: [{ at: now, by: null, action: "created", meta: { ticketId } }]
    };

    const r = await db.collection("drafts").insertOne(doc);

    // Notify assignee (optional)
    if (assignedTo?.email) {
      await sendEmail({
        to: assignedTo.email,
        subject: `New Draft Assigned: ${doc.title}`,
        text: `A draft has been assigned to you.\n\nTitle: ${doc.title}`
      });
    }

    // Optionally link back to the ticket with draftId
    if (doc.ticketId) {
      await db.collection("tickets").updateOne(
        { _id: doc.ticketId },
        { $set: { draftId: r.insertedId }, $push: { history: { at: now, by: null, action: "draft-created", meta: { draftId: r.insertedId } } } }
      );
    }

    return res.status(200).json({ ok: true, id: r.insertedId });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
