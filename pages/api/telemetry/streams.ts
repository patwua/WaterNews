import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '../../../lib/server/db';

/**
 * POST /api/telemetry/streams
 * Accepts any "streams_*" events and stores them in the "streams_events" collection.
 * Body: { type: 'streams_*', sid?: string, ts?: number, ...props }
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }
  try {
    const payload = req.body && typeof req.body === 'object' ? req.body : {};
    const { type } = payload as { type?: string };
    if (!type || !/^streams_/.test(type)) {
      return res.status(400).json({ error: 'invalid_type' });
    }
    // Normalize event
    const now = Date.now();
    const doc = {
      ...payload,
      ip: (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || (req as any).socket?.remoteAddress || null,
      ua: req.headers['user-agent'] || null,
      ts: Number.isFinite((payload as any).ts) ? (payload as any).ts : now,
      receivedAt: now,
    };
    const db = await getDb();
    await db.collection('streams_events').insertOne(doc);
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'telemetry_insert_failed' });
  }
}

