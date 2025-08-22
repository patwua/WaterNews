import { useEffect, useMemo, useState } from 'react';
import NewsroomLayout from '@/components/Newsroom/NewsroomLayout';
import Toast from '@/components/Toast';
import { SkeletonMediaGrid } from '@/components/UX/Skeleton';
import Link from 'next/link';

export default function MediaHub() {
  const [items, setItems] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [searching, setSearching] = useState(false);
  const [toast, setToast] = useState<{ type: 'success'|'error', msg: string }|null>(null);
  const [loading, setLoading] = useState(true);
  const [staged, setStaged] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const draftId = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return new URL(window.location.href).searchParams.get('draftId') || '';
  }, []);

  useEffect(()=>{ (async()=>{ await loadRecent(); setLoading(false); })(); },[]);
  useEffect(()=>{ try{ const s = JSON.parse(localStorage.getItem('wn_media_staged')||'[]'); setStaged(s);}catch{} },[]);
  function saveStaged(next:any[]){ setStaged(next); try{ localStorage.setItem('wn_media_staged', JSON.stringify(next)); }catch{} }
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
  async function onLocalPick(file: File){
    const url = URL.createObjectURL(file);
    const item = { local: true, url, name: file.name, file };
    const next = [item, ...staged]; saveStaged(next);
  }
  async function makePublic(idx:number){
    const it = staged[idx]; if (!it?.file) return;
    setUploading(true);
    try{
      const dataUrl = await toDataUrl(it.file);
      const r = await fetch('/api/media/upload', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ dataUrl, folder:'waternews' })});
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || 'Upload failed');
      const asset = d.asset;
      const newItem = { ...asset, secure_url: asset.secure_url || asset.url };
      const next = [...staged]; next.splice(idx,1); saveStaged(next);
      setItems([newItem, ...items]);
      setToast({ type:'success', msg:'Uploaded to library' });
    } catch(e:any){ setToast({ type:'error', msg: e.message || 'Upload failed' }); }
    finally{ setUploading(false); }
  }
  function toDataUrl(f: File){ return new Promise<string>((res,rej)=>{ const rd=new FileReader(); rd.onload=()=>res(String(rd.result)); rd.onerror=rej; rd.readAsDataURL(f); }); }
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
        Pick or upload images/videos. Recent picks show first; Cloudinary is queried when you search.
        {draftId ? <span className="ml-2 text-sky-700">Click any tile to insert into your draft.</span> : null}
      </p>
      <div className="border rounded-xl p-3 mb-4 bg-white">
        <div className="font-medium mb-2">Upload</div>
        <div className="flex items-center gap-3">
          <input type="file" onChange={e=> e.target.files?.[0] && onLocalPick(e.target.files[0])} />
          <span className="text-xs text-gray-600">Files are staged privately. “Make public” uploads to Cloudinary.</span>
        </div>
        {staged.length ? (
          <div className="mt-3">
            <div className="text-sm text-gray-600 mb-1">Staged (private)</div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {staged.map((it:any, i:number)=>(
                <div key={i} className="border rounded overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.url} className="w-full h-32 object-cover" alt=""/>
                  <div className="p-2 flex items-center justify-between text-xs">
                    <button className="underline" onClick={()=> draftId ? attachToDraft({ url: it.url }) : null}>Add to draft</button>
                    <button className="underline" onClick={()=> makePublic(i)} disabled={uploading}>Make public</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
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
      <div className="flex items-center justify-between mt-4">
        {draftId ? <Link className="underline" href={`/newsroom/drafts/${encodeURIComponent(draftId)}`}>Return to editor</Link> : <span />}
        {toast ? <div className="fixed bottom-4 right-4 z-50"><Toast type={toast.type} message={toast.msg} onDone={()=>setToast(null)} /></div> : null}
      </div>
    </NewsroomLayout>
  );
}

