import type { GetServerSideProps } from 'next';
import { requireAuthSSR } from '@/lib/user-guard';
import NewsroomLayout from '@/components/Newsroom/NewsroomLayout';
import { useEffect, useState } from 'react';
import { SkeletonTiles } from '@/components/UX/Skeleton';

export const getServerSideProps: GetServerSideProps = (ctx) => requireAuthSSR(ctx as any);

export default function NoticeBoard(){
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [val, setVal] = useState('');
  useEffect(()=>{ (async()=>{
    const r = await fetch('/api/newsroom/notice'); const d = await r.json();
    setItems(d.items||[]); setLoading(false);
    await fetch('/api/newsroom/notice/seen', { method:'POST' });
  })(); },[]);
  async function post(){
    if (!val.trim()) return;
    const r = await fetch('/api/newsroom/notice', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ body: val }) });
    const d = await r.json(); if (r.ok && d?.item) { setItems([d.item, ...items]); setVal(''); }
  }
  return (
    <NewsroomLayout>
      <h1 className="text-2xl font-semibold mb-4">Notice Board</h1>
      <div className="gradient-card border rounded-xl p-4 mb-4">
        <div className="font-medium mb-1">Post a notice</div>
        <textarea className="w-full border rounded px-3 py-2 min-h-[90px]" placeholder="Share a note with the newsroom…" value={val} onChange={e=>setVal(e.target.value)} />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-gray-600">Use this space for platform updates & collaboration asks.</span>
          <button className="px-3 py-2 rounded bg-black text-white text-sm" onClick={post}>Post notice</button>
        </div>
      </div>
      {loading ? <SkeletonTiles rows={6} /> : (
        <ul className="grid md:grid-cols-2 gap-4">
          {items.map((it:any)=>(
            <li key={String(it._id)} className="border rounded-xl p-4 bg-white">
              <div className="text-xs text-gray-500">{it.authorEmail} • {new Date(it.createdAt).toLocaleString()}</div>
              <div className="mt-1 whitespace-pre-wrap">{it.body}</div>
            </li>
          ))}
        </ul>
      )}
    </NewsroomLayout>
  );
}

