import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { isAdminEmail, isAdminUser } from '@/lib/admin-auth';
import { sendEmail } from '@/lib/email';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email || null;
  const admin = email && ((await isAdminEmail(email)) || (await isAdminUser(email)));
  if (!admin) return res.status(401).json({ error: 'Unauthorized' });

  const { ids, action } = req.body || {};
  if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ error: 'ids required' });
  const _ids = ids.map((s) => new ObjectId(String(s)));

  const db = await getDb();
  const col = db.collection('comments');
  const now = new Date().toISOString();

  if (action === 'approve') {
    await col.updateMany({ _id: { $in: _ids } }, { $set: { status: 'approved', updatedAt: now } });
  } else if (action === 'reject') {
    await col.updateMany({ _id: { $in: _ids } }, { $set: { status: 'rejected', updatedAt: now } });
  } else if (action === 'delete') {
    await col.deleteMany({ _id: { $in: _ids } });
  } else {
    return res.status(400).json({ error: 'Unknown action' });
  }

  // Optional: notify authors on approval (quietly ignore failures)
  if (action === 'approve') {
    try {
      const docs = await col.find({ _id: { $in: _ids } }).project({ authorEmail: 1, postSlug: 1 }).toArray();
      for (const d of docs) {
        if (!d?.authorEmail) continue;
        await sendEmail({
          to: d.authorEmail,
          subject: 'Your comment is now visible',
          text: `Your comment on ${d.postSlug} was approved.`,
          html: `<p>Your comment on <b>${d.postSlug}</b> was approved.</p>`
        });
      }
    } catch {}
  }

  res.json({ ok: true, count: _ids.length });
}
