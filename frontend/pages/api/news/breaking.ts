import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/server/db";
import { getBreaking } from "@/lib/server/queries";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  await dbConnect();

  const limit = Math.max(1, Math.min(20, parseInt(String(req.query.limit || "10"), 10) || 10));
  const items = await getBreaking(limit);

  // Small cache to help the homepage
  res.setHeader("Cache-Control", "s-maxage=20, stale-while-revalidate=20");
  res.json({
    items: items.map((p) => ({
      slug: p.slug,
      title: p.title,
      tags: Array.isArray(p.tags) ? p.tags : [],
      isBreaking:
        !!p.isBreaking ||
        (Array.isArray(p.tags) &&
          p.tags.some((t) => ["breaking", "#breaking", "alert", "#alert"].includes(String(t).toLowerCase()))),
    })),
  });
}

