import { useEffect, useState } from 'react';
import type { GetServerSideProps } from 'next';
import { requireAdminSSR } from '@/lib/admin-guard';
import DashboardLayout from '@/components/UX/DashboardLayout';
import KPI from '@/components/UX/KPI';

export const getServerSideProps: GetServerSideProps = (ctx) => requireAdminSSR(ctx as any);

export default function ModerationDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [work, setWork] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [a, b] = await Promise.all([
          fetch('/api/moderation/stats').then(r => r.json()),
          fetch('/api/moderation/workload').then(r => r.json()),
        ]);
        if (!mounted) return;
        setStats(a); setWork(b);
      } catch (e: any) {
        setErr(e?.message || 'Failed to load');
      } finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="p-6">Loading…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;

  return (
    <DashboardLayout title="Moderation Dashboard">
      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPI title="Pending" value={stats?.pending ?? 0} />
        <KPI title="Ready" value={stats?.ready ?? 0} />
        <KPI title="Needs 2nd" value={stats?.needs_second_review ?? 0} />
        <KPI title="Changes" value={stats?.changes_requested ?? 0} />
        <KPI title="Scheduled" value={stats?.scheduled ?? 0} />
        <KPI title="Published (24h)" value={stats?.published_24h ?? 0} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-xl p-4">
          <div className="font-medium mb-2">Avg pending age</div>
          <div className="text-3xl">{stats?.avg_pending_hours ?? 0} <span className="text-base text-gray-500">hours</span></div>
          <div className="text-xs text-gray-500 mt-1">as of {new Date(stats?.asOf || Date.now()).toLocaleString()}</div>
        </div>
        <div className="border rounded-xl p-4">
          <div className="font-medium mb-2">Reviewer workload</div>
          <SimpleTable rows={work?.reviewer || []} />
        </div>
      </div>
      <div className="border rounded-xl p-4">
        <div className="font-medium mb-2">Editor workload</div>
        <SimpleTable rows={work?.editor || []} />
      </div>
    </DashboardLayout>
  );
}

function SimpleTable({ rows }: { rows: Array<{ email: string; count: number }> }) {
  if (!rows || rows.length === 0) return <div className="text-sm text-gray-600">No data.</div>;
  return (
    <table className="w-full text-sm">
      <thead className="text-left bg-gray-50">
        <tr>
          <th className="p-2">User</th>
          <th className="p-2">Count</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.email} className="border-t">
            <td className="p-2">{r.email}</td>
            <td className="p-2">{r.count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
