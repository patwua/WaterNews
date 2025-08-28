// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
// Sends email digests to authors summarizing newly approved comments on their posts.
import { getDb } from '@/lib/db';
import sendEmail from '@/lib/email';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { isAdminEmail, isAdminUser } from '@/lib/admin-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  // Admin session OR token header/query
  const token = req.headers['x-cron-token'] || req.query.token;
  const allowToken = token && process.env.COMMENTS_DIGEST_TOKEN && String(token) === String(process.env.COMMENTS_DIGEST_TOKEN);
  let admin = false, email = null;
  if (!allowToken) {
    const session = await getServerSession(req, res, authOptions);
    email = session?.user?.email || null;
    admin = !!(email && ((await isAdminEmail(email)) || (await isAdminUser(email))));
  }
  if (!allowToken && !admin) return res.status(401).json({ error: 'Unauthorized' });

  const db = await getDb();
  const posts = db.collection('posts');
  const comments = db.collection('comments');

  const now = new Date();
  const defaultSinceIso = new Date(now.getTime() - 24*60*60*1000).toISOString();

  // Pull candidate slugs with approved comments in the last 48h (bigger net, we'll filter per-post below)
  const sinceIso = new Date(now.getTime() - 48*60*60*1000).toISOString();
  const agg = await comments.aggregate([
    { $match: { status: 'approved', approvedAt: { $gte: sinceIso } } },
    { $group: { _id: '$postSlug', maxApprovedAt: { $max: '$approvedAt' } } },
  ]).toArray();
  if (!agg.length) return res.json({ ok: true, sent: 0 });

  const slugs = agg.map(a => a._id);
  const postDocs = await posts.find({ slug: { $in: slugs } }).project({ slug: 1, authorEmail: 1, title: 1, commentsDigestAt: 1 }).toArray();
  const slug2post = new Map(postDocs.map(p => [p.slug, p]));

  // Build author → posts → comments map
  const authorBuckets = new Map(); // email -> { posts: Map<slug, {title, items:[]}> }
  for (const slug of slugs) {
    const post = slug2post.get(slug);
    if (!post?.authorEmail) continue;
    const since = post.commentsDigestAt || defaultSinceIso;
    const items = await comments.find({ status: 'approved', postSlug: slug, approvedAt: { $gte: since } })
      .project({ body: 1, authorEmail: 1, approvedAt: 1 }).sort({ approvedAt: -1 }).limit(50).toArray();
    if (!items.length) continue;
    if (!authorBuckets.has(post.authorEmail)) authorBuckets.set(post.authorEmail, new Map());
    const pm = authorBuckets.get(post.authorEmail);
    pm.set(slug, { title: post.title || slug, items });
  }

  // Send digests and advance per-post cursor
  let sent = 0;
  for (const [authorEmail, pm] of authorBuckets.entries()) {
    const sections = [];
    for (const [slug, { title, items }] of pm.entries()) {
      const lines = items.map(it => `— ${it.authorEmail || 'anonymous'} @ ${new Date(it.approvedAt || it.createdAt).toLocaleString()}: ${String(it.body).slice(0,160)}…`);
      sections.push(`<h4>${escapeHtml(title)}</h4><ul>${lines.map(li=>`<li>${escapeHtml(li)}</li>`).join('')}</ul><p><a href="${(process.env.NEXTAUTH_URL || '')}/news/${slug}#comments">View post</a></p>`);
    }
    const html = `<p>You have new comments on your post(s):</p>${sections.join('')}<p><em>This is an automated digest.</em></p>`;
    const text = html.replace(/<[^>]+>/g,'');
    try {
      await sendEmail({ to: authorEmail, subject: 'New comments digest', text, html });
      sent++;
      // move cursor: set commentsDigestAt = now for those posts
      const affectedSlugs = Array.from(pm.keys());
      await posts.updateMany({ slug: { $in: affectedSlugs } }, { $set: { commentsDigestAt: now.toISOString() } });
    } catch {}
  }

  return res.json({ ok: true, sent, authors: Array.from(authorBuckets.keys()) });
}

function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c])); }
