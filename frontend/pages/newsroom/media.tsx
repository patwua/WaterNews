import type { GetServerSideProps } from 'next';
import { requireAuthSSR } from '@/lib/user-guard';
import NewsroomLayout from '@/components/Newsroom/NewsroomLayout';
import { useEffect, useState } from 'react';

export const getServerSideProps: GetServerSideProps = (ctx) => requireAuthSSR(ctx as any);

export default function MediaHub() {
  const [items, setItems] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [searching, setSearching] = useState(false);
  useEffect(()=>{ loadRecent(); },[]);
  async function loadRecent(){
    const r = await fetch('/api/newsroom/media/recent'); const d = await r.json();
    setItems(d.items || []);
  }
  async function search(e: React.FormEvent){
    e.preventDefault();
    setSearching(true);
    try{
      const r = await fetch(`/api/media/list?search=${encodeURIComponent(q)}`);
      const d = await r.json();
      setItems(d.items || d.assets || []);
    } finally { setSearching(false); }
  }
  return (
    <NewsroomLayout>
      <h1 className="text-2xl font-semibold mb-4">Media Library</h1>
      <p className="text-sm text-gray-600 mb-3">Search images/videos. We’ll show recent picks first — Cloudinary is only queried when you search.</p>
      <form onSubmit={search} className="flex gap-2 mb-4">
        <input value={q} onChange={e=>setQ(e.target.value)} className="border rounded px-3 py-2 flex-1" placeholder="Search library…" />
        <button className="px-3 py-2 rounded bg-black text-white text-sm" disabled={!q.trim() || searching}>{searching?'Searching…':'Search'}</button>
      </form>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {items.map((it:any, i:number)=>(
          <figure key={it.public_id || it.secure_url || it.url || i} className="border rounded overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.secure_url || it.url || it.thumb || '/placeholders/newsroom.svg'} alt="" className="w-full h-32 object-cover"/>
          </figure>
        ))}
      </div>
    </NewsroomLayout>
  );
}
