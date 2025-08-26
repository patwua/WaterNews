import type { NextApiRequest, NextApiResponse } from "next";

export const config = { api: { bodyParser: { sizeLimit: "10mb" } } };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();
  if (!process.env.CLOUDINARY_URL)
    return res.status(503).json({ error: "Media service unavailable" });

  let cloudinary: typeof import("cloudinary").v2;
  try {
    const mod = await import("cloudinary");
    cloudinary = mod.v2;
    await import("@/lib/cloudinary");
  } catch {
    return res.status(503).json({ error: "Media service unavailable" });
  }

  try {
    const { dataUrl, folder = "waternewsgy/uploads" } = req.body || {};
    if (!dataUrl || typeof dataUrl !== "string")
      return res.status(400).json({ error: "Missing dataUrl" });
    const r = await cloudinary.uploader.upload(dataUrl, {
      folder,
      resource_type: "image",
      transformation: [{ width: 1600, crop: "limit" }],
    });
    return res.json({ ok: true, url: r.secure_url || r.url, asset: r });
  } catch {
    return res.status(500).json({ error: "Upload failed" });
  }
}

