import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { getDb } from '../../../../lib/server/db';

function isAdminEmail(email?: string | null) {
  if (!email) return false;
  const list = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}

/**
 * POST /api/admin/cron/ensure-indexes
 * Creates helpful indexes if missing.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const isAdmin = !!session && isAdminEmail((session.user as any)?.email);
  const tokenOk =
    !!process.env.PATWUA_API_KEY && req.headers.authorization === `Bearer ${process.env.PATWUA_API_KEY}`;
  if (!isAdmin && !tokenOk) return res.status(401).json({ error: 'unauthorized' });

  const db = await getDb();
  await db.collection('streams_events').createIndex({ ts: -1 });
  await db.collection('streams_events').createIndex({ slug: 1, ts: -1 });
  await db.collection('streams_events').createIndex({ type: 1, ts: -1 });
  await db.collection('articles').createIndex({ slug: 1 }, { unique: true, sparse: true });
  await db.collection('articles').createIndex({ publishedAt: -1, _id: -1 });

  return res.status(200).json({ ok: true });
}
