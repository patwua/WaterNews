// Session-aware profile photo upload (no sharp/formidable).
// Accepts JSON: { dataUrl?: string, url?: string }
// Uploads to Cloudinary (if dataUrl present) then saves nothing here —
// caller then POSTs /api/users/update with { profilePhotoUrl }.
export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import type { NextApiRequest, NextApiResponse } from 'next';

let cloudinary: typeof import('cloudinary').v2 | null = null;

async function getCloudinary() {
  if (cloudinary) return cloudinary;
  try {
    const mod = await import('cloudinary');
    cloudinary = mod.v2;
    await import('@/lib/cloudinary');
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
  if (req.method !== 'POST') return res.status(405).end();
  const session = await getServerSession(req, res, authOptions);
  const who = session?.user?.email || null;
  if (!who) return res.status(401).json({ error: 'Unauthorized' });

  const { dataUrl, url } = req.body || {};
  let finalUrl = (url as string) || null;
  if (!finalUrl && dataUrl) {
    const c = await getCloudinary();
    if (!c || !process.env.CLOUDINARY_URL) {
      return res.status(503).json({ error: 'Media service unavailable' });
    }
    try {
      const r = await c.uploader.upload(dataUrl, {
        folder: 'waternewsgy/profile_photos',
        resource_type: 'image',
        overwrite: true,
        transformation: [{ width: 512, height: 512, crop: 'fill' }],
      });
      finalUrl = r.secure_url || r.url;
    } catch {
      return res.status(500).json({ error: 'Upload failed' });
    }
  }

  if (!finalUrl) return res.status(400).json({ error: 'Provide dataUrl or url' });
  return res.json({ ok: true, avatarUrl: finalUrl, profilePhotoUrl: finalUrl });
}

