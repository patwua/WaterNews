// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

// GET → fetch mediaAssets on a draft
// PUT → replace mediaAssets on a draft
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'unauthorized' });
  const id = req.query.id as string;
  if (!id || !ObjectId.isValid(id)) return res.status(400).json({ error: 'invalid_id' });

  const db = await getDb();
  const Drafts = db.collection('drafts');

  if (req.method === 'GET') {
    const doc = await Drafts.findOne(
      { _id: new ObjectId(id) },
      { projection: { _id: 1, slug: 1, title: 1, mediaAssets: 1 } }
    );
    if (!doc) return res.status(404).json({ error: 'not_found' });
    return res.status(200).json({ draft: doc });
  }

  if (req.method === 'PUT') {
    const body = req.body as { mediaAssets?: any[] };
    if (!body || !Array.isArray(body.mediaAssets)) return res.status(400).json({ error: 'invalid_payload' });
    await Drafts.updateOne(
      { _id: new ObjectId(id) },
      { $set: { mediaAssets: body.mediaAssets } }
    );
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', 'GET,PUT');
  return res.status(405).end('Method Not Allowed');
}
