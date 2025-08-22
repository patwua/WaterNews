import { getDb } from '@/lib/db';

// Returns a lightweight set of recent media references from posts/drafts.
// Falls back to local placeholders if none found. Does NOT hit Cloudinary.
export default async function handler(req, res) {
  const db = await getDb();
  const posts = db.collection('posts');
  const drafts = db.collection('drafts');
  const out = [];
  const p = await posts.find({}).project({ featuredImage:1, images:1, media:1 }).sort({ publishedAt: -1 }).limit(50).toArray().catch(()=>[]);
  const d = await drafts.find({}).project({ attachments:1, images:1 }).sort({ updatedAt: -1 }).limit(50).toArray().catch(()=>[]);
  for (const doc of [...p, ...d]) {
    const arr = [].concat(doc?.images||[], doc?.media||[], doc?.attachments||[], doc?.featuredImage? [doc.featuredImage] : []);
    for (const one of arr) {
      if (!one) continue;
      const url = typeof one === 'string' ? one : (one.secure_url || one.url || one.src);
      if (url && out.length < 48) out.push({ url, secure_url: url });
    }
    if (out.length >= 48) break;
  }
  if (!out.length) {
    // fallback placeholders
    out.push({ url: '/placeholders/newsroom.svg' }, { url: '/placeholders/contact-hero.svg' }, { url: '/placeholders/community-1.svg' });
  }
  res.json({ items: out });
}
