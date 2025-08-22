import { getDb } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const who = session?.user?.email || null;
  if (!who) return res.status(401).json({ error: 'Unauthorized' });
  const db = await getDb();
  const users = db.collection('users');
  const me = await users.findOne(
    { email: who },
    { projection: { _id:1, email:1, displayName:1, handle:1, bio:1, profilePhotoUrl:1, isOrganization:1, followers:1, updatedAt:1, lastLoginAt:1 } }
  );
  res.json({ me, counts: await getCounts(db, who) });
}

async function getCounts(db, who) {
  const drafts = await db.collection('drafts').countDocuments({ authorEmail: who });
  const scheduled = await db.collection('drafts').countDocuments({ authorEmail: who, status: 'scheduled' });
  // publisher count = drafts only (per request)
  return { drafts, scheduled };
}

