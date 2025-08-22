import { getDb } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email || null;
  if (!email) return res.status(401).json({ error: 'Unauthorized' });
  const db = await getDb();
  const follows = db.collection('follows'); // expected shape: { user: string, follower: string }
  const users = db.collection('users');
  const nowIso = new Date().toISOString();
  // Upsert lastSeenAt on access
  await users.updateOne({ email: email.toLowerCase() }, { $set: { lastSeenAt: nowIso } }, { upsert: true });
  const me = await users.findOne({ email: email.toLowerCase() }, { projection: { handle: 1, name: 1, image: 1, lastSeenAt: 1 } });
  const followers = await follows.countDocuments({ user: email.toLowerCase() }).catch(()=>0);
  const following = await follows.countDocuments({ follower: email.toLowerCase() }).catch(()=>0);
  res.json({ email,
    handle: me?.handle || null, name: me?.name || null, image: me?.image || null,
    followers, following, lastSeenAt: me?.lastSeenAt || nowIso
  });
}
