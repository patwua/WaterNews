import { getDb } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const db = await getDb();
    const users = db.collection('users');
    const { name, image, handle } = req.body || {};
    const email = (req as any)?.body?.email || (req as any)?.user?.email || (req as any)?.session?.user?.email || req.query?.email || null;
    // Prefer NextAuth session if available
    const session = (await import('next-auth/next')).getServerSession ? await (await import('next-auth/next')).getServerSession(req as any, res as any, (await import('@/pages/api/auth/[...nextauth]')).authOptions) : null;
    const sessionEmail = (session as any)?.user?.email || null;
    const who = (sessionEmail || email || '').toLowerCase();
    if (!who) return res.status(401).json({ error: 'Unauthorized' });

    // Ensure unique handle (one-time set, case-insensitive)
    if (handle) {
      const desired = String(handle).trim();
      if (!/^[a-z0-9_]{2,32}$/i.test(desired)) return res.status(400).json({ error: 'Invalid handle' });
      const me = await users.findOne({ email: who }, { projection: { handle: 1, handleLower: 1 } });
      if (me?.handle && me.handle.toLowerCase() !== desired.toLowerCase()) {
        return res.status(409).json({ error: 'Handle already set and cannot be changed' });
      }
      const taken = await users.findOne({ handleLower: desired.toLowerCase(), email: { $ne: who } }, { projection: { _id: 1 } });
      if (taken) return res.status(409).json({ error: 'Handle is taken' });
      await users.updateOne(
        { email: who },
        { $set: { handle: desired, handleLower: desired.toLowerCase() } },
        { upsert: true }
      );
    }

    const update: any = {};
    if (name) update.name = name;
    if (image) update.image = image;
    if (Object.keys(update).length) {
      await users.updateOne(
        { email: who },
        { $set: update },
        { upsert: true }
      );
    }

    // helpful index (idempotent)
    await users.createIndex({ handleLower: 1 }, { unique: true }).catch(()=>{});

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
}
