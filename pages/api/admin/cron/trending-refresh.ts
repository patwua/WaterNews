import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { getDb } from '../../../../lib/server/db';
import { getTrendingOrder } from '../../../../lib/server/trending';
import { setTrendingCache } from '../../../../lib/server/trending-cache';

function isAdminEmail(email?: string | null) {
  if (!email) return false;
  const list = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}

/**
 * GET/POST /api/admin/cron/trending-refresh?hours=48&n=100
 * Recomputes trending cache and prewarms Cloudinary derived assets for top N slugs.
 * Hook a Render Cron to call this endpoint periodically.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow both: Admin-gated or token-based if provided as PATWUA_API_KEY
  const session = await getServerSession(req, res, authOptions);
  const isAdmin = !!session && isAdminEmail((session.user as any)?.email);
  const tokenOk =
    !!process.env.PATWUA_API_KEY && req.headers.authorization === `Bearer ${process.env.PATWUA_API_KEY}`;
  if (!isAdmin && !tokenOk) return res.status(401).json({ error: 'unauthorized' });

  const hours = Math.max(1, Math.min(168, parseInt(String(req.query.hours || '48'), 10) || 48));
  const n = Math.max(1, Math.min(200, parseInt(String(req.query.n || '100'), 10) || 100));
  const top = await getTrendingOrder({ hours, limit: n, skip: 0 });
  const slugs = top.map((t) => t.slug);
  await setTrendingCache(hours, slugs);

  // Optional: prewarm images/posters by pinging the overlay URLs and posters
  const db = await getDb();
  const Articles = db.collection('articles');
  const docs = await Articles.find(
    { status: 'published', slug: { $in: slugs } },
    { projection: { slug: 1, title: 1, mediaAssets: 1, coverImage: 1 } }
  ).toArray();

  const overlayUrls: string[] = [];
  const posterUrls: string[] = [];
  for (const a of docs) {
    const title = a.title || '';
    const assets =
      Array.isArray(a.mediaAssets) && a.mediaAssets.length
        ? a.mediaAssets
        : a.coverImage
        ? [{ type: 'image', url: a.coverImage }]
        : [];
    for (const m of assets) {
      if (m.type === 'image' && m.url) {
        if (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
          const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
          const encTitle = encodeURIComponent(title.replace(/\n/g, ' ').slice(0, 120)).replace(/%2C/g, '%252C');
          const encodedSrc = encodeURIComponent(m.url);
          const url = `https://res.cloudinary.com/${cloud}/image/fetch/c_fit,w_1440,h_2560,q_auto,f_auto/l_text:Arial_700_64:${encTitle},co_rgb:ffffff,stroke:2,co_rgb:000000,g_south,y_36/${encodedSrc}`;
          overlayUrls.push(url);
        }
      }
      if (m.type === 'video' && m.poster) {
        posterUrls.push(m.poster);
      }
    }
  }

  // Fire-and-forget HEAD requests to prewarm CDN (don’t block response)
  const ping = (url: string) => fetch(url, { method: 'HEAD' }).catch(() => null);
  overlayUrls.slice(0, 200).forEach(ping);
  posterUrls.slice(0, 200).forEach(ping);

  return res.status(200).json({ ok: true, hours, cached: slugs.length, prewarmed: { overlays: overlayUrls.length, posters: posterUrls.length } });
}
