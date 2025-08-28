import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/server/db";
import Event from "@/models/Event";
import Audit from "@/models/Audit";

/**
 * PATCH /api/moderation/queue/[id]
 * Body: { action: "assign"|"release"|"flag_second"|"resolve"|"reopen", assignee?: string, actorId?: string }
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") return res.status(405).json({ error: "Method not allowed" });
  await dbConnect();

  const { id } = req.query as { id: string };
  const { action, assignee, actorId } = req.body || {};
  if (!id || !action) return res.status(400).json({ error: "id and action required" });

  const doc = await Event.findById(id);
  if (!doc || doc.visibility !== "internal") {
    return res.status(404).json({ error: "Item not found" });
  }

  const prev = { status: doc.status, assignedTo: doc.assignedTo ?? null, secondReview: !!doc.secondReview };

  switch (action) {
    case "assign":
      doc.assignedTo = String(assignee || "");
      doc.status = "in_review";
      break;
    case "release":
      doc.assignedTo = null;
      doc.status = "open";
      break;
    case "flag_second":
      doc.secondReview = true;
      doc.status = "flagged";
      break;
    case "resolve":
      doc.status = "resolved";
      break;
    case "reopen":
      doc.status = "open";
      doc.secondReview = false;
      break;
    default:
      return res.status(400).json({ error: "Unknown action" });
  }

  await doc.save();

  const next = { status: doc.status, assignedTo: doc.assignedTo ?? null, secondReview: !!doc.secondReview };

  await Audit.create({
    action,
    actorId: actorId || null,
    targetKind: "event",
    targetId: String(doc._id),
    prev,
    next,
    meta: { type: doc.type },
  });

  // ---- Targeted realtime emits (assignee + author) and unread count
  try {
    // @ts-ignore
    const io = (res.socket as any)?.server?.io;
    if (io) {
      const assigneeId =
        (doc as any)?.assigneeId ||
        (doc as any)?.assignee?.id ||
        (doc as any)?.assignedTo ||
        null;
      const authorId =
        (doc as any)?.authorId ||
        (doc as any)?.author?.id ||
        null;
      const title =
        (doc as any)?.title ||
        (doc as any)?.slug ||
        `Item ${id}`;
      const payload = {
        id: `${id}:${Date.now()}`,
        type: action || "update",
        itemId: String(id),
        title,
        createdAt: new Date().toISOString(),
      };
      if (assigneeId) {
        io.to(`user:${assigneeId}`).emit("notification:new", payload);
        await dbConnect();
        const openCount = await Event.countDocuments({
          assignedTo: assigneeId,
          status: { $in: ["open", "in_review", "flagged"] },
        });
        io.to(`user:${assigneeId}`).emit("notification:count", {
          count: openCount,
        });
      }
      if (authorId) {
        io
          .to(`user:${authorId}`)
          .emit("notification:new", { ...payload, type: `${action || "update"}:author` });
      }
    }
  } catch {}

  return res.json({ ok: true, item: doc.toObject() });
}
