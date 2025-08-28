import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/server/db";
import Audit from "@/models/Audit";

/**
 * GET /api/moderation/audit/[eventId]
 * Returns the chronological audit trail for the given event.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  await dbConnect();

  const { eventId } = req.query as { eventId: string };
  if (!eventId) return res.status(400).json({ error: "eventId required" });

  const rows = await Audit.find({ targetKind: "event", targetId: String(eventId) })
    .sort({ createdAt: 1 })
    .lean();

  return res.json({ rows });
}

