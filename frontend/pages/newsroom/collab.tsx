import NewsroomLayout from '@/components/Newsroom/NewsroomLayout';
import type { GetServerSideProps } from 'next';
import { requireAuthSSR } from '@/lib/user-guard';
import { useEffect, useState } from 'react';

export const getServerSideProps: GetServerSideProps = (ctx) => requireAuthSSR(ctx as any);

export default function CollabPage(){
  const [tab, setTab] = useState<'network'|'mine'>('network');
  const [mine, setMine] = useState<any[]>([]);
  const [network, setNetwork] = useState<any[]>([]);
  useEffect(()=>{ (async()=>{
    const r = await fetch('/api/newsroom/collab/list'); const d = await r.json();
    setMine(d.myShared||[]); setNetwork(d.network||[]);
  })(); },[]);
  return (
    <NewsroomLayout>
      <h1 className="text-2xl font-semibold mb-4">Collaboration</h1>
      <div className="text-sm text-gray-600 mb-3">Share a draft from the Publisher to invite help. Network-visible drafts appear here.</div>
      <div className="flex items-center gap-2 mb-3">
        <button className={`px-3 py-1 rounded border ${tab==='network'?'bg-gray-50':''}`} onClick={()=>setTab('network')}>Network drafts</button>
        <button className={`px-3 py-1 rounded border ${tab==='mine'?'bg-gray-50':''}`} onClick={()=>setTab('mine')}>My shared drafts</button>
      </div>
      <ul className="divide-y rounded-xl border">
        {(tab==='network' ? network : mine).map((it:any, i:number)=>(
          <li key={i} className="p-4">
            <div className="font-medium">{it.title || 'Untitled'}</div>
            <div className="text-xs text-gray-500">
              {it.authorEmail ? <span className="mr-2">{it.authorEmail}</span> : null}
              updated {new Date(it.updatedAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </NewsroomLayout>
  );
}

