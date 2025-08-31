import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';
import { getTrendingOrder } from '@/lib/server/trending';
import { getTrendingCache, setTrendingCache } from '@/lib/server/trending-cache';
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

    let docs: any[] = [];

    if (sort === 'trending') {
      // Trending powered by streams_events (24h half-life). Optional window override: ?hours=48
      const hours = Math.max(1, Math.min(168, parseInt(String(req.query.hours || '48'), 10) || 48));
      // Try cache first (fresh if < 10 minutes)
      const cache = await getTrendingCache(hours);
      const fresh = cache && Date.now() - cache.updatedAt < 10 * 60 * 1000;
      let order =
        fresh && cache?.slugs?.length
          ? cache.slugs.slice(skip, skip + pageSize).map((slug) => ({ slug, score: 0 }))
          : null;
      if (!order) {
        const live = await getTrendingOrder({ hours, limit: pageSize, skip });
        // Refresh cache for first page only
        if (skip === 0) {
          const topAll = await getTrendingOrder({ hours, limit: 200, skip: 0 });
          await setTrendingCache(hours, topAll.map((r) => r.slug));
        }
        order = live;
      }
      const slugs = order.map((r) => r.slug).filter(Boolean);
      if (slugs.length === 0) {
        // Fallback to previously "stats.score" based ordering if no telemetry yet
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
            sort: { 'stats.score': -1 as const, publishedAt: -1 as const },
            skip,
            limit: pageSize,
          }
        );
        docs = await cursor.toArray();
      } else {
        const got = await Articles
          .find(
            { status: 'published', slug: { $in: slugs } },
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
            }
          )
          .toArray();
        // Preserve trending order
        const rank = new Map(slugs.map((s, i) => [s, i]));
        got.sort((a, b) => (rank.get(a.slug) ?? 0) - (rank.get(b.slug) ?? 0));
        docs = got;
      }
    } else {
      // latest
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
          sort: { publishedAt: -1 as const, _id: -1 as const },
          skip,
          limit: pageSize,
        }
      );
      docs = await cursor.toArray();
    }

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
    // Cache headers: quick client cache + generous SWR
    res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=600');
    res.status(200).json({ page, pageSize, count: media.length, items: media });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'failed_to_load_streams' });
  }
}
