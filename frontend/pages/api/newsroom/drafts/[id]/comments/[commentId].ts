// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { isAdminEmail, isAdminUser } from '@/lib/admin-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const who = session?.user?.email || null;
  if (!who) return res.status(401).json({ error: 'Unauthorized' });
  const { id, commentId } = req.query || {};
  if (!id || !commentId) return res.status(400).json({ error: 'id and commentId required' });
  const db = await getDb();
  const col = db.collection('draftComments');
  const doc = await col.findOne({ _id: new ObjectId(String(commentId)), draftId: new ObjectId(String(id)) });
  if (!doc) return res.status(404).json({ error: 'Comment not found' });
  const admin = (await isAdminEmail(who)) || (await isAdminUser(who));

  if (req.method === 'POST') {
    const action = req.body?.action;
    if (action === 'resolve') {
      if (doc.authorEmail !== who && !admin) return res.status(403).json({ error: 'Not allowed' });
      await col.updateOne({ _id: doc._id }, { $set: { resolved: true, resolvedAt: new Date().toISOString() } });
      return res.json({ ok: true });
    }
    return res.status(400).json({ error: 'Unknown action' });
  }

  if (req.method === 'DELETE') {
    if (doc.authorEmail !== who && !admin) return res.status(403).json({ error: 'Not allowed' });
    await col.deleteOne({ _id: doc._id });
    return res.json({ ok: true });
  }

  res.setHeader('Allow','POST,DELETE'); res.status(405).end();
}
