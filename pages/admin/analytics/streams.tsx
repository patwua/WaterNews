import Head from 'next/head';
import useSWR from 'swr';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export async function getServerSideProps(ctx: any) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session) {
    return { redirect: { destination: '/login?next=/admin/analytics/streams', permanent: false } };
  }
  const admins = (process.env.ADMIN_EMAILS || '').split(',').map((s) => s.trim().toLowerCase());
  if (!admins.includes((session.user?.email || '').toLowerCase())) {
    return { notFound: true };
  }
  return { props: {} };
}

export default function StreamsAnalyticsPage() {
  const { data, error } = useSWR('/api/admin/analytics/streams?days=7', fetcher, { refreshInterval: 30000 });
  const rows: any[] = data?.rows || [];
  return (
    <>
      <Head>
        <title>Admin · Streams Analytics</title>
      </Head>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-1">Streams Analytics</h1>
        <p className="text-gray-600 mb-6">Views, dwell time, and completion (last 7 days).</p>
        {error && <div className="text-red-600">Failed to load.</div>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard label="Tracked slugs" value={rows.length} />
          <StatCard label="Top views" value={Math.max(0, ...rows.map((r) => r.views || 0))} />
          <StatCard label="Top completion" value={`${Math.round(Math.max(0, ...rows.map((r) => (r.completionRate || 0) * 100)))}%`} />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <Th>Slug</Th>
                <Th>Views</Th>
                <Th>Avg Dwell</Th>
                <Th>Plays</Th>
                <Th>Completes</Th>
                <Th>Completion</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.slug} className="border-b hover:bg-gray-50">
                  <Td><a className="text-blue-600 hover:underline" href={`/${r.slug}`}>{r.slug}</a></Td>
                  <Td>{r.views}</Td>
                  <Td>{formatMs(r.avgDwellMs)}</Td>
                  <Td>{r.plays}</Td>
                  <Td>{r.completes}</Td>
                  <Td>{Math.round((r.completionRate || 0) * 100)}%</Td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td className="py-6 text-center text-gray-500" colSpan={6}>No data yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="p-4 border rounded bg-white shadow-sm">
      <div className="text-xs uppercase text-gray-500">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}

function Th({ children }: { children: any }) {
  return <th className="py-2 pr-4 font-semibold">{children}</th>;
}
function Td({ children }: { children: any }) {
  return <td className="py-2 pr-4">{children}</td>;
}
function formatMs(ms: number) {
  if (!ms) return '0s';
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rs = s % 60;
  return `${m}m ${rs}s`;
}

