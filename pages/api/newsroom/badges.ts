// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const who = session?.user?.email || null;
  if (!who) return res.status(401).json({ error: 'Unauthorized' });
  const db = await getDb();
  const drafts = await db.collection('drafts').countDocuments({ authorEmail: who }); // drafts only
  const scheduled = await db.collection('drafts').countDocuments({ authorEmail: who, status: 'scheduled' });
  const unread = await db.collection('noticeSeen').countDocuments({ email: who, unread: true });
  res.json({ drafts, scheduled, noticeUnread: unread });
}

