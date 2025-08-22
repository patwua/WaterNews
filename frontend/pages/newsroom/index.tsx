import Link from 'next/link';
import { useEffect, useState } from 'react';
import StatusPill from '@/components/StatusPill';
import NewsroomLayout from '@/components/Newsroom/NewsroomLayout';
import type { GetServerSideProps } from 'next';
import { requireAuthSSR } from '@/lib/user-guard';
import { SkeletonTiles } from '@/components/UX/Skeleton';

export const getServerSideProps: GetServerSideProps = (ctx) => requireAuthSSR(ctx as any);

export default function PublisherHub() {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const r = await fetch('/api/newsroom/drafts');
      const d = await r.json();
      setDrafts(d.items || d.drafts || []);
      setLoading(false);
    })();
  }, []);
  return (
    <NewsroomLayout>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold">Publisher</h1>
        <button onClick={createDraft} className="px-3 py-2 rounded bg-black text-white text-sm">New draft</button>
      </div>
      {loading ? <SkeletonTiles rows={8} /> : (
      <ul className="divide-y rounded-xl border">
        {drafts.map((it: any) => (
          <li key={it._id} className="flex items-center justify-between p-4">
            <div>
              <div className="font-medium flex items-center gap-2">
                {it.title || 'Untitled'} <StatusPill status={it.status} />
              </div>
              <div className="text-xs text-gray-500">
                {it.status === 'scheduled' && it.publishAt ? (
                  <>scheduled for {new Date(it.publishAt).toLocaleString()} • </>
                ) : null}
                updated {it.updatedAt ? new Date(it.updatedAt).toLocaleString() : '—'}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href={`/newsroom/drafts/${it._id}`} className="text-blue-600 hover:underline">Open</Link>
              <button onClick={()=>del(it._id)} className="text-sm text-red-600 underline">Delete</button>
            </div>
          </li>
        ))}
      </ul>
      )}
    </NewsroomLayout>
  );
}

async function createDraft(){
  try{
    const r = await fetch('/api/newsroom/drafts', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title: 'Untitled draft' })});
    const d = await r.json();
    const id = d?.id || d?._id;
    if (id) location.href = `/newsroom/drafts/${id}`;
    else alert('Failed to create draft');
  }catch{ alert('Failed to create draft'); }
}
async function del(id:string){
  if (!confirm('Delete this draft? This cannot be undone.')) return;
  const r = await fetch(`/api/newsroom/drafts/${encodeURIComponent(id)}/delete`, { method:'POST' });
  if (!r.ok) { const d = await r.json().catch(()=>({})); return alert(d?.error || 'Delete failed'); }
  location.reload();
}
