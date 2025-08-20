import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { isAdminEmail, isAdminUser } from '@/lib/admin-auth';
import { slugify } from '@/lib/slugify';

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
  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email || null;
  if (!email) return res.status(401).json({ error: 'Unauthorized' });

  const db = await getDb();
  const drafts = db.collection('drafts');
  const posts = db.collection('posts');
  const _id = new ObjectId(String(req.query.id));

  const admin = (await isAdminEmail(email)) || (await isAdminUser(email));
  if (!admin) return res.status(403).json({ error: 'Admins only' });

  const draft = await drafts.findOne({ _id });
  if (!draft) return res.status(404).json({ error: 'Draft not found' });

  const now = new Date();
  const publishedAt = now.toISOString();
  const slug = await ensureUniqueSlug(posts, draft.slug || draft.title);
  const postDoc = {
    title: draft.title || 'Untitled',
    slug,
    body: draft.body || '',
    excerpt: draft.excerpt || '',
    tags: draft.tags || [],
    authorEmail: draft.authorEmail || email.toLowerCase(),
    media: draft.media || [],
    createdAt: publishedAt,
    updatedAt: publishedAt,
    publishedAt
  };
  const ins = await posts.insertOne(postDoc);

  await drafts.updateOne(
    { _id },
    { $set: { status: 'published', postId: ins.insertedId, publishedAt, updatedAt: publishedAt } }
  );

  const post = await posts.findOne({ _id: ins.insertedId });
  return res.json({ ok: true, post });
}
