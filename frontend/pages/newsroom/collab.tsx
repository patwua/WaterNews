import type { GetServerSideProps } from 'next';
import { requireAuthSSR } from '@/lib/user-guard';
import NewsroomLayout from '@/components/Newsroom/NewsroomLayout';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export const getServerSideProps: GetServerSideProps = (ctx) => requireAuthSSR(ctx as any);

export default function CollabHub() {
  const [mine, setMine] = useState<any[]>([]);
  const [network, setNetwork] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ void load(); },[]);
  async function load() {
    setLoading(true);
    const [a,b] = await Promise.all([
      fetch('/api/newsroom/drafts').then(r=>r.json()), // author-scoped
      fetch('/api/newsroom/drafts?q=visibility:network').then(r=>r.json()).catch(()=>({items:[]}))
    ]);
    setMine(a?.items || a?.drafts || []); // accommodate your endpoint shape
    setNetwork(b?.items || b?.drafts || []);
    setLoading(false);
  }
  async function setVisibility(id:string, v:'private'|'network') {
    const r = await fetch('/api/newsroom/collab/toggle-visibility', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id, visibility: v })});
    if (r.ok) await load();
  }
  async function offerHelp(id:string) {
    const r = await fetch('/api/newsroom/collab/assist', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id })});
    if (r.ok) { alert('Offered to help'); await load(); }
  }
  return (
    <NewsroomLayout active="collab">
      <h1 className="text-2xl font-semibold mb-4">Collaboration</h1>
      <section className="mb-8">
        <h2 className="font-medium mb-2">My drafts</h2>
        {loading ? 'Loading…' : (
          <ul className="divide-y border rounded-xl">
            {mine.map((d:any)=>(
              <li key={d._id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{d.title || 'Untitled'}</div>
                  <div className="text-xs text-gray-500">Visibility: {d.visibility || 'private'}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Link className="text-blue-600 underline text-sm" href={`/newsroom/drafts/${d._id}`}>Open</Link>
                  <select className="border rounded px-2 py-1 text-sm" value={d.visibility || 'private'} onChange={e=>setVisibility(d._id, e.target.value as any)}>
                    <option value="private">Private</option>
                    <option value="network">Network</option>
                  </select>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h2 className="font-medium mb-2">Network drafts (open for collaboration)</h2>
        {loading ? 'Loading…' : (
          <ul className="divide-y border rounded-xl">
            {network.map((d:any)=>(
              <li key={d._id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{d.title || 'Untitled'}</div>
                  <div className="text-xs text-gray-500">Author: {d.authorEmail}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Link className="text-blue-600 underline text-sm" href={`/newsroom/drafts/${d._id}`}>Preview</Link>
                  <button className="px-3 py-1 border rounded text-sm" onClick={()=>offerHelp(d._id)}>Offer help</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </NewsroomLayout>
  );
}
