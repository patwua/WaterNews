import { useEffect, useMemo, useState } from "react";

function useDebounced<T>(value: T, delay = 350) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const dq = useDebounced(q);
  const dt = useDebounced(tag);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const qs = new URLSearchParams();
        if (dq) qs.set("q", dq);
        if (dt) qs.set("tags", dt);
        const res = await fetch(`/api/search?${qs}`);
        const json = await res.json();
        setItems(json.items || []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [dq, dt]);

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-3">Search</h1>
      <div className="grid sm:grid-cols-3 gap-2 mb-4">
        <input
          className="sm:col-span-2 rounded-xl border px-3 py-2"
          placeholder="Search stories…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <input
          className="rounded-xl border px-3 py-2"
          placeholder="Tag (e.g. politics)"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="h-16 rounded-xl bg-neutral-200 animate-pulse" />
          <div className="h-16 rounded-xl bg-neutral-200 animate-pulse" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-neutral-600">No results yet. Try searching by headline or tag.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((it) => (
            <li
              key={it.slug}
              className="p-3 rounded-xl ring-1 ring-black/5 hover:bg-neutral-50"
            >
              <a href={`/news/${it.slug}`} className="block">
                <div className="text-sm font-medium">{it.title}</div>
                <div className="text-xs text-neutral-600 line-clamp-2">{it.excerpt}</div>
                <div className="mt-1 text-[11px] text-neutral-500">
                  {new Date(it.publishedAt).toLocaleString()}
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

