import type { NextApiRequest, NextApiResponse } from "next";

let cloudinary: typeof import("cloudinary").v2 | null = null;

async function getCloudinary() {
  if (cloudinary) return cloudinary;
  try {
    const mod = await import("cloudinary");
    cloudinary = mod.v2;
    await import("@/lib/cloudinary");
    return cloudinary;
  } catch {
    cloudinary = null;
    return null;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const c = await getCloudinary();
  if (!c || !process.env.CLOUDINARY_URL) {
    res.status(503).json({ error: "Media service unavailable" });
    return;
  }
  const { q, nextCursor } = req.query;
  const search = typeof q === "string" && q ? `filename:${q} OR tags:${q}` : "";
  const result = await c.search
    .expression(search || "folder=waternews/*")
    .max_results(50)
    .next_cursor(typeof nextCursor === "string" ? nextCursor : undefined)
    .execute();
  res.json({ resources: result.resources, nextCursor: result.next_cursor || null });
}

