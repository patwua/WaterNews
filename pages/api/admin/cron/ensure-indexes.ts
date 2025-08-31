import type { NextApiRequest, NextApiResponse } from 'next';
import { isCronAuthorized } from '../../../../lib/server/cron-auth';
import { getDb } from '../../../../lib/server/db';

/**
 * POST /api/admin/cron/ensure-indexes
 * Creates helpful indexes if missing.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await isCronAuthorized(req, res))) return res.status(401).json({ error: 'unauthorized' });

  const db = await getDb();
  await db.collection('streams_events').createIndex({ ts: -1 });
  await db.collection('streams_events').createIndex({ slug: 1, ts: -1 });
  await db.collection('streams_events').createIndex({ type: 1, ts: -1 });
  await db.collection('articles').createIndex({ slug: 1 }, { unique: true, sparse: true });
  await db.collection('articles').createIndex({ publishedAt: -1, _id: -1 });

  return res.status(200).json({ ok: true });
}
