import type { GetServerSideProps } from 'next';
import { requireAuthSSR } from '@/lib/user-guard';
import NewsroomLayout from '@/components/Newsroom/NewsroomLayout';
import { useEffect, useMemo, useState } from 'react';
import Toast from '@/components/Toast';
import { SkeletonMediaGrid } from '@/components/UX/Skeleton';

export const getServerSideProps: GetServerSideProps = (ctx) => requireAuthSSR(ctx as any);

export default function MediaHub() {
  const [items, setItems] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [searching, setSearching] = useState(false);
  const [toast, setToast] = useState<{ type: 'success'|'error', msg: string }|null>(null);
  const [loading, setLoading] = useState(true);
  const draftId = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return new URL(window.location.href).searchParams.get('draftId') || '';
  }, []);

  useEffect(()=>{ (async()=>{ await loadRecent(); setLoading(false); })(); },[]);
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
  async function attachToDraft(asset: any){
    if (!draftId) return;
    const body = {
      url: asset.secure_url || asset.url,
      publicId: asset.public_id || null,
      width: asset.width || null,
      height: asset.height || null,
      mime: asset.resource_type || null
    };
    const r = await fetch(`/api/newsroom/drafts/${encodeURIComponent(draftId)}/attach`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)
    });
    const d = await r.json().catch(()=>({}));
    if (!r.ok) setToast({ type:'error', msg: d?.error || 'Failed to attach' });
    else setToast({ type:'success', msg: 'Added to draft' });
  }
  return (
    <NewsroomLayout>
      <h1 className="text-2xl font-semibold mb-2">Media Library</h1>
      <p className="text-sm text-gray-600 mb-3">
        Search images/videos. We show recent picks first — Cloudinary is queried when you search.
        {draftId ? <span className="ml-2 text-sky-700">Click any tile to insert into your draft.</span> : null}
      </p>
      <form onSubmit={search} className="flex gap-2 mb-4">
        <input value={q} onChange={e=>setQ(e.target.value)} className="border rounded px-3 py-2 flex-1" placeholder="Search library…" />
        <button className="px-3 py-2 rounded bg-black text-white text-sm" disabled={!q.trim() || searching}>{searching?'Searching…':'Search'}</button>
      </form>
      {loading ? <SkeletonMediaGrid /> : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {items.map((it:any, i:number)=>(
            <button
              key={it.public_id || it.secure_url || it.url || i}
              className="border rounded overflow-hidden group"
              onClick={()=> draftId ? attachToDraft(it) : null}
              title={draftId ? 'Insert into draft' : 'Media'}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.secure_url || it.url || it.thumb || '/placeholders/newsroom.svg'} alt="" className="w-full h-32 object-cover group-hover:opacity-90"/>
            </button>
          ))}
        </div>
      )}
      {toast ? <div className="fixed bottom-4 right-4 z-50"><Toast type={toast.type} message={toast.msg} onDone={()=>setToast(null)} /></div> : null}
    </NewsroomLayout>
  );
}
