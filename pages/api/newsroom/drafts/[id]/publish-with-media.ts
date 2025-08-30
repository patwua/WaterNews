import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { copyDraftMediaAssetsToArticle } from '@/lib/server/streams-copy';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';

const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

/**
 * POST /api/newsroom/drafts/:id/publish-with-media?force=true|false
 * 1) Calls existing /api/newsroom/drafts/:id/publish (for your normal pipeline)
 * 2) Copies draft.mediaAssets -> article.mediaAssets (if article has none, or force=true)
 *
 * Uses NEXTAUTH_URL to call the internal publish route and forwards newsroom session cookies.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: 'unauthorized' });

  const draftId = req.query.id as string;
  if (!draftId || !isValidObjectId(draftId)) {
    return res.status(400).json({ error: 'invalid_draft_id' });
  }

  const force = String(req.query.force || '').toLowerCase() === 'true';
  const base = process.env.NEXTAUTH_URL; // e.g. https://waternews.onrender.com
  if (!base) return res.status(500).json({ error: 'missing_NEXTAUTH_URL' });

  // Call the existing publish endpoint, forwarding session cookies for auth
  const cookie = req.headers.cookie || '';
  const publishUrl = `${base}/api/newsroom/drafts/${encodeURIComponent(draftId)}/publish`;
  const pubResp = await fetch(publishUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // forward session cookies so next-auth authorizes this server-side call
      ...(cookie ? { cookie } : {}),
    },
    // forward payload if your pipeline expects it (e.g., { publishAt, sectionId, ... })
    body: req.body && typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {}),
  });

  let publishData: any = null;
  try {
    publishData = await pubResp.json();
  } catch {
    // keep as null if no JSON
  }

  if (!pubResp.ok) {
    return res.status(pubResp.status).json({ error: 'publish_failed', detail: publishData || null });
  }

  // Try to extract article identifiers from publish response or fallback to draft
  let articleId: string | null = publishData?.articleId || publishData?.article?._id || publishData?.post?._id || null;
  let slug: string | null = publishData?.slug || publishData?.article?.slug || publishData?.post?.slug || null;

  if (!articleId && !slug) {
    // Fallback: read draft for its slug; most pipelines publish using draft.slug
    const db = await getDb();
    const draft = await db.collection('drafts').findOne(
      { _id: new ObjectId(draftId) },
      { projection: { slug: 1 } }
    );
    slug = (draft as any)?.slug || null;
  }

  const copyRes = await copyDraftMediaAssetsToArticle({ draftId, articleId, slug, force });

  return res.status(200).json({
    ok: true,
    publish: publishData,
    mediaAssetsCopied: copyRes.copied,
    reason: copyRes.reason,
    articleId,
    slug,
  });
}

