import { useMemo, useRef, useState } from "react";

type MediaAsset = {
  type: 'image' | 'video';
  url?: string;
  publicId?: string;
  poster?: string;
  width?: number;
  height?: number;
  duration?: number;
  provider?: 'cloudinary' | 'static' | 'other';
};

type TargetKind = 'article' | 'draft';

export default function StreamsEditor() {
  const [targetKind, setTargetKind] = useState<TargetKind>('article');
  const [targetId, setTargetId] = useState('');
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const uploadRef = useRef<HTMLInputElement>(null);

  async function resolveSlugToArticleId(s: string) {
    try {
      const r = await fetch(`/api/news/posts/${encodeURIComponent(s)}`);
      if (!r.ok) return null;
      const data = await r.json();
      const post = data?.post || data;
      if (post?._id) {
        return { id: post._id as string, title: post.title as string };
      }
    } catch {}
    return null;
  }

  async function load() {
    setLoading(true);
    try {
      if (slug && targetKind === 'article' && !targetId) {
        const hit = await resolveSlugToArticleId(slug);
        if (hit?.id) {
          setTargetId(hit.id);
          setTitle(hit.title || '');
        }
      }
      if (!targetId) return;
      const url =
        targetKind === 'article'
          ? `/api/newsroom/articles/${encodeURIComponent(targetId)}/media-assets`
          : `/api/newsroom/drafts/${encodeURIComponent(targetId)}/media-assets`;
      const r = await fetch(url);
      if (!r.ok) return;
      const data = await r.json();
      const node = data?.article || data?.draft;
      setTitle(node?.title || title);
      setAssets(Array.isArray(node?.mediaAssets) ? node.mediaAssets : []);
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!targetId) return;
    setSaving(true);
    try {
      const url =
        targetKind === 'article'
          ? `/api/newsroom/articles/${encodeURIComponent(targetId)}/media-assets`
          : `/api/newsroom/drafts/${encodeURIComponent(targetId)}/media-assets`;
      const r = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaAssets: assets }),
      });
      if (!r.ok) throw new Error('save_failed');
    } catch (e) {
      console.error(e);
      alert('Failed to save media assets.');
    } finally {
      setSaving(false);
    }
  }

  function addFromUrl(url: string, typeHint?: 'image' | 'video') {
    const type =
      typeHint ||
      (/\.mp4|\.webm|\.m3u8/i.test(url) ? 'video' : 'image');
    setAssets((prev) => prev.concat([{ type, url, provider: 'static' }]));
  }

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append('file', file);
      try {
        const r = await fetch('/api/media/upload', { method: 'POST', body: fd });
        if (!r.ok) throw new Error('upload_failed');
        const data = await r.json();
        const url = data?.url || data?.secure_url;
        const guessedType: 'image' | 'video' =
          data?.type === 'video' || /video/.test(file.type) || /\.mp4|\.webm|\.m3u8/i.test(url) ? 'video' : 'image';
        if (url) {
          setAssets((prev) =>
            prev.concat([{ type: guessedType, url, provider: 'cloudinary' }])
          );
        }
      } catch (e) {
        console.error(e);
        alert(`Failed to upload ${file.name}`);
      }
    }
  }

  function move(idx: number, dir: -1 | 1) {
    setAssets((prev) => {
      const next = prev.slice();
      const ni = idx + dir;
      if (ni < 0 || ni >= next.length) return prev;
      const t = next[idx];
      next[idx] = next[ni];
      next[ni] = t;
      return next;
    });
  }

  function removeAt(idx: number) {
    setAssets((prev) => prev.filter((_, i) => i !== idx));
  }

  function setPoster(idx: number, posterUrl: string) {
    setAssets((prev) => {
      const next = prev.slice();
      const cur = { ...next[idx], poster: posterUrl };
      next[idx] = cur;
      return next;
    });
  }

  const posterOptions = useMemo(
    () => assets.filter((a) => a.type === 'image').map((a) => a.url).filter(Boolean) as string[],
    [assets]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-end gap-3 flex-wrap">
        <div>
          <label className="block text-xs uppercase text-gray-500 mb-1">Target</label>
          <select
            className="border rounded px-3 py-2"
            value={targetKind}
            onChange={(e) => setTargetKind(e.target.value as TargetKind)}
          >
            <option value="article">Published Article</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase text-gray-500 mb-1">{targetKind === 'article' ? 'Article ID' : 'Draft ID'}</label>
          <input
            className="border rounded px-3 py-2 w-72"
            placeholder={targetKind === 'article' ? 'Mongo _id (or use slug below)' : 'Mongo _id'}
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
          />
        </div>
        {targetKind === 'article' && (
          <div>
            <label className="block text-xs uppercase text-gray-500 mb-1">Or Article Slug</label>
            <input
              className="border rounded px-3 py-2 w-72"
              placeholder="e.g. news/guyana-wins-title"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
        )}
        <button
          onClick={load}
          disabled={loading}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'Loading…' : 'Load'}
        </button>
        <div className="ml-auto text-sm text-gray-500">{title ? `Editing: ${title}` : ''}</div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <input
              ref={uploadRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
            />
            <button
              onClick={() => uploadRef.current?.click()}
              className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200"
            >
              Upload file(s)
            </button>
            <UrlAdder onAdd={addFromUrl} />
          </div>

          <ul className="space-y-3">
            {assets.map((a, i) => (
              <li key={i} className="border rounded p-3 bg-white shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-1 rounded bg-gray-100">{a.type}</span>
                  <code className="text-xs break-all flex-1">{a.url || a.publicId}</code>
                  <button className="text-sm px-2 py-1 rounded bg-gray-100 hover:bg-gray-200" onClick={() => move(i, -1)}>↑</button>
                  <button className="text-sm px-2 py-1 rounded bg-gray-100 hover:bg-gray-200" onClick={() => move(i, +1)}>↓</button>
                  <button className="text-sm px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100" onClick={() => removeAt(i)}>Remove</button>
                </div>
                {a.type === 'video' && (
                  <div className="mt-2 flex items-center gap-2">
                    <label className="text-sm text-gray-600">Poster:</label>
                    <input
                      className="border rounded px-2 py-1 w-80"
                      placeholder="https://..."
                      value={a.poster || ''}
                      onChange={(e) => setPoster(i, e.target.value)}
                    />
                    {posterOptions.length > 0 && (
                      <select
                        className="border rounded px-2 py-1"
                        onChange={(e) => setPoster(i, e.target.value)}
                        defaultValue=""
                      >
                        <option value="" disabled>Use image from list…</option>
                        {posterOptions.map((u, idx) => (
                          <option key={`${u}-${idx}`} value={u}>{u}</option>
                        ))}
                      </select>
                    )}
                  </div>
                )}
                <Preview asset={a} />
              </li>
            ))}
            {assets.length === 0 && (
              <li className="border border-dashed rounded p-6 text-gray-500 text-sm">
                No media yet. Upload files or paste URLs to start building Streams for this {targetKind}.
              </li>
            )}
          </ul>
        </div>
        <div className="space-y-3">
          <div className="p-3 border rounded bg-white">
            <div className="text-sm font-semibold mb-2">Guidelines</div>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              <li>Images: JPG/PNG/WebP; Videos: MP4/WebM/M3U8.</li>
              <li>First items appear first in Streams; reorder as needed.</li>
              <li>For videos, set a <em>Poster</em> image for smoother loading.</li>
              <li>You can mix images and videos per story.</li>
            </ul>
          </div>
          <button
            onClick={save}
            disabled={saving || !targetId}
            className="w-full px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save mediaAssets'}
          </button>
        </div>
      </div>
    </div>
  );
}

function UrlAdder({ onAdd }: { onAdd: (url: string, typeHint?: 'image' | 'video') => void }) {
  const [url, setUrl] = useState('');
  return (
    <div className="flex items-center gap-2">
      <input
        className="border rounded px-3 py-2 w-80"
        placeholder="Paste an image/video URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && url) {
            onAdd(url);
            setUrl('');
          }
        }}
      />
      <button
        className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200"
        onClick={() => {
          if (!url) return;
          onAdd(url);
          setUrl('');
        }}
      >
        Add URL
      </button>
    </div>
  );
}

function Preview({ asset }: { asset: MediaAsset }) {
  const u = asset.url || '';
  if (asset.type === 'video') {
    return (
      <div className="mt-3">
        <video
          className="w-full max-h-96 rounded border"
          src={u}
          poster={asset.poster}
          controls
          playsInline
        />
      </div>
    );
  }
  return (
    <div className="mt-3 relative w-full h-64">
      <img src={u} alt="" className="w-full h-full object-contain border rounded" />
    </div>
  );
}

