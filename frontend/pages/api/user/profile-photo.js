// Next.js API route: multipart upload -> square crop -> Cloudinary -> URL
import formidable from "formidable";
import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";

// Disable Next’s default body parser for multipart
export const config = { api: { bodyParser: false } };

cloudinary.config({ // CLOUDINARY_URL already supported (env)
  secure: true,
});

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
const ACCEPT = new Set(["image/jpeg", "image/png", "image/webp"]);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const form = formidable({ multiples: false, maxFileSize: MAX_BYTES });
  form.parse(req, async (err, fields, files) => {
    try {
      if (err) return res.status(400).json({ error: "Upload error", details: String(err) });
      const f = files.file;
      if (!f) return res.status(400).json({ error: "No file uploaded (field name: file)" });
      if (!ACCEPT.has(f.mimetype)) return res.status(400).json({ error: "Invalid type (JPG/PNG/WebP only)" });
      if (f.size > MAX_BYTES) return res.status(400).json({ error: "File too large (≤2 MB)" });

      // Auto-crop center square, upscale min 512, output WebP
      const square = await sharp(f.filepath)
        .rotate() // respect EXIF
        .resize({ width: 1024, height: 1024, fit: "cover", position: "attention" })
        .webp({ quality: 88 })
        .toBuffer();

      // Upload to Cloudinary
      const uploaded = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "waternewsgy/profile_photos",
            resource_type: "image",
            overwrite: true,
            eager: [{ width: 512, height: 512, crop: "fill", format: "webp" }],
          },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(square);
      });

      // Return the 512 eager variant if present, else secure_url
      const eager512 = (uploaded.eager || []).find(e => /\/c_fill.*\/w_512,h_512\//.test(e.secure_url));
      const url = eager512?.secure_url || uploaded.secure_url;

      return res.status(200).json({ ok: true, url });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Unexpected error" });
    }
  });
}
