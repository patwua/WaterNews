# Article mediaAssets — Rev5 (Streams)

Extend Article documents with optional `mediaAssets` to power Streams precisely:

```ts
type MediaAsset = {
  type: 'image' | 'video';
  url?: string;          // absolute URL (e.g., Cloudinary delivery or mp4)
  publicId?: string;     // Cloudinary publicId if you store IDs instead of URLs
  poster?: string;       // optional image poster for video
  width?: number;
  height?: number;
  duration?: number;     // seconds, optional
  provider?: 'cloudinary' | 'static' | 'other';
};
```

Stored as:
```ts
{
  _id: ObjectId,
  slug: string,
  title: string,
  // ...
  mediaAssets?: MediaAsset[],
}
```

`/api/media/streams` also falls back to `coverImage` or the first media URL found in `content` when `mediaAssets` is absent.

## Editorial workflow (recommended)
1) In the Newsroom, open Streams Editor at /newsroom/streams.
2) Select target: Published Article (by _id or slug) or Draft (by _id).
3) Upload files via existing /api/media/upload (or paste URLs).
4) Reorder assets (top = first in Streams). For videos, set a poster.
5) Click Save mediaAssets.

> If you attach to a Draft and then publish, ensure your publish pipeline copies mediaAssets to the Article. If not yet wired, attach directly to the published Article after publishing.
