import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/server/db";
import Post from "@/models/Post";
import SessionEvent from "@/models/SessionEvent";

const DEFAULTS = [
  { label: "Sports", href: "/?cat=sports" },
  { label: "Business", href: "/?cat=business" },
  { label: "Politics", href: "/?cat=politics" },
  { label: "Tech", href: "/?cat=tech" },
  { label: "Weather", href: "/?cat=weather" },
  { label: "Health", href: "/?cat=health" },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") { res.status(405).end(); return; }
  try {
    await dbConnect();

    const sessionId = String((req.query as any).sessionId || (req as any).cookies?.sessionId || "");
    const extras: { label: string; href: string }[] = [];

    // Very light heuristic: popular tags from recent posts
    const popular = await Post.find({}, { tags: 1 }).sort({ publishedAt: -1 }).limit(100).lean();
    const counts = new Map<string, number>();
    for (const p of popular) {
      (p.tags || []).forEach((t: string) => {
        const key = (t || "").toLowerCase();
        if (!key) return;
        counts.set(key, (counts.get(key) || 0) + 1);
      });
    }
    const sortedTags = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([t]) => t);

    // Personalization: session’s recent category views
    if (sessionId) {
      const recent = await SessionEvent.find({ sessionId, type: "view_category" })
        .sort({ createdAt: -1 }).limit(20).lean();
      for (const ev of recent) {
        const t = String(ev.value || "").toLowerCase();
        if (t && !sortedTags.includes(t)) sortedTags.unshift(t);
      }
    }

    for (const t of sortedTags) {
      const label = t.charAt(0).toUpperCase() + t.slice(1);
      extras.push({ label, href: `/?cat=${encodeURIComponent(t)}` });
      if (extras.length >= 10) break;
    }

    // Merge defaults (fixed order) + extras (dedup by label)
    const seen = new Set(DEFAULTS.map(d => d.label.toLowerCase()));
    const merged = [...DEFAULTS];
    for (const e of extras) {
      const k = e.label.toLowerCase();
      if (!seen.has(k)) { seen.add(k); merged.push(e); }
    }

    res.setHeader("Cache-Control", "max-age=60, stale-while-revalidate=300");
    res.status(200).json(merged);
  } catch {
    // Fallback: defaults only
    res.setHeader("Cache-Control", "max-age=60, stale-while-revalidate=300");
    res.status(200).json(DEFAULTS);
  }
}
