import type { GetServerSideProps } from 'next';
import { requireAuthSSR } from '@/lib/user-guard';
import NewsroomLayout from '@/components/Newsroom/NewsroomLayout';
import { useEffect, useState } from 'react';
import { SkeletonTiles } from '@/components/UX/Skeleton';

export const getServerSideProps: GetServerSideProps = (ctx) => requireAuthSSR(ctx as any);

export default function NoticeBoard() {
  const [items, setItems] = useState<any[]>([]);
  const [title, setTitle] = useState(''); const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ (async()=>{
    const r=await fetch('/api/newsroom/notice'); const d=await r.json(); setItems(d.items||[]);
    setLoading(false);
    // mark seen => clears badge
    fetch('/api/newsroom/notice/seen', { method:'POST' }).catch(()=>{});
  })(); },[]);
  async function post() {
    const r = await fetch('/api/newsroom/notice', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title, body }) });
    const d = await r.json(); if (!r.ok) return alert(d?.error || 'Failed');
    setItems([d.notice, ...items]); setTitle(''); setBody('');
  }
  return (
    <NewsroomLayout active="notice">
      <h1 className="text-2xl font-semibold mb-4">Notice Board</h1>
      <div className="border rounded-xl p-4 space-y-2 mb-6">
        <input className="w-full border rounded px-3 py-2" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea className="w-full border rounded px-3 py-2 min-h-[120px]" placeholder="Write a platform update, suggestion, or discussion topic…" value={body} onChange={e=>setBody(e.target.value)} />
        <div><button onClick={post} className="px-3 py-2 rounded bg-black text-white text-sm">Publish notice</button></div>
      </div>
      {loading ? <SkeletonTiles rows={6} /> : (
        <ul className="space-y-4">
          {items.map((n:any)=>(
            <li key={String(n._id)} className="border rounded-xl p-4">
              <div className="font-medium">{n.title}</div>
              <div className="text-xs text-gray-500 mb-2">{new Date(n.createdAt).toLocaleString()} • {n.authorEmail}</div>
              <div>{n.body}</div>
              <NoticeComments noticeId={String(n._id)} />
            </li>
          ))}
        </ul>
      )}
    </NewsroomLayout>
  );
}

function NoticeComments({ noticeId }: { noticeId: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [val, setVal] = useState('');
  useEffect(()=>{ (async()=>{ const r=await fetch(`/api/newsroom/notice/comments?id=${encodeURIComponent(noticeId)}`); const d=await r.json(); setItems(d.items||[]); })(); },[noticeId]);
  async function submit() {
    const r = await fetch('/api/newsroom/notice/comments', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id: noticeId, body: val }) });
    const d = await r.json(); if (!r.ok) return alert(d?.error||'Failed');
    setItems([d.comment, ...items]); setVal('');
  }
  return (
    <div className="mt-3 border-t pt-3">
      <div className="text-sm font-medium mb-2">Discussion</div>
      <div className="flex items-start gap-2">
        <textarea className="flex-1 border rounded px-3 py-2 min-h-[60px]" placeholder="Add a comment…" value={val} onChange={e=>setVal(e.target.value)} />
        <button className="px-3 py-2 rounded bg-black text-white text-sm" onClick={submit}>Post</button>
      </div>
      <ul className="mt-3 space-y-3">
        {items.map((c:any)=>(
          <li key={String(c._id)} className="text-sm">
            <div className="text-gray-600">{c.authorEmail} • {new Date(c.createdAt).toLocaleString()}</div>
            <div>{c.body}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
