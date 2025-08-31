import { ObjectId } from 'mongodb';
import { getDb } from '../db';

const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

type CopyArgs = {
  draftId: string;
  postId?: string | null;
  slug?: string | null;
  force?: boolean;
};

export async function copyDraftMediaAssetsToPost(args: CopyArgs) {
  const { draftId, postId, slug, force = false } = args;
  const db = await getDb();
  const Drafts = db.collection('drafts');
  const Posts = db.collection('posts');

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

  // Resolve target post
  let filter: any = null;
  if (postId && isValidObjectId(postId)) {
    filter = { _id: new ObjectId(postId) };
  } else if (slug || draft.slug) {
    filter = { slug: slug || draft.slug };
  } else {
    return { copied: false, reason: 'no_post_selector' as const };
  }

  if (!force) {
    const existing = await Posts.findOne(filter, { projection: { _id: 1, mediaAssets: 1, slug: 1 } });
    if (!existing) return { copied: false, reason: 'post_not_found' as const };
    if (Array.isArray(existing.mediaAssets) && existing.mediaAssets.length) {
      return { copied: false, reason: 'post_already_has_media' as const };
    }
  }

  const res = await Posts.updateOne(
    filter,
    { $set: { mediaAssets, updatedAt: new Date() } }
  );
  return {
    copied: res.matchedCount > 0 && res.modifiedCount > 0,
    reason: res.matchedCount ? 'ok' : ('post_not_found' as const),
  };
}

