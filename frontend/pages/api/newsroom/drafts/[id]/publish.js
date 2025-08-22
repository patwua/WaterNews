import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { slugify } from '@/lib/slugify';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const session = await getServerSession(req, res, authOptions);
  const who = session?.user?.email || null;
  if (!who) return res.status(401).json({ error: 'Unauthorized' });
  const { id } = req.query || {};
  const db = await getDb();
  const drafts = db.collection('drafts');
  const posts = db.collection('posts');
  const users = db.collection('users');
  const draft = await drafts.findOne({ _id: new ObjectId(String(id)) });
  if (!draft || draft.authorEmail !== who) return res.status(403).json({ error: 'Not allowed' });
  if (!draft.title || !draft.body) return res.status(400).json({ error: 'Title and body required' });
  const author = await users.findOne({ email: who }, { projection: { displayName:1, handle:1, profilePhotoUrl:1, avatarUrl:1 } });
  const slug = draft.slug || slugify(`${draft.title}-${draft._id.toString().slice(-5)}`);
  const post = {
    slug,
    title: draft.title,
    body: draft.body,
    attachments: draft.attachments || [],
    authorEmail: who,
    authorDisplay: author?.displayName || null,
    authorHandle: author?.handle || null,
    authorProfilePhotoUrl: author?.profilePhotoUrl || author?.avatarUrl || null,
    publishedAt: new Date().toISOString(),
    threadUrl: draft.threadUrl || null,
    coverImage: draft.coverImage || null
  };
  await posts.updateOne({ slug }, { $set: post }, { upsert: true });
  await drafts.updateOne({ _id: draft._id }, { $set: { status: 'published', publishedAt: post.publishedAt, slug } });
  res.json({ ok: true, slug, url: `/news/${slug}` });
}

