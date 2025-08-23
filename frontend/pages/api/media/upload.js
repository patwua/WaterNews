// Simple Cloudinary upload endpoint that accepts a Data URL or remote URL.
// This is used by drag-drop in the editor. It avoids multipart parsing.
export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!process.env.CLOUDINARY_URL) return res.status(503).json({ error: 'Media service unavailable' });

  // Dynamically require the SDK so missing installs don't crash the build
  let cloudinary;
  try {
    cloudinary = require('cloudinary').v2;
  } catch {
    return res.status(503).json({ error: 'Media service unavailable' });
  }

  try {
    const { dataUrl, folder = 'waternewsgy/uploads' } = req.body || {};
    if (!dataUrl) return res.status(400).json({ error: 'Missing dataUrl' });
    const r = await cloudinary.uploader.upload(dataUrl, {
      folder,
      resource_type: 'image',
      transformation: [{ width: 1600, crop: 'limit' }],
    });
    return res.json({ ok: true, url: r.secure_url || r.url, asset: r });
  } catch (e) {
    return res.status(500).json({ error: 'Upload failed' });
  }
}
