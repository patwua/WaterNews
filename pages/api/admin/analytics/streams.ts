import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../../../lib/server/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

function isAdminEmail(email?: string | null) {
  if (!email) return false;
  const list = (process.env.ADMIN_EMAILS || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  return list.includes(email.toLowerCase());
}

/**
 * GET /api/admin/analytics/streams?from=2025-08-01&to=2025-08-31
 * or /api/admin/analytics/streams?days=7  (default)
 *
 * Returns per-slug metrics: views, avgDwellMs, plays, completes, completionRate
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !isAdminEmail((session.user as any)?.email)) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  const db = await getDb();
  const coll = db.collection('streams_events');

  const now = Date.now();
  const { from, to, days } = req.query as { from?: string; to?: string; days?: string };
  let startTs: number;
  let endTs: number;
  if (from || to) {
    startTs = from ? Date.parse(from) : now - 7 * 24 * 3600 * 1000;
    endTs = to ? Date.parse(to) : now;
  } else {
    const d = Math.max(1, Math.min(90, parseInt(days || '7', 10) || 7));
    startTs = now - d * 24 * 3600 * 1000;
    endTs = now;
  }

  // Views per slug
  const viewsAgg = await coll
    .aggregate([
      { $match: { type: 'streams_view', ts: { $gte: startTs, $lt: endTs } } },
      { $group: { _id: '$slug', views: { $sum: 1 } } },
      { $project: { _id: 0, slug: '$_id', views: 1 } },
    ])
    .toArray();

  // Dwell: focus end events carry dwellMs
  const dwellAgg = await coll
    .aggregate([
      { $match: { type: 'streams_focus', ts: { $gte: startTs, $lt: endTs }, phase: 'end' } },
      { $group: { _id: '$slug', totalDwellMs: { $sum: '$dwellMs' }, ends: { $sum: 1 } } },
      { $project: { _id: 0, slug: '$_id', avgDwellMs: { $cond: [{ $gt: ['$ends', 0] }, { $divide: ['$totalDwellMs', '$ends'] }, 0] } } },
    ])
    .toArray();

  // Completion rate = completes / plays
  const playsAgg = await coll
    .aggregate([
      { $match: { type: 'streams_video_play', ts: { $gte: startTs, $lt: endTs } } },
      { $group: { _id: '$slug', plays: { $sum: 1 } } },
      { $project: { _id: 0, slug: '$_id', plays: 1 } },
    ])
    .toArray();

  const completesAgg = await coll
    .aggregate([
      { $match: { type: 'streams_video_complete', ts: { $gte: startTs, $lt: endTs } } },
      { $group: { _id: '$slug', completes: { $sum: 1 } } },
      { $project: { _id: 0, slug: '$_id', completes: 1 } },
    ])
    .toArray();

  // Merge
  const bySlug = new Map<string, any>();
  for (const v of viewsAgg) bySlug.set(v.slug, { slug: v.slug, views: v.views });
  for (const d of dwellAgg) bySlug.set(d.slug, { ...(bySlug.get(d.slug) || { slug: d.slug, views: 0 }), avgDwellMs: d.avgDwellMs });
  for (const p of playsAgg) bySlug.set(p.slug, { ...(bySlug.get(p.slug) || { slug: p.slug, views: 0 }), plays: p.plays });
  for (const c of completesAgg) bySlug.set(c.slug, { ...(bySlug.get(c.slug) || { slug: c.slug, views: 0 }), completes: c.completes });

  const rows = Array.from(bySlug.values()).map((r) => {
    const plays = r.plays || 0;
    const completes = r.completes || 0;
    const completionRate = plays > 0 ? completes / plays : 0;
    return {
      slug: r.slug,
      views: r.views || 0,
      avgDwellMs: Math.round(r.avgDwellMs || 0),
      plays,
      completes,
      completionRate,
    };
  });

  rows.sort((a, b) => b.views - a.views);

  return res.status(200).json({
    range: { from: new Date(startTs).toISOString(), to: new Date(endTs).toISOString() },
    rows,
  });
}

