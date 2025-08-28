import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { isAdminEmail, isAdminUser } from "@/lib/admin-auth";
import { dbConnect } from "@/lib/server/db";
import Section from "@/models/Section";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email || null;
  const admin = email && ((await isAdminEmail(email)) || (await isAdminUser(email)));
  if (!admin) return res.status(401).json({ error: "Unauthorized" });

  await dbConnect();

  if (req.method === "GET") {
    const docs = await Section.find().lean();
    const map: Record<string, boolean> = {};
    for (const d of docs) map[d.id] = !!d.enabled;
    return res.json({ ok: true, sections: docs, map });
  }

  if (req.method === "PUT") {
    const { id, enabled, context } = req.body || {};
    if (!id) return res.status(400).json({ error: "id required" });
    const update: any = { enabled: !!enabled };
    if (context !== undefined) update.context = context;
    const section = await Section.findOneAndUpdate(
      { id },
      { $set: update },
      { upsert: true, new: true }
    ).lean();
    return res.json({ ok: true, section });
  }

  return res.status(405).end();
}
