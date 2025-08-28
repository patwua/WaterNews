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

  const reviewer = await drafts.aggregate([
    { $match: { status: { $in: ['ready', 'needs_second_review'] } } },
    { $group: { _id: '$reviewerEmail', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]).toArray();

  const editor = await drafts.aggregate([
    { $match: { status: { $in: ['ready', 'needs_second_review', 'changes_requested', 'scheduled'] } } },
    { $group: { _id: '$assigneeEmail', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]).toArray();

  res.json({
    reviewer: reviewer.map(r => ({ email: r._id || '(unassigned)', count: r.count })),
    editor: editor.map(r => ({ email: r._id || '(unassigned)', count: r.count })),
  });
}
