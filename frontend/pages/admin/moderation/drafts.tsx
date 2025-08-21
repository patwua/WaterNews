import { useEffect, useMemo, useState } from 'react';
import type { GetServerSideProps } from 'next';
import { requireAdminSSR } from '@/lib/admin-guard';

export const getServerSideProps: GetServerSideProps = (ctx) => requireAdminSSR(ctx as any);

type DraftRow = {
  _id: string;
  title?: string;
  authorEmail?: string;
  status?: string;
  requireSecondReview?: boolean;
  reviewerEmail?: string;
  assigneeEmail?: string;
  updatedAt?: string;
  publishAt?: string | null;
};

export default function DraftModerationQueue() {
  const [rows, setRows] = useState<DraftRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<'ready'|'needs_second_review'|'changes_requested'>('ready');
  const [sel, setSel] = useState<Record<string, boolean>>({});
  const [note, setNote] = useState('');
  const [assignReviewer, setAssignReviewer] = useState('');
  const [assignEditor, setAssignEditor] = useState('');

  const selectedIds = useMemo(() => Object.keys(sel).filter(id => sel[id]), [sel]);
  const allSelected = useMemo(() => rows.length > 0 && selectedIds.length === rows.length, [rows, selectedIds]);

  useEffect(() => { void load(); }, [status]); // load on status change

  async function load() {
    try {
      setLoading(true); setError(null);
      const qs = new URLSearchParams({ status });
      if (q) qs.set('q', q);
      const r = await fetch('/api/moderation/drafts?' + qs.toString());
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || 'Failed to load');
      setRows(d.items || []);
      setSel({});
    } catch (e: any) {
      setError(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  async function bulk(action: string, extra: Record<string, any> = {}) {
    if (selectedIds.length === 0) return alert('Select at least one draft');
    const r = await fetch('/api/moderation/drafts/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedIds, action, ...extra })
    });
    const d = await r.json();
    if (!r.ok) return alert(d?.error || 'Action failed');
    setNote('');
    setAssignReviewer('');
    setAssignEditor('');
    await load();
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Draft Reviews</h1>
        <div className="flex items-center gap-2">
          <input className="border rounded px-3 py-2 text-sm" placeholder="Search title/author…" value={q} onChange={e=>setQ(e.target.value)} />
          <button className="text-sm px-3 py-2 border rounded" onClick={() => load()}>Search</button>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <select className="border rounded px-3 py-2 text-sm" value={status} onChange={e=>setStatus(e.target.value as any)}>
          <option value="ready">Ready</option>
          <option value="needs_second_review">Needs second review</option>
          <option value="changes_requested">Changes requested</option>
        </select>
        <div className="flex-1" />
        <button className="px-3 py-2 rounded bg-green-600 text-white text-sm" onClick={() => bulk('approve')}>Approve</button>
        <div className="flex items-center gap-2">
          <input className="border rounded px-2 py-1 text-sm" placeholder="Note to author…" value={note} onChange={e=>setNote(e.target.value)} />
          <button className="px-3 py-2 rounded bg-amber-600 text-white text-sm" onClick={() => bulk('request_changes', { note })}>Request changes</button>
        </div>
        <button className="px-3 py-2 rounded bg-purple-600 text-white text-sm" onClick={() => bulk('require_second_review', { on: true })}>Require 2nd review</button>
        <div className="flex items-center gap-2">
          <input className="border rounded px-2 py-1 text-sm" placeholder="Reviewer email" value={assignReviewer} onChange={e=>setAssignReviewer(e.target.value)} />
          <button className="px-3 py-2 rounded bg-blue-600 text-white text-sm" onClick={() => bulk('assign_reviewer', { reviewerEmail: assignReviewer })}>Assign reviewer</button>
        </div>
        <div className="flex items-center gap-2">
          <input className="border rounded px-2 py-1 text-sm" placeholder="Editor email" value={assignEditor} onChange={e=>setAssignEditor(e.target.value)} />
          <button className="px-3 py-2 rounded bg-gray-900 text-white text-sm" onClick={() => bulk('assign_editor', { assigneeEmail: assignEditor })}>Assign editor</button>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3 w-10">
                <input type="checkbox" checked={allSelected} onChange={e => {
                  const val = e.target.checked; const next: Record<string, boolean> = {};
                  if (val) rows.forEach(r => next[String(r._id)] = true);
                  setSel(val ? next : {});
                }} />
              </th>
              <th className="p-3">Title</th>
              <th className="p-3">Author</th>
              <th className="p-3">Reviewer</th>
              <th className="p-3">Editor</th>
              <th className="p-3">Status</th>
              <th className="p-3">Updated</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-4 text-gray-500" colSpan={7}>Loading…</td></tr>
            ) : error ? (
              <tr><td className="p-4 text-red-600" colSpan={7}>{error}</td></tr>
            ) : rows.length === 0 ? (
              <tr><td className="p-4 text-gray-600" colSpan={7}>No drafts found.</td></tr>
            ) : rows.map((r) => (
              <tr key={String(r._id)} className="border-t">
                <td className="p-3">
                  <input type="checkbox" checked={!!sel[String(r._id)]} onChange={e => setSel({ ...sel, [String(r._id)]: e.target.checked })} />
                </td>
                <td className="p-3">
                  <a href={`/admin/drafts/${r._id}`} className="font-medium hover:underline">{r.title || 'Untitled'}</a>
                  {r.publishAt && r.status === 'scheduled' ? (
                    <div className="text-xs text-gray-500">scheduled {new Date(r.publishAt).toLocaleString()}</div>
                  ) : null}
                </td>
                <td className="p-3">{r.authorEmail || '—'}</td>
                <td className="p-3">{r.reviewerEmail || '—'}</td>
                <td className="p-3">{r.assigneeEmail || '—'}</td>
                <td className="p-3 capitalize">{(r.status || 'draft').split('_').join(' ')}</td>
                <td className="p-3">{r.updatedAt ? new Date(r.updatedAt).toLocaleString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
