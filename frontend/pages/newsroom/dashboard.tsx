import type { GetServerSideProps } from 'next';
import { requireAuthSSR } from '@/lib/user-guard';
import NewsroomLayout from '@/components/Newsroom/NewsroomLayout';
import StatsCards from '@/components/Newsroom/StatsCards';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export const getServerSideProps: GetServerSideProps = (ctx) => requireAuthSSR(ctx as any);

export default function NewsroomDashboard() {
  const [stats, setStats] = useState<any>(null);
  useEffect(()=>{ (async()=>{ const r=await fetch('/api/newsroom/stats'); setStats(r.ok? await r.json(): {}); })(); },[]);
  return (
    <NewsroomLayout active="dashboard">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <StatsCards data={stats} />
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Card title="Create a new publication" href="/newsroom?new=1" />
        <Card title="See my drafts" href="/newsroom" />
        <Card title="View my posts" href="/newsroom/posts" />
      </div>
    </NewsroomLayout>
  );
}

function Card({ title, href }: { title: string; href: string }) {
  return (
    <Link href={href} className="border rounded-xl p-4 hover:shadow block">
      <div className="font-medium">{title}</div>
      <div className="text-sm text-gray-600 mt-1">Jump right in.</div>
    </Link>
  );
}
