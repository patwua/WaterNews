import { useEffect, useMemo, useRef, useState } from 'react';
import type { GetServerSideProps } from 'next';
import { requireAuthSSR } from '@/lib/user-guard';
import MediaLibraryModal from '@/components/MediaLibraryModal';
import StatusPill from '@/components/StatusPill';
import NewsroomLayout from '@/components/Newsroom/NewsroomLayout';

export const getServerSideProps: GetServerSideProps = (ctx) => requireAuthSSR(ctx);

export default function WriterDraftEditor() {
  const id = useMemo(() => (typeof window !== 'undefined' ? location.pathname.split('/').pop() : ''), []);
  const [doc, setDoc] = useState<any>(null);
  const [saving, setSaving] = useState<'idle' | 'dirty' | 'saving' | 'saved'>('idle');
  const [openMedia, setOpenMedia] = useState(false);
  const timer = useRef<any>(null);
  const localKey = useMemo(() => `wn_user_draft_${id}`, [id]);

  useEffect(() => {
    (async () => {
      const r = await fetch(`/api/newsroom/drafts/${id}`);
      const d = await r.json();
      setDoc(d);
      const local = localStorage.getItem(localKey);
      if (local) {
        try {
          const parsed = JSON.parse(local);
          if (parsed.updatedAt && new Date(parsed.updatedAt) > new Date(d.updatedAt)) {
            setDoc(parsed);
          }
        } catch {}
      }
    })();
  }, [id, localKey]);

  function queueSave(next: any) {
    setDoc(next);
    setSaving('dirty');
    localStorage.setItem(localKey, JSON.stringify(next));
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setSaving('saving');
      const r = await fetch(`/api/newsroom/drafts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      });
      const d = await r.json();
      setDoc(d);
      setSaving('saved');
      setTimeout(() => setSaving('idle'), 1000);
      localStorage.removeItem(localKey);
    }, 600);
  }

  if (!doc) return <div className="p-4">Loading…</div>;

  return (
    <NewsroomLayout active="publisher">
      <div className="max-w-5xl mx-auto p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 flex items-center gap-3">
            <StatusPill status={doc.status} />
            <span>
              {saving === 'saving'
              ? 'Saving…'
              : saving === 'saved'
              ? 'Saved'
              : saving === 'dirty'
              ? 'Unsaved changes'
              : 'Idle'}
          </span>
        </div>
        <div className="flex gap-2">
          <input
            type="datetime-local"
            value={doc.publishAt || ''}
            onChange={(e) =>
              queueSave({
                ...doc,
                publishAt: e.target.value || null,
                status: e.target.value ? 'scheduled' : (doc.status || 'draft'),
              })
            }
            className="border rounded px-2 py-1 text-sm"
          />
          <select
            className="border rounded px-2 py-1 text-sm"
            value={doc.status || 'draft'}
            onChange={(e) => queueSave({ ...doc, status: e.target.value })}
          >
            <option value="draft">Draft</option>
            <option value="ready">Ready</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>
          <button
            onClick={async () => {
              const r = await fetch(`/api/newsroom/drafts/${id}/submit`, { method: 'POST' });
              const d = await r.json();
              if (!r.ok) return alert(d?.error || 'Failed to submit for review');
              setDoc(d.draft || doc);
              alert('Submitted for review');
            }}
            className="px-3 py-2 rounded bg-gray-100 text-sm"
          >
            Submit for review
          </button>
          <button
            onClick={async () => {
              if (!confirm('Publish now? (Admins only)')) return;
              const r = await fetch(`/api/newsroom/drafts/${id}/publish`, { method: 'POST' });
              const d = await r.json();
              if (!r.ok) return alert(d?.error || 'Failed to publish');
              alert('Published');
              location.href = `/news/${d?.post?.slug}`;
            }}
            className="px-3 py-2 rounded bg-black text-white text-sm"
          >
            Publish now
          </button>
        </div>
      </div>

      <input
        className="w-full text-2xl font-semibold border-b outline-none pb-2"
        placeholder="Headline…"
        value={doc.title || ''}
        onChange={(e) => queueSave({ ...doc, title: e.target.value })}
      />

      <textarea
        className="w-full h-[50vh] border rounded p-3 leading-7"
        placeholder="Write your story…"
        value={doc.body || ''}
        onChange={(e) => queueSave({ ...doc, body: e.target.value })}
      />

      <div className="flex flex-wrap items-center gap-2">
        <input
          className="border rounded px-2 py-1 text-sm"
          placeholder="Comma, tags"
          value={(doc.tags || []).join(',')}
          onChange={(e) =>
            queueSave({
              ...doc,
              tags: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
            })
          }
        />
        <button className="px-3 py-2 rounded bg-gray-100" onClick={() => setOpenMedia(true)}>
          Insert Media
        </button>
      </div>

      {!!(doc.media?.length) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {doc.media.map((m: any) => (
            <div key={m.public_id} className="border rounded overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.secure_url || m.url} alt={m.public_id} className="w-full h-32 object-cover" />
              <div className="text-xs p-2 truncate">{m.public_id}</div>
            </div>
          ))}
        </div>
      )}

      <MediaLibraryModal
        open={openMedia}
        onClose={() => setOpenMedia(false)}
        onSelect={(asset: any) => {
          const media = [
            ...(doc.media || []),
            { public_id: asset.public_id, url: asset.url, secure_url: asset.secure_url },
          ];
          queueSave({ ...doc, media });
        }}
      />
        <div className="pt-6">
        <a href="/newsroom/posts" className="text-sm underline underline-offset-4">See my published posts →</a>
      </div>
      </div>
    </NewsroomLayout>
  );
}

