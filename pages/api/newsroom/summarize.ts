import type { NextApiRequest, NextApiResponse } from "next";

function extractiveSummary(text: string, maxSentences = 3): string {
  const norm = (text || "").replace(/\s+/g, " ").trim();
  const parts = norm
    .split(/(?<=[.!?])\s+(?=[A-Z0-9“"('\[])/)
    .filter(Boolean);
  return parts.slice(0, Math.max(1, maxSentences)).join(" ");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { text } = req.body as { text: string };
  if (!text || typeof text !== "string") return res.status(400).json({ error: "text is required" });

  const hasAIKey = !!process.env.OPENAI_API_KEY;
  try {
    if (hasAIKey) {
      const summary = extractiveSummary(text, 4);
      return res.json({ summary });
    } else {
      const summary = extractiveSummary(text, 4);
      return res.json({ summary });
    }
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "summarization failed" });
  }
}
