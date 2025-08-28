import type { NextApiRequest, NextApiResponse } from "next";
import { topSimilarForText } from "@/lib/server/similarity";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { text, limit = 5 } = req.body as { text: string; limit?: number };
  if (!text || typeof text !== "string") return res.status(400).json({ error: "text is required" });
  try {
    const results = await topSimilarForText(text, limit);
    res.json({ results });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "similarity failed" });
  }
}

