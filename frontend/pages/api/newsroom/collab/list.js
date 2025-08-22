import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getDb } from '@/lib/db';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const who = session?.user?.email || null;
  if (!who) return res.status(401).json({ error: 'Unauthorized' });
  const db = await getDb();
  const drafts = db.collection('drafts');
  const myShared = await drafts.find({ authorEmail: who, visibility: 'network' }).project({ title:1, updatedAt:1 }).sort({ updatedAt:-1 }).toArray();
  const network = await drafts.find({ visibility: 'network', authorEmail: { $ne: who } }).project({ title:1, updatedAt:1, authorEmail:1 }).sort({ updatedAt:-1 }).limit(50).toArray();
  res.json({ myShared, network });
}

