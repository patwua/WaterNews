import { getDb } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email || null;
  if (!email) return res.status(401).json({ error: 'Unauthorized' });
  const db = await getDb();
  const drafts = db.collection('drafts');
  const posts = db.collection('posts');
  const events = db.collection('events');

  const sinceIso = new Date(Date.now() - 48*60*60*1000).toISOString();
  const [draftCount, scheduled, published, viewsAgg] = await Promise.all([
    drafts.countDocuments({ authorEmail: email }),
    drafts.countDocuments({ authorEmail: email, status: 'scheduled' }),
    posts.countDocuments({ authorEmail: email }),
    events.aggregate([
      { $match: { type: 'view', ts: { $gte: sinceIso }, 'authorEmail': email } }
    ]).toArray().catch(()=>[])
  ]);
  const views48h = Array.isArray(viewsAgg) ? viewsAgg.length : 0;
  res.json({ drafts: draftCount, scheduled, published, views48h });
}
