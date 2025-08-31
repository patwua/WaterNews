import type { NextApiRequest, NextApiResponse } from 'next';
import { isCronAuthorized } from '../../../../lib/server/cron-auth';
import { getDb } from '../../../../lib/server/db';
import { ObjectId } from 'mongodb';

/**
 * POST /api/admin/cron/ensure-posters
 * Scans recent articles/drafts and fills missing video posters IF the video URL is a Cloudinary delivery URL.
 * (External videos are skipped.)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await isCronAuthorized(req, res))) return res.status(401).json({ error: 'unauthorized' });

  const db = await getDb();
  const Articles = db.collection('articles');
  const Drafts = db.collection('drafts');

  const since = new Date(Date.now() - 14 * 24 * 3600 * 1000);
  const q = { updatedAt: { $gte: since } };
  const fields = { projection: { _id: 1, mediaAssets: 1, slug: 1 } };
  const articles = await Articles.find(q, fields).toArray();
  const drafts = await Drafts.find(q, fields).toArray();

  let updated = 0;
  function derivePoster(url: string) {
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) return null;
    if (!/res\.cloudinary\.com/.test(url) && !/\/video\/upload\//.test(url)) return null;
    // Replace to request a jpg frame with width 1080 (simple heuristic)
    return url.replace('/video/upload/', `/video/upload/f_auto,q_70,w_1080/`).replace(/\.mp4($|\?)/, '.jpg$1');
  }

  async function processColl(docs: any[], collection: any) {
    for (const doc of docs) {
      const assets = Array.isArray(doc.mediaAssets) ? doc.mediaAssets : [];
      let changed = false;
      for (const m of assets) {
        if (m?.type === 'video' && !m.poster && typeof m.url === 'string') {
          const p = derivePoster(m.url);
          if (p) {
            m.poster = p;
            changed = true;
          }
        }
      }
      if (changed) {
        const id = doc._id as ObjectId;
        await collection.updateOne(
          { _id: id },
          { $set: { mediaAssets: assets, updatedAt: new Date() } }
        );
        updated++;
      }
    }
  }

  await processColl(articles, Articles);
  await processColl(drafts, Drafts);

  return res.status(200).json({ ok: true, updated });
}
