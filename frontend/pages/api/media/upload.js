// Simple Cloudinary upload endpoint that accepts a Data URL or remote URL.
// This is used by drag-drop in the editor. It avoids multipart parsing.
export const config = { api: { bodyParser: { sizeLimit: '20mb' } } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  // Guard Cloudinary at runtime (no types required)
  let cloudinary;
  try { cloudinary = require('cloudinary').v2; } catch { return res.status(503).json({ error: 'Cloudinary unavailable' }); }
  try {
    if (!process.env.CLOUDINARY_URL) return res.status(503).json({ error: 'Cloudinary not configured' });
    const { dataUrl, folder = 'waternews' } = req.body || {};
    if (!dataUrl || typeof dataUrl !== 'string') return res.status(400).json({ error: 'dataUrl required' });
    const r = await cloudinary.uploader.upload(dataUrl, { folder });
    return res.json({ ok: true, asset: r });
  } catch (e) {
    return res.status(500).json({ error: 'Upload failed' });
  }
}
