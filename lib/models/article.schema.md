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
