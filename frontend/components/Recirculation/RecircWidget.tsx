import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function RecircWidget() {
  const [trending, setTrending] = useState<any[]>([]);
  const [latest, setLatest] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await fetch('/api/recs/recirculation');
        const d = await r.json();
        if (!mounted) return;
        setTrending(d.trending || []);
        setLatest(d.latest || []);
      } catch (e: any) {
        setError(e?.message || 'Failed to load');
      } finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="border rounded-xl p-4">Loading…</div>;
  if (error) return <div className="border rounded-xl p-4 text-red-600">{error}</div>;

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Section title="Trending" items={trending} />
      <Section title="Latest" items={latest} />
    </div>
  );
}

function Section({ title, items }: { title: string; items: any[] }) {
  return (
    <div className="border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Link href="/?sort=trending" className="text-sm underline underline-offset-4">See all</Link>
      </div>
      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it.slug} className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {it?.media?.[0]?.secure_url || it?.media?.[0]?.url ? (
              <img src={it.media[0].secure_url || it.media[0].url} alt="" className="w-16 h-16 object-cover rounded" />
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded" />
            )}
            <div className="min-w-0">
              <Link href={`/news/${it.slug}`} className="font-medium hover:underline line-clamp-2">{it.title}</Link>
              {it.publishedAt && (
                <div className="text-xs text-gray-500">{new Date(it.publishedAt).toLocaleString()}</div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
