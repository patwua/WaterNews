// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { isAdminEmail, isAdminUser } from '@/lib/admin-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email || null;
  const admin = email && ((await isAdminEmail(email)) || (await isAdminUser(email)));
  if (!admin) return res.status(401).json({ error: 'Unauthorized' });

  const db = await getDb();
  const drafts = db.collection('drafts');
  const posts = db.collection('posts');
  const now = new Date();
  const dayAgoIso = new Date(now.getTime() - 24*60*60*1000).toISOString();

  const [
    ready, second, changes, scheduled, published24
  ] = await Promise.all([
    drafts.countDocuments({ status: 'ready' }),
    drafts.countDocuments({ status: 'needs_second_review' }),
    drafts.countDocuments({ status: 'changes_requested' }),
    drafts.countDocuments({ status: 'scheduled' }),
    posts.countDocuments({ publishedAt: { $gte: dayAgoIso } }),
  ]);

  // Avg age (hours) for ready/needs_second_review
  const ages = await drafts.aggregate([
    { $match: { status: { $in: ['ready', 'needs_second_review'] } } },
    { $project: { diffMs: { $subtract: [now, { $toDate: '$updatedAt' }] } } },
    { $group: { _id: null, avgMs: { $avg: '$diffMs' } } }
  ]).toArray();
  const avgPendingHours = ages?.[0]?.avgMs ? (ages[0].avgMs / 3600000) : 0;

  res.json({
    ready, needs_second_review: second, changes_requested: changes,
    scheduled, published_24h: published24,
    pending: ready + second + changes,
    avg_pending_hours: Number(avgPendingHours.toFixed(2)),
    asOf: now.toISOString()
  });
}
