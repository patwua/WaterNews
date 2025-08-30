import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';
import type { MediaSlice } from '@/lib/types/media';

/**
 * GET /api/media/streams?sort=latest|trending&page=1
 * Returns a flattened list of media slices across published articles.
 * Separate from existing /api/media/* endpoints to avoid collisions.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const sort = (req.query.sort as string) || 'latest';
    const page = Math.max(parseInt((req.query.page as string) || '1', 10), 1);
    const pageSize = 12;
    const skip = (page - 1) * pageSize;

    const db = await getDb();
    if (!db) return res.status(500).json({ error: 'db_not_configured' });
    const Articles = db.collection('articles');

    const sortStage =
      sort === 'trending'
        ? { 'stats.score': -1 as const, publishedAt: -1 as const }
        : { publishedAt: -1 as const, _id: -1 as const };

    const cursor = Articles.find(
      { status: 'published' },
      {
        projection: {
          _id: 1,
          slug: 1,
          title: 1,
          publishedAt: 1,
          mediaAssets: 1,
          coverImage: 1,
          content: 1,
        },
        sort: sortStage,
        skip,
        limit: pageSize,
      }
    );

    const docs = await cursor.toArray();

    const flatten = (doc: any): MediaSlice[] => {
      const articleBase = {
        id: (doc._id as ObjectId).toString(),
        slug: doc.slug,
        title: doc.title,
      };
      const slices: MediaSlice[] = [];

      // Preferred explicit media assets
      if (Array.isArray(doc.mediaAssets) && doc.mediaAssets.length) {
        for (const m of doc.mediaAssets) {
          const id = `${articleBase.id}:${m.url || m.publicId || Math.random().toString(36).slice(2)}`;
          slices.push({
            id,
            type: m.type === 'video' ? 'video' : 'image',
            src: m.url || m.publicId,
            poster: m.poster,
            duration: m.duration,
            width: m.width,
            height: m.height,
            provider: m.provider || 'other',
            article: articleBase,
          });
        }
        return slices;
      }

      // Fallback: coverImage
      if (doc.coverImage) {
        slices.push({
          id: `${articleBase.id}:cover`,
          type: 'image',
          src: doc.coverImage,
          article: articleBase,
        });
        return slices;
      }

      // Last resort: sniff first media URL in content
      if (typeof doc.content === 'string') {
        const imgMatch = doc.content.match(/https?:[^"' )]+\.(?:png|jpe?g|webp|gif)/i);
        const vidMatch = doc.content.match(/https?:[^"' )]+\.(?:mp4|webm|m3u8)/i);
        if (vidMatch) {
          slices.push({
            id: `${articleBase.id}:autoVid`,
            type: 'video',
            src: vidMatch[0],
            article: articleBase,
          });
        } else if (imgMatch) {
          slices.push({
            id: `${articleBase.id}:autoImg`,
            type: 'image',
            src: imgMatch[0],
            article: articleBase,
          });
        }
      }

      return slices;
    };

    const media = docs.flatMap(flatten);
    res.status(200).json({ page, pageSize, count: media.length, items: media });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'failed_to_load_streams' });
  }
}
