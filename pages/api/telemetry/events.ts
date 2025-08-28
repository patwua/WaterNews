import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/server/db";
import SessionEvent from "@/models/SessionEvent";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") { res.status(405).end(); return; }
  try {
    await dbConnect();
    const { sessionId, type, value } = (req.body || {}) as any;
    if (!sessionId || !type) { res.status(400).json({ ok: false }); return; }
    await SessionEvent.create({ sessionId, type, value, createdAt: new Date() });
    res.setHeader("Cache-Control", "no-store");
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false });
  }
}
