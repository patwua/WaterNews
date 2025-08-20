import { useEffect, useState } from 'react';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import { requireAuthSSR } from '@/lib/user-guard';

export const getServerSideProps: GetServerSideProps = (ctx) => requireAuthSSR(ctx);

export default function MyPosts() {
  const [items, setItems] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const qs = new URLSearchParams({});
        if (q) qs.set('q', q);
        const r = await fetch(`/api/newsroom/posts?${qs.toString()}`);
        if (!r.ok) throw new Error('Failed to load');
        const d = await r.json();
        if (!mounted) return;
        setItems(d.items || []);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || 'Error');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [q]);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Posts</h1>
        <Link href="/newsroom" className="text-sm underline underline-offset-4">
          Back to Newsroom
        </Link>
      </div>
      <div className="flex gap-2">
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Search posts…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      {loading ? (
        <div className="text-gray-500">Loading…</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : items.length === 0 ? (
        <div className="border rounded-xl p-6 text-gray-600">No published posts yet.</div>
      ) : (
        <ul className="divide-y rounded-xl border">
          {items.map((it: any) => (
            <li key={it._id} className="flex items-center justify-between p-4">
              <div>
                <div className="font-medium">{it.title}</div>
                <div className="text-xs text-gray-500">
                  {it.publishedAt ? new Date(it.publishedAt).toLocaleString() : '—'}
                </div>
              </div>
              <Link href={`/news/${it.slug}`} className="text-blue-600 hover:underline">
                View
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

