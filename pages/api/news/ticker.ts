import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/server/db";
import Post from "@/models/Post";

/**
 * Returns a compact list of ticker items plus a banner mode:
 * - mode: "newswave" | "breaking"
 * - items: [{ slug, titleShort, summary }]
 *
 * Rules:
 * - If any "breaking" post exists in the recent window, mode = "breaking" and items focus on breaking first.
 * - Otherwise mode = "newswave" and items are latest/trending mix.
 * - Headlines are shortened; summary uses excerpt or top tags.
 * - HTTP caching with stale-while-revalidate for snappy global header renders.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).end();
    return;
  }

  try {
    await dbConnect();

    // Look back a reasonable window (e.g., 48h) for breaking items
    const since = new Date(Date.now() - 1000 * 60 * 60 * 48);

    const breakingCandidates = await Post.find(
      {
        publishedAt: { $gte: since },
        $or: [
          { isBreaking: true },
          { tags: { $in: ["breaking", "#breaking", "alert", "#alert"] } },
        ],
      },
      { slug: 1, title: 1, excerpt: 1, tags: 1, publishedAt: 1 }
    )
      .sort({ publishedAt: -1 })
      .limit(12)
      .lean();

    const hasBreaking = breakingCandidates.length > 0;

    // Fill with non-breaking latest/trending if needed
    let latest: any[] = [];
    if (!hasBreaking) {
      latest = await Post.find(
        {},
        { slug: 1, title: 1, excerpt: 1, tags: 1, engagementScore: 1, publishedAt: 1 }
      )
        .sort({ publishedAt: -1 })
        .limit(30)
        .lean();
    } else {
      // When in breaking mode, still include a few other items after the breaking block
      latest = await Post.find(
        {},
        { slug: 1, title: 1, excerpt: 1, tags: 1, engagementScore: 1, publishedAt: 1 }
      )
        .sort({ engagementScore: -1, publishedAt: -1 })
        .limit(30)
        .lean();
    }

    const shorten = (s: string, n = 80) => {
      if (!s) return "";
      s = String(s).trim();
      return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
    };

    const asItem = (p: any) => {
      const tags = (p.tags || [])
        .map((t: string) => String(t).replace(/^#/, ""))
        .slice(0, 3);
      const titleShort = shorten(p.title || "", 72);
      const summary = p.excerpt
        ? shorten(p.excerpt, 110)
        : tags.length
        ? tags.join(" • ")
        : "";
      return { slug: p.slug, titleShort, summary };
    };

    const items: { slug: string; titleShort: string; summary: string }[] = [];

    if (hasBreaking) {
      items.push(...breakingCandidates.map(asItem));
      // follow with a few latest/trending (dedupe by slug)
      const seen = new Set(items.map((i) => i.slug));
      for (const p of latest) {
        if (seen.has(p.slug)) continue;
        items.push(asItem(p));
        if (items.length >= 30) break;
      }
    } else {
      items.push(...latest.map(asItem).slice(0, 30));
    }

    res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    res.status(200).json({
      mode: hasBreaking ? "breaking" : "newswave",
      items,
    });
  } catch (e) {
    // Graceful fallback: empty list
    res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    res.status(200).json({ mode: "newswave", items: [] });
  }
}

