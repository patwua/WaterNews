// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = await getDb();
    if (!db) return res.status(200).json({ item: null });
    const id = String(req.query.id || "");
    const item = await db.collection("drafts").findOne({ _id: new ObjectId(id) });
    return res.status(200).json({ item });
  } catch (e) {
    console.error(e);
    return res.status(200).json({ item: null });
  }
}
