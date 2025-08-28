import type { NextApiRequest, NextApiResponse } from 'next';
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

  const admin = (await isAdminEmail(email)) || (await isAdminUser(email));

  if (req.method === 'GET') {
    const { q, status, all } = req.query as Record<string, string>;
    const filter: any = {};
    if (!admin || all !== '1') filter.authorEmail = email.toLowerCase();
    if (status) filter.status = status;
    if (q) filter.title = { $regex: String(q), $options: 'i' };
    const items = await col.find(filter).sort({ updatedAt: -1 }).limit(200).toArray();
    return res.json({ items });
  }

  if (req.method === 'POST') {
    const now = new Date().toISOString();
    const payload = {
      title: req.body?.title ?? 'Untitled',
      body: req.body?.body ?? '',
      status: 'draft',
      authorEmail: email.toLowerCase(),
      createdAt: now,
      updatedAt: now,
    };
    const r = await col.insertOne(payload);
    return res.json({ _id: r.insertedId, ...payload });
  }

  res.setHeader('Allow', 'GET,POST');
  res.status(405).end();
}

