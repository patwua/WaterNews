import { ObjectId } from 'mongodb';
import { getDb } from '../db';

const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

type CopyArgs = {
  draftId: string;
  articleId?: string | null;
  slug?: string | null;
  force?: boolean;
};

export async function copyDraftMediaAssetsToArticle(args: CopyArgs) {
  const { draftId, articleId, slug, force = false } = args;
  const db = await getDb();
  const Drafts = db.collection('drafts');
  const Articles = db.collection('articles');

  if (!isValidObjectId(draftId)) {
    return { copied: false, reason: 'invalid_draft_id' as const };
  }

  const draft = await Drafts.findOne(
    { _id: new ObjectId(draftId) },
    { projection: { mediaAssets: 1, slug: 1 } }
  );
  if (!draft) return { copied: false, reason: 'draft_not_found' as const };
  const mediaAssets = Array.isArray(draft.mediaAssets) ? draft.mediaAssets : [];
  if (!mediaAssets.length) return { copied: false, reason: 'no_media_on_draft' as const };

  // Resolve target article
  let filter: any = null;
  if (articleId && isValidObjectId(articleId)) {
    filter = { _id: new ObjectId(articleId) };
  } else if (slug || draft.slug) {
    filter = { slug: slug || draft.slug };
  } else {
    return { copied: false, reason: 'no_article_selector' as const };
  }

  if (!force) {
    const existing = await Articles.findOne(filter, { projection: { _id: 1, mediaAssets: 1, slug: 1 } });
    if (!existing) return { copied: false, reason: 'article_not_found' as const };
    if (Array.isArray(existing.mediaAssets) && existing.mediaAssets.length) {
      return { copied: false, reason: 'article_already_has_media' as const };
    }
  }

  const res = await Articles.updateOne(
    filter,
    { $set: { mediaAssets, updatedAt: new Date() } }
  );
  return {
    copied: res.matchedCount > 0 && res.modifiedCount > 0,
    reason: res.matchedCount ? 'ok' : ('article_not_found' as const),
  };
}

