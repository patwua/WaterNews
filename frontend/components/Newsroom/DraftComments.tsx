import { useEffect, useState } from 'react';

export default function DraftComments({ draftId }: { draftId: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [val, setVal] = useState('');
  const [busy, setBusy] = useState(false);

  async function load() {
    const r = await fetch(`/api/newsroom/drafts/${encodeURIComponent(draftId)}/comments`);
    const d = await r.json().catch(()=>({}));
    setItems(d.items || []);
  }
  useEffect(()=>{ load(); }, [draftId]);

  async function add() {
    if (!val.trim()) return;
    setBusy(true);
    try {
      const r = await fetch(`/api/newsroom/drafts/${encodeURIComponent(draftId)}/comments`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ body: val })
      });
      const d = await r.json();
      if (!r.ok) return alert(d?.error || 'Failed');
      setItems([d.comment, ...items]); setVal('');
    } finally { setBusy(false); }
  }

  async function resolve(id: string) {
    const r = await fetch(`/api/newsroom/drafts/${encodeURIComponent(draftId)}/comments/${encodeURIComponent(id)}`, {
      method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action: 'resolve' })
    });
    const d = await r.json().catch(()=>({}));
    if (!r.ok) return alert(d?.error || 'Failed');
    load();
  }
  async function remove(id: string) {
    if (!confirm('Delete this comment?')) return;
    const r = await fetch(`/api/newsroom/drafts/${encodeURIComponent(draftId)}/comments/${encodeURIComponent(id)}`, { method:'DELETE' });
    const d = await r.json().catch(()=>({}));
    if (!r.ok) return alert(d?.error || 'Failed');
    load();
  }

  return (
    <section className="mt-6 border rounded-xl p-4">
      <div className="font-medium mb-2">Comments</div>
      <div className="flex items-start gap-2 mb-3">
        <textarea className="flex-1 border rounded px-3 py-2 min-h-[70px]" placeholder="Leave feedback for this draft…" value={val} onChange={e=>setVal(e.target.value)} />
        <button className="px-3 py-2 rounded bg-black text-white text-sm disabled:opacity-50" onClick={add} disabled={busy || !val.trim()}>Post</button>
      </div>
      <ul className="space-y-3">
        {items.map((c: any)=>(
          <li key={String(c._id)} className="border rounded p-3">
            <div className="text-xs text-gray-600 mb-1">
              {c.authorEmail} • {new Date(c.createdAt).toLocaleString()} {c.resolved ? <span className="ml-2 text-green-700">resolved</span> : null}
            </div>
            <div className="text-sm whitespace-pre-wrap">{c.body}</div>
            <div className="mt-2 flex items-center gap-3 text-xs">
              {!c.resolved ? <button className="underline text-sky-700" onClick={()=>resolve(String(c._id))}>Resolve</button> : null}
              <button className="underline text-red-700" onClick={()=>remove(String(c._id))}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
