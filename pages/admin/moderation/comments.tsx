import { useEffect, useMemo, useState } from 'react';
import type { GetServerSideProps } from 'next';
import { requireAdminSSR } from '@/lib/admin-guard';

export const getServerSideProps: GetServerSideProps = (ctx) => requireAdminSSR(ctx as any);

export default function CommentsModeration() {
  const [rows, setRows] = useState<any[]>([]);
  const [status, setStatus] = useState<'pending'|'approved'|'rejected'>('pending');
  const [q, setQ] = useState('');
  const [sel, setSel] = useState<Record<string, boolean>>({});
  const ids = useMemo(() => Object.keys(sel).filter(id => sel[id]), [sel]);

  async function load() {
    const qs = new URLSearchParams({ status });
    if (q) qs.set('q', q);
    const r = await fetch('/api/moderation/comments?' + qs.toString());
    const d = await r.json();
    if (!r.ok) return alert(d?.error || 'Failed to load');
    setRows(d.items || []);
    setSel({});
  }
  useEffect(() => { void load(); }, [status]);

  async function bulk(action: string) {
    if (ids.length === 0) return alert('Select comments');
    const r = await fetch('/api/moderation/comments/bulk', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids, action })
    });
    const d = await r.json();
    if (!r.ok) return alert(d?.error || 'Action failed');
    await load();
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Comments Moderation</h1>
        <div className="flex items-center gap-2">
          <input className="border rounded px-3 py-2 text-sm" placeholder="Search text/email/slug…" value={q} onChange={e=>setQ(e.target.value)} />
          <button className="text-sm px-3 py-2 border rounded" onClick={()=>load()}>Search</button>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <select className="border rounded px-3 py-2 text-sm" value={status} onChange={e=>setStatus(e.target.value as any)}>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <div className="flex-1" />
        <button className="px-3 py-2 rounded bg-green-600 text-white text-sm" onClick={()=>bulk('approve')}>Approve</button>
        <button className="px-3 py-2 rounded bg-amber-600 text-white text-sm" onClick={()=>bulk('reject')}>Reject</button>
        <button className="px-3 py-2 rounded bg-red-700 text-white text-sm" onClick={()=>bulk('delete')}>Delete</button>
      </div>
      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3 w-10" />
              <th className="p-3">Post</th>
              <th className="p-3">Body</th>
              <th className="p-3">Author</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td className="p-4 text-gray-600" colSpan={6}>No comments.</td></tr>
            ) : rows.map((c) => (
              <tr key={String(c._id)} className="border-t">
                <td className="p-3">
                  <input type="checkbox" checked={!!sel[String(c._id)]} onChange={e=>setSel({ ...sel, [String(c._id)]: e.target.checked })} />
                </td>
                <td className="p-3">{c.postSlug}</td>
                <td className="p-3 max-w-xl"><span className="line-clamp-2">{c.body}</span></td>
                <td className="p-3">{c.authorEmail || 'anonymous'}</td>
                <td className="p-3">{c.status}</td>
                <td className="p-3">{c.createdAt ? new Date(c.createdAt).toLocaleString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
