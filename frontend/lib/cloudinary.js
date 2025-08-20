import { v2 as cloudinary } from "cloudinary";

const url = process.env.CLOUDINARY_URL; // preferred single var
if (url) {
  cloudinary.config({ secure: true }); // CLOUDINARY_URL auto-parsed
} else {
  // fallback if you use separate vars (optional)
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export async function uploadLocalFile(filepath, folder = "waternews/uploads") {
  const res = await cloudinary.uploader.upload(filepath, {
    folder,
    resource_type: "auto",
    // eager transforms later if needed
  });
  return {
    url: res.secure_url,
    public_id: res.public_id,
    resource_type: res.resource_type,
    bytes: res.bytes,
    width: res.width,
    height: res.height,
    format: res.format,
  };
}

// NEW: list media for library
export async function listMedia({ prefix = "waternews", max_results = 40, next_cursor } = {}) {
  const res = await cloudinary.search
    .expression(`folder:${prefix}*`)
    .sort_by("created_at", "desc")
    .max_results(max_results)
    .next_cursor(next_cursor || undefined)
    .execute();
  return res; // { resources, next_cursor }
}
