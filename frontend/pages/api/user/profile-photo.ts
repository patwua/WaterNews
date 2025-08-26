// Upload a profile photo using JSON { dataUrl } and Cloudinary transformations only.
// No native deps, no multipart. Safe in restricted environments.
export const config = { api: { bodyParser: { sizeLimit: "5mb" } } };

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });
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
    const { dataUrl, isOrganization = false } = req.body || {};
    if (!dataUrl || typeof dataUrl !== "string" || !/^data:image\//.test(dataUrl)) {
      return res
        .status(400)
        .json({ error: "Expected JSON body with { dataUrl }" });
    }
    // Transform: center-crop square to 1024, then provide a 512 eager variant
    const uploaded = await cloudinary.uploader.upload(dataUrl, {
      folder: "waternewsgy/profile_photos",
      resource_type: "image",
      overwrite: true,
      transformation: [{ width: 1024, height: 1024, crop: "fill", gravity: "auto" }],
      eager: [
        {
          width: 512,
          height: 512,
          crop: "fill",
          gravity: "auto",
          fetch_format: "auto",
          quality: "auto",
        },
      ],
    });
    const eager512 = (uploaded.eager || [])[0]?.secure_url;
    const url = eager512 || uploaded.secure_url || uploaded.url;
    return res.status(200).json({ ok: true, url, isOrganization: !!isOrganization });
  } catch {
    return res.status(500).json({ error: "Upload failed" });
  }
}

