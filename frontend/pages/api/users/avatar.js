import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getDb } from '@/lib/db';

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const session = await getServerSession(req, res, authOptions);
  const who = session?.user?.email || null;
  if (!who) return res.status(401).json({ error: 'Unauthorized' });
  const { dataUrl, url } = req.body || {};
  let cloudinary; try { cloudinary = require('cloudinary').v2; } catch { cloudinary = null; }
  let finalUrl = url || null;
  if (!finalUrl && dataUrl && cloudinary && process.env.CLOUDINARY_URL) {
    try {
      const r = await cloudinary.uploader.upload(dataUrl, { folder: 'avatars' });
      finalUrl = r.secure_url || r.url;
    } catch (e) {
      return res.status(500).json({ error: 'Avatar upload failed' });
    }
  }
  if (!finalUrl) return res.status(400).json({ error: 'Provide dataUrl or url' });
  const db = await getDb();
  await db.collection('users').updateOne(
    { email: who },
    { $set: { avatarUrl: finalUrl, updatedAt: new Date().toISOString() } },
    { upsert: true }
  );
  res.json({ ok: true, avatarUrl: finalUrl });
}

