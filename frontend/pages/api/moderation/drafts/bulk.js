import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { isAdminEmail, isAdminUser } from '@/lib/admin-auth';
import sendEmail from '@/lib/email';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email || null;
  const admin = email && ((await isAdminEmail(email)) || (await isAdminUser(email)));
  if (!admin) return res.status(401).json({ error: 'Unauthorized' });

  const { ids, action, note, reviewerEmail, assigneeEmail } = req.body || {};
  if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'ids required' });

  const db = await getDb();
  const col = db.collection('drafts');
  const _ids = ids.map((s) => new ObjectId(String(s)));
  const now = new Date().toISOString();

  let update = null;
  switch (action) {
    case 'approve':
      update = { $set: { status: 'ready', updatedAt: now } };
      break;
    case 'request_changes':
      update = { $set: { status: 'changes_requested', reviewNotes: note || '', updatedAt: now } };
      break;
    case 'require_second_review':
      update = { $set: { requireSecondReview: !!(req.body?.on ?? true), status: 'needs_second_review', updatedAt: now } };
      break;
    case 'assign_reviewer':
      if (!reviewerEmail) return res.status(400).json({ error: 'reviewerEmail required' });
      update = { $set: { reviewerEmail: String(reviewerEmail).toLowerCase(), updatedAt: now } };
      break;
    case 'assign_editor':
      if (!assigneeEmail) return res.status(400).json({ error: 'assigneeEmail required' });
      update = { $set: { assigneeEmail: String(assigneeEmail).toLowerCase(), updatedAt: now } };
      break;
    default:
      return res.status(400).json({ error: 'Unknown action' });
  }

  await col.updateMany({ _id: { $in: _ids } }, update);

  // Send author notifications for approval/changes
  if (action === 'approve' || action === 'request_changes') {
    try {
      const docs = await col.find({ _id: { $in: _ids } }).project({ authorEmail: 1, title: 1, reviewNotes: 1 }).toArray();
      for (const d of docs) {
        if (!d?.authorEmail) continue;
        const to = d.authorEmail;
        const subj = action === 'approve' ? `Approved: ${d.title || 'Untitled'}` : `Changes requested: ${d.title || 'Untitled'}`;
        const msg = action === 'approve'
          ? `Your draft "${d.title || 'Untitled'}" was approved.`
          : `Changes requested for "${d.title || 'Untitled'}". Notes: ${d.reviewNotes || note || ''}`;
        await sendEmail({ to, subject: subj, text: msg, html: `<p>${msg}</p>` });
      }
    } catch {}
  }

  return res.json({ ok: true, count: _ids.length });
}
