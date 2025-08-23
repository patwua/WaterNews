// Session-aware profile photo upload (no sharp/formidable).
// Accepts JSON: { dataUrl?: string, url?: string }
// Uploads to Cloudinary (if dataUrl present) then saves nothing here —
// caller then POSTs /api/users/update with { profilePhotoUrl }.
export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const session = await getServerSession(req, res, authOptions);
  const who = session?.user?.email || null;
  if (!who) return res.status(401).json({ error: 'Unauthorized' });

  const { dataUrl, url } = req.body || {};
  // Guarded require (optional dependency)
  let cloudinary; try { cloudinary = require('cloudinary').v2; } catch { cloudinary = null; }

  let finalUrl = url || null;
  if (!finalUrl && dataUrl) {
    if (!cloudinary || !process.env.CLOUDINARY_URL) {
      return res.status(503).json({ error: 'Media service unavailable' });
    }
    try {
      const r = await cloudinary.uploader.upload(dataUrl, {
        folder: 'waternewsgy/profile_photos',
        resource_type: 'image',
        overwrite: true,
        transformation: [{ width: 512, height: 512, crop: 'fill' }],
      });
      finalUrl = r.secure_url || r.url;
    } catch (e) {
      return res.status(500).json({ error: 'Upload failed' });
    }
  }

  if (!finalUrl) return res.status(400).json({ error: 'Provide dataUrl or url' });
  return res.json({ ok: true, avatarUrl: finalUrl, profilePhotoUrl: finalUrl });
}
