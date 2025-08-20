import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/server/db";
import Event from "@/models/Event";
import Audit from "@/models/Audit";

/**
 * PATCH /api/moderation/queue/bulk
 * Body: { ids: string[], action: "assign"|"release"|"flag_second"|"resolve"|"reopen", assignee?: string, actorId?: string }
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") return res.status(405).json({ error: "Method not allowed" });
  await dbConnect();

  const { ids, action, assignee, actorId } = req.body || {};
  if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ error: "ids required" });
  if (!action) return res.status(400).json({ error: "action required" });

  const results: any[] = [];
  const updatedItems: any[] = [];
  for (const id of ids) {
    const doc = await Event.findById(id);
    if (!doc || doc.visibility !== "internal") {
      results.push({ id, ok: false, error: "not_found_or_not_internal" });
      continue;
    }

    const prev = { status: doc.status, assignedTo: doc.assignedTo ?? null, secondReview: !!doc.secondReview };

    switch (action) {
      case "assign":
        if (!assignee) { results.push({ id, ok: false, error: "assignee_required" }); continue; }
        doc.assignedTo = String(assignee);
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
        results.push({ id, ok: false, error: "unknown_action" });
        continue;
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
      meta: { type: doc.type, bulk: true },
    });
    results.push({ id, ok: true });
    updatedItems.push(doc.toObject());
  }

  // ---- Targeted realtime emits (assignee + author) and unread count
  try {
    // @ts-ignore
    const io = (res.socket as any)?.server?.io;
    if (io && Array.isArray(updatedItems)) {
      await dbConnect();
      for (const it of updatedItems) {
        const itemId = String((it as any)?.id ?? (it as any)?._id ?? "");
        const title =
          (it as any)?.title ||
          (it as any)?.slug ||
          `Item ${itemId}`;
        const assigneeId =
          (it as any)?.assigneeId ||
          (it as any)?.assignee?.id ||
          (it as any)?.assignedTo ||
          null;
        const authorId =
          (it as any)?.authorId ||
          (it as any)?.author?.id ||
          null;
        const payload = {
          id: `${itemId}:${Date.now()}`,
          type: action || "update",
          itemId,
          title,
          createdAt: new Date().toISOString(),
        };
        if (assigneeId) {
          io.to(`user:${assigneeId}`).emit("notification:new", payload);
          const openCount = await Event.countDocuments({
            assignedTo: assigneeId,
            status: { $in: ["open", "in_review", "flagged"] },
          });
          io
            .to(`user:${assigneeId}`)
            .emit("notification:count", { count: openCount });
        }
        if (authorId) {
          io
            .to(`user:${authorId}`)
            .emit("notification:new", { ...payload, type: `${action || "update"}:author` });
        }
      }
    }
  } catch {}

  return res.json({ ok: true, results });
}

