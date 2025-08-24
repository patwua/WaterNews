import { useEffect, useMemo, useRef, useState } from 'react';
import type { GetServerSideProps } from 'next';
import { requireAuthSSR } from '@/lib/user-guard';
import StatusPill from '@/components/StatusPill';
import NewsroomLayout from '@/components/Newsroom/NewsroomLayout';
import Link from 'next/link';
import MarkdownEditor from '@/components/Newsroom/MarkdownEditor';
import DraftComments from '@/components/Newsroom/DraftComments';
import ActivityTrail from '@/components/Newsroom/ActivityTrail';
import RewriteChips from '@/components/Newsroom/RewriteChips';
import MarkdownPreview from '@/components/Newsroom/MarkdownPreview';

export const getServerSideProps: GetServerSideProps = (ctx) => requireAuthSSR(ctx);

export default function WriterDraftEditor() {
  const id = useMemo(() => (typeof window !== 'undefined' ? location.pathname.split('/').pop() : ''), []);
  const [doc, setDoc] = useState<any>(null);
  const [saving, setSaving] = useState<'idle' | 'dirty' | 'saving' | 'saved'>('idle');
  const timer = useRef<any>(null);
  const localKey = useMemo(() => `wn_user_draft_${id}`, [id]);
  const [tab, setTab] = useState<'edit'|'preview'>('edit');

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

  async function save(payload?: any) {
    const body = JSON.stringify(payload || doc);
    setSaving('saving');
    const r = await fetch(`/api/newsroom/drafts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    const d = await r.json();
    setDoc(d);
    setSaving('saved');
    setTimeout(() => setSaving('idle'), 1000);
    localStorage.removeItem(localKey);
  }

  function queueSave(next: any) {
    setDoc(next);
    setSaving('dirty');
    localStorage.setItem(localKey, JSON.stringify(next));
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => save(next), 600);
  }

  if (!doc) return <div className="p-4">Loading…</div>;

  return (
    <NewsroomLayout>
      <div className="max-w-3xl mx-auto space-y-4">
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
            <Link href={`/newsroom/media?draftId=${encodeURIComponent(id)}`} className="px-3 py-2 rounded border text-sm">Open Media Library</Link>
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
                  location.href = `/news/${d.slug}`;
              }}
              className="px-3 py-2 rounded bg-black text-white text-sm"
            >
              Publish now
            </button>
            <button
              className="px-3 py-2 rounded border text-sm"
              onClick={async () => {
                if (!confirm('Delete this draft? This cannot be undone.')) return;
                const r = await fetch(`/api/newsroom/drafts/${encodeURIComponent(id)}/delete`, { method: 'POST' });
                const d = await r.json().catch(() => ({}));
                if (!r.ok) return alert(d?.error || 'Delete failed');
                location.href = '/newsroom';
              }}
            >
              Delete
            </button>
          </div>
        </div>

        <input
          className="w-full text-2xl font-semibold border-b outline-none pb-2"
          placeholder="Headline…"
          value={doc.title || ''}
          onChange={(e) => queueSave({ ...doc, title: e.target.value })}
        />

        <div className="flex items-center gap-3 text-sm">
          <button className={`px-2 py-1 rounded border ${tab==='edit'?'bg-gray-50':''}`} onClick={()=>setTab('edit')}>Edit</button>
          <button className={`px-2 py-1 rounded border ${tab==='preview'?'bg-gray-50':''}`} onClick={()=>setTab('preview')}>Preview</button>
          <Link href="/newsroom/dashboard" className="ml-auto underline">Return to Dashboard</Link>
        </div>

        {tab==='edit' ? (
          <>
            <MarkdownEditor
              value={doc.body || ''}
              onChange={(v) => {
                const next = { ...doc, body: v };
                setDoc(next);
                setSaving('dirty');
                localStorage.setItem(localKey, JSON.stringify(next));
              }}
              onSave={() => save()}
              draftId={id as string}
              exposeAPI={(api)=> { (window as any).__editorAPI = api; (draftEditorApi as any).current = api; }}
            />
            {/* AI rewrite chips act on selection or whole text */}
            <RewriteChips
              getSelection={()=> (draftEditorApi as any).current?.getSelection?.() || {start:0,end:0,text:''}}
              replaceSelection={(t)=> (draftEditorApi as any).current?.replaceSelection?.(t)}
              getText={()=> (draftEditorApi as any).current?.getText?.() || (doc.body||'')}
              setText={(t)=> { (draftEditorApi as any).current?.setText?.(t); const next = { ...doc, body: t }; setDoc(next); setSaving('dirty'); localStorage.setItem(localKey, JSON.stringify(next)); }}
            />
          </>
        ) : (
          <div className="border rounded-xl p-4 bg-white">
            <MarkdownPreview text={doc.body || ''} />
          </div>
        )}

        <DraftComments draftId={id as string} />

        <PresenceStrip draftId={id as string} />
        <ActivityTrail draftId={id as string} />

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
        <div className="pt-6">
          <a href="/newsroom/posts" className="text-sm underline underline-offset-4">See my published posts →</a>
        </div>
      </div>
    </NewsroomLayout>
  );
}

function PresenceStrip({ draftId }: { draftId: string }) {
  const [who, setWho] = useState<any[]>([]);
  useEffect(()=> {
    let alive = true;
    const ping = async () => {
      try { await fetch(`/api/newsroom/drafts/${encodeURIComponent(draftId)}/presence`, { method:'POST' }); } catch {}
    };
    const load = async () => {
      try {
        const r = await fetch(`/api/newsroom/drafts/${encodeURIComponent(draftId)}/presence`);
        const d = await r.json(); if (alive) setWho(d.items||[]);
      } catch {}
    };
    ping(); load();
    const t1 = setInterval(ping, 25000);
    const t2 = setInterval(load, 25000);
    return ()=>{ alive=false; clearInterval(t1); clearInterval(t2); };
  }, [draftId]);
  if (!who.length) return null;
  return (
    <div className="text-xs text-gray-600 mt-2">
      Currently viewing: {who.map((p:any)=> p.name || p.email).join(', ')}
    </div>
  );
}


// Local ref to hold editor API (avoid TS type noise)
const draftEditorApi = { current: null as any };

