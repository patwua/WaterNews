import { useEffect, useMemo, useState } from "react";

function useDebounced<T>(value: T, delay = 350) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

type Suggestions = { tags: { tag: string; count: number }[]; headlines: { slug: string; title: string; publishedAt?: string }[] };

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestions>({ tags: [], headlines: [] });

  const dq = useDebounced(q);
  const dt = useDebounced(tag);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/search/suggestions");
        const json = await res.json();
        setSuggestions({
          tags: Array.isArray(json.tags) ? json.tags : [],
          headlines: Array.isArray(json.headlines) ? json.headlines : [],
        });
      } catch {
        setSuggestions({ tags: [], headlines: [] });
      }
    })();
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
      ) : (items.length === 0 && !q && !tag) ? (
        <section className="space-y-4">
          <div>
            <div className="text-xs font-semibold text-neutral-700 mb-2">Popular tags</div>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.tags.length === 0 ? (
                <span className="text-xs text-neutral-500">No tags yet</span>
              ) : (
                suggestions.tags.map((t) => (
                  <button
                    key={t.tag}
                    onClick={() => setTag(String(t.tag).replace(/^#/, ""))}
                    className="text-xs px-2 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200"
                  >
                    #{String(t.tag).replace(/^#/, "")}
                    <span className="ml-1 text-[10px] text-neutral-500">{t.count}</span>
                  </button>
                ))
              )}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-neutral-700 mb-2">Trending stories</div>
            <ul className="space-y-2">
              {suggestions.headlines.length === 0 ? (
                <li className="text-xs text-neutral-500">No recent stories</li>
              ) : (
                suggestions.headlines.map((h) => (
                  <li key={h.slug} className="p-3 rounded-xl ring-1 ring-black/5 hover:bg-neutral-50">
                    <a href={`/news/${h.slug}`} className="block">
                      <div className="text-sm font-medium line-clamp-1">{h.title}</div>
                      <div className="text-[11px] text-neutral-500">{h.publishedAt ? new Date(h.publishedAt).toLocaleString() : ""}</div>
                    </a>
                  </li>
                ))
              )}
            </ul>
          </div>
        </section>
      ) : items.length === 0 ? (
        <p className="text-neutral-600">No results. Try a different keyword or tag.</p>
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

