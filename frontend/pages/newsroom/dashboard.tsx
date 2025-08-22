import type { GetServerSideProps } from 'next';
import { requireAuthSSR } from '@/lib/user-guard';
import NewsroomLayout from '@/components/Newsroom/NewsroomLayout';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SkeletonCardGrid } from '@/components/UX/Skeleton';

export const getServerSideProps: GetServerSideProps = (ctx) => requireAuthSSR(ctx as any);

export default function Dashboard(){
  const [stats, setStats] = useState<any>(null);
  useEffect(()=>{ (async()=>{ const r=await fetch('/api/newsroom/stats'); const d=await r.json(); setStats(d); })(); },[]);
  return (
    <NewsroomLayout>
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      {stats ? <HeroCards data={stats} /> : <SkeletonCardGrid count={4} />}
      <div className="mt-6 grid md:grid-cols-12 gap-4">
        <div className="md:col-span-8 space-y-4">
          <section className="gradient-card border rounded-xl p-4">
            <div className="font-medium mb-2">Your week at a glance</div>
            <MiniSpark data={stats?.trend||[]} />
          </section>
          <section className="border rounded-xl p-4">
            <div className="font-medium mb-2">Tips</div>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              <li>Use the <strong>slash menu</strong> in the editor for headings, quotes, and figures.</li>
              <li>Drop images/videos directly into the editor to upload and insert automatically.</li>
              <li>Share a draft from <em>Collaboration</em> to invite network feedback.</li>
            </ul>
          </section>
        </div>
        <aside className="md:col-span-4 space-y-3">
          <QuickCard title="Create a new publication" onClick={createNewDraft} />
          <QuickLink title="New Notice" href="/newsroom/notice-board" />
          <QuickLink title="See my drafts" href="/newsroom" />
          <QuickLink title="View my posts" href="/newsroom/posts" />
          <QuickLink title="Invite a friend" href="/newsroom/invite" />
          <QuickLink title="Help (for members)" href="/newsroom/help" />
        </aside>
      </div>
    </NewsroomLayout>
  );
}

function createNewDraft(){
  fetch('/api/newsroom/drafts', { method:'POST' }).then(r=>r.json()).then(d=>{ if(d?.id) location.href=`/newsroom/drafts/${d.id}`; });
}

function HeroCards({ data }: { data:any }){
  const cards = [
    { label:'Drafts', value: data?.counts?.drafts || 0, hint:'Unfinished work' },
    { label:'Scheduled', value: data?.counts?.scheduled || 0, hint:'Will auto-publish' },
    { label:'Views (7d)', value: data?.views7d || 0, hint:'Recent audience' },
    { label:'Notices', value: data?.noticeUnread || 0, hint:'Unread board items' },
  ];
  return (
    <div className="grid md:grid-cols-4 gap-4">
      {cards.map((c,i)=>(
        <div key={i} className="gradient-card border rounded-xl p-4">
          <div className="text-sm text-gray-600">{c.label}</div>
          <div className="text-2xl font-semibold">{c.value}</div>
          <div className="text-xs text-gray-500">{c.hint}</div>
        </div>
      ))}
    </div>
  );
}

function MiniSpark({ data=[] }: { data:number[] }){
  if (!data.length) data = [2,3,4,3,5,4,6];
  const max = Math.max(...data, 1);
  const pts = data.map((v,i)=> `${(i/(data.length-1))*100},${100 - (v/max)*100}`).join(' ');
  return (
    <svg viewBox="0 0 100 100" className="w-full h-24">
      <polyline fill="none" stroke="currentColor" strokeWidth="1" points={pts} />
    </svg>
  );
}

function QuickCard({ title, onClick }:{title:string; onClick:()=>void}){
  return <button onClick={onClick} className="w-full text-left border rounded-xl p-4 hover:bg-gray-50">{title}</button>;
}
function QuickLink({ title, href }:{title:string; href:string}){
  return <Link href={href} className="block border rounded-xl p-4 hover:bg-gray-50">{title}</Link>;
}

