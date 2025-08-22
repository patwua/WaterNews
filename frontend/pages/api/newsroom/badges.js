import { getDb } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email || null;
  if (!email) return res.status(401).json({ error: 'Unauthorized' });
  const db = await getDb();
  const drafts = db.collection('drafts');
  const notices = db.collection('notices');
  const users = db.collection('users');

  const [draftCount, scheduledCount, meDoc] = await Promise.all([
    drafts.countDocuments({ authorEmail: email }),
    drafts.countDocuments({ authorEmail: email, status: 'scheduled' }),
    users.findOne({ email: email.toLowerCase() }, { projection: { noticesSeenAt: 1 } })
  ]);
  const seenAt = meDoc?.noticesSeenAt || '1970-01-01T00:00:00.000Z';
  const unread = await notices.countDocuments({ createdAt: { $gt: seenAt } });

  // collaboration: open network drafts not mine
  const collabOpportunities = await drafts.countDocuments({ visibility: 'network', authorEmail: { $ne: email } });

  res.json({
    drafts: draftCount,
    scheduled: scheduledCount,
    noticesUnread: unread,
    collabOpportunities
  });
}
