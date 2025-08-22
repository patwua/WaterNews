import type { GetServerSideProps } from 'next';
import { requireAuthSSR } from '@/lib/user-guard';
import NewsroomLayout from '@/components/Newsroom/NewsroomLayout';
import StatsCards from '@/components/Newsroom/StatsCards';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SkeletonCardGrid } from '@/components/UX/Skeleton';

export const getServerSideProps: GetServerSideProps = (ctx) => requireAuthSSR(ctx as any);

export default function NewsroomDashboard() {
  const [stats, setStats] = useState<any>(null);
  useEffect(()=>{ (async()=>{ const r=await fetch('/api/newsroom/stats'); setStats(r.ok? await r.json(): {}); })(); },[]);
  return (
    <NewsroomLayout>
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      {stats ? <StatsCards data={stats} /> : <SkeletonCardGrid count={4} />}
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card title="Create a new publication" href="#" cta onClick={createNewDraft} />
        <Card title="New Notice" href="/newsroom/notice-board" />
        <Card title="See my drafts" href="/newsroom" />
        <Card title="View my posts" href="/newsroom/posts" />
        <Card title="Help (for members)" href="/newsroom/help" />
        <Card title="Invite a friend" href="/newsroom/invite" />
        <Card title="Contact support" href="/contact" />
      </div>
    </NewsroomLayout>
  );
}

function Card({ title, href, cta, onClick }: { title: string; href: string; cta?: boolean; onClick?: ()=>void }) {
  const Comp = cta ? 'button' : Link as any;
  const props = cta ? { onClick } : { href };
  return (
    <Comp {...props} className={`border rounded-xl p-4 hover:shadow block ${cta ? 'bg-black text-white text-left' : ''}`}>
      <div className="font-medium">{title}</div>
      <div className={`text-sm mt-1 ${cta ? 'text-white/80' : 'text-gray-600'}`}>Jump right in.</div>
    </Comp>
  );
}

async function createNewDraft(){
  try{
    const r = await fetch('/api/newsroom/drafts', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title: 'Untitled draft' })});
    const d = await r.json();
    const id = d?.id || d?._id;
    if (id) location.href = `/newsroom/drafts/${id}`;
    else alert('Failed to create draft');
  }catch{ alert('Failed to create draft'); }
}
