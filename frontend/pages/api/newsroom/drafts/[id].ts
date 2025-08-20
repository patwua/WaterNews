import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { isAdminEmail, isAdminUser } from '@/lib/admin-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions as any);
  const email = session?.user?.email || null;
  if (!email) return res.status(401).json({ error: 'Unauthorized' });

  const db = await getDb();
  const col = db.collection('drafts');
  const _id = new ObjectId(String(req.query.id));

  const current = await col.findOne({ _id });
  if (!current) return res.status(404).json({ error: 'Not found' });

  const admin = (await isAdminEmail(email)) || (await isAdminUser(email));
  const isOwner = current.authorEmail?.toLowerCase?.() === email.toLowerCase();
  if (!admin && !isOwner) return res.status(403).json({ error: 'Forbidden' });

  if (req.method === 'GET') {
    return res.json(current);
  }

  if (req.method === 'PATCH' || req.method === 'PUT') {
    const allowed: any = {};
    const body = req.body || {};
    const whitelist = admin
      ? ['title', 'body', 'tags', 'status', 'publishAt', 'media', 'ticketId', 'assigneeId', 'reviewerId', 'requireSecondReview']
      : ['title', 'body', 'tags', 'status', 'publishAt', 'media'];
    for (const k of whitelist) if (k in body) allowed[k] = body[k];
    allowed.updatedAt = new Date().toISOString();
    await col.updateOne({ _id }, { $set: allowed });
    const doc = await col.findOne({ _id });
    return res.json(doc);
  }

  res.setHeader('Allow', 'GET,PATCH,PUT');
  res.status(405).end();
}

