import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function SearchPage() {
  const router = useRouter();
  const q = typeof router.query.q === "string" ? router.query.q : "";
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (!q) { setItems([]); return; }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const json = await res.json();
        setItems(json.items || []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [q]);

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-3">Search</h1>

      {!q ? (
        <p className="text-neutral-600">
          Use the header search to find stories.
        </p>
      ) : loading ? (
        <div className="space-y-2">
          <div className="h-16 rounded-xl bg-neutral-200 animate-pulse" />
          <div className="h-16 rounded-xl bg-neutral-200 animate-pulse" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-neutral-600">No results for “{q}”.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((it) => (
            <li key={it.slug} className="p-3 rounded-xl ring-1 ring-black/5 hover:bg-neutral-50">
              <a href={`/news/${it.slug}`} className="block">
                <div className="text-sm font-medium">{it.title}</div>
                {it.excerpt ? <div className="text-xs text-neutral-600 line-clamp-2">{it.excerpt}</div> : null}
                <div className="mt-1 text-[11px] text-neutral-500">
                  {it.publishedAt ? new Date(it.publishedAt).toLocaleString() : ""}
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

