// Cron-style endpoint to publish scheduled drafts whose publishAt <= now
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { isAdminEmail, isAdminUser } from '@/lib/admin-auth';
import slugify from '@/lib/slugify';

async function ensureUniqueSlug(col, base) {
  const s = slugify(base || 'untitled');
  const exists = await col.findOne({ slug: s });
  if (!exists) return s;
  let i = 2;
  while (true) {
    const cand = `${s}-${i}`;
    const hit = await col.findOne({ slug: cand });
    if (!hit) return cand;
    i++;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  // Allow EITHER: admin session OR a secret token for cron
  const token = req.headers['x-cron-token'] || req.query.token;
  const allowToken = token && process.env.PUBLISH_CRON_TOKEN && String(token) === String(process.env.PUBLISH_CRON_TOKEN);
  let admin = false;
  let email = null;
  if (!allowToken) {
    const session = await getServerSession(req, res, authOptions);
    email = session?.user?.email || null;
    admin = !!(email && ((await isAdminEmail(email)) || (await isAdminUser(email))));
  }
  if (!allowToken && !admin) return res.status(401).json({ error: 'Unauthorized' });

  const db = await getDb();
  const drafts = db.collection('drafts');
  const posts = db.collection('posts');
  const nowIso = new Date().toISOString();

  const due = await drafts.find({
    status: 'scheduled',
    publishAt: { $lte: nowIso }
  }).toArray();

  const results = [];
  for (const d of due) {
    const slug = await ensureUniqueSlug(posts, d.slug || d.title);
    const publishedAt = new Date().toISOString();
    const postDoc = {
      title: d.title || 'Untitled',
      slug,
      body: d.body || '',
      excerpt: d.excerpt || '',
      tags: d.tags || [],
      authorEmail: d.authorEmail || email?.toLowerCase() || 'system',
      media: d.media || [],
      createdAt: publishedAt,
      updatedAt: publishedAt,
      publishedAt
    };
    const ins = await posts.insertOne(postDoc);
    await drafts.updateOne(
      { _id: new ObjectId(String(d._id)) },
      { $set: { status: 'published', postId: ins.insertedId, publishedAt, updatedAt: publishedAt } }
    );
    results.push({ draftId: d._id, postId: ins.insertedId, slug });
  }
  return res.json({ ok: true, published: results.length, results });
}
