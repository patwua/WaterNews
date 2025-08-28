import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function TrendingRail() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/recs/recirculation');
        const d = await r.json();
        setItems(d.trending || []);
      } catch {}
    })();
  }, []);
  if (!items.length) return null;
  return (
    <aside className="border rounded-xl p-4">
      <div className="font-medium mb-3">Trending</div>
      <ul className="space-y-2">
        {items.slice(0, 6).map((it) => (
          <li key={it.slug}>
            <Link href={`/news/${it.slug}`} className="hover:underline">{it.title}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
