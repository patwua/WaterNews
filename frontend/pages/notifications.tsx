import Link from "next/link";
import { useEffect, useState } from "react";
import { bucketForDate, BucketKey } from "@/utils/date";

type Item = {
  id: string;
  type: string;
  createdAt: string;
  title: string;
  slug?: string;
  tags?: string[];
};

export default function NotificationsPage() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/notifications");
        const json = await res.json();
        setItems(json.items || []);
        setCursor(json.nextCursor || null);
      } catch {
        setError("Could not load notifications.");
      }
    })();
  }, []);

  async function loadMore() {
    if (!cursor) return;
    setLoadingMore(true);
    setError("");
    try {
      const url = new URL("/api/notifications", window.location.origin);
      url.searchParams.set("cursor", cursor);
      url.searchParams.set("limit", "20");
      const res = await fetch(url.toString());
      const json = await res.json();
      setItems((prev) => [ ...(prev || []), ...(json.items || []) ]);
      setCursor(json.nextCursor || null);
    } catch {
      setError("Could not load more notifications.");
    } finally {
      setLoadingMore(false);
    }
  }

  function grouped() {
    const buckets: Record<BucketKey, Item[]> = { today: [], thisWeek: [], earlier: [] };
    for (const it of items || []) {
      const b = bucketForDate(new Date(it.createdAt));
      buckets[b].push(it);
    }
    return buckets;
  }

  if (!items) {
    return (
      <main className="max-w-3xl mx-auto p-4">
        <div className="rounded-2xl ring-1 ring-black/5 bg-white p-6">
          <div className="h-6 w-40 bg-neutral-200 rounded animate-pulse" />
          <div className="mt-3 h-4 w-72 bg-neutral-200 rounded animate-pulse" />
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-semibold">Notifications</h1>
      <div aria-live="polite" className="sr-only">{error ? error : ""}</div>
      {error ? (
        <div className="mt-4 rounded-2xl bg-red-50 text-red-800 text-sm px-3 py-2 ring-1 ring-red-200">
          {error}
        </div>
      ) : null}
      {items.length === 0 ? (
        <div className="mt-4 rounded-2xl ring-1 ring-black/5 bg-white p-6 text-sm text-neutral-700">
          No updates yet. Check back later, or follow tags/authors to see updates here.
          <div className="mt-3">
            <Link href="/" className="text-blue-700 underline">Browse latest stories</Link>
          </div>
        </div>
      ) : (
        <>
          {(["today","thisWeek","earlier"] as BucketKey[]).map((key) => {
            const bucket = grouped()[key];
            if (!bucket.length) return null;
            const label = key === "today" ? "Today" : key === "thisWeek" ? "This week" : "Earlier";
            return (
              <section key={key} className="mt-6">
                <h2 className="text-lg font-semibold">{label}</h2>
                <ul className="mt-2 space-y-2">
                  {bucket.map((it) => (
                    <li
                      key={it.id}
                      className="rounded-xl p-3 ring-1 ring-black/5 bg-white hover:bg-neutral-50 transition-colors"
                    >
                      <Link
                        href={it.slug ? `/news/${it.slug}` : "#"}
                        className="font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 rounded"
                      >
                        {it.title}
                      </Link>
                      <div className="text-[11px] text-neutral-500">
                        {new Date(it.createdAt).toLocaleString()}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
          <div className="mt-6">
            {cursor ? (
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium bg-white ring-1 ring-black/10 hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
              >
                {loadingMore ? "Loading…" : "Load more"}
              </button>
            ) : null}
          </div>
        </>
      )}
    </main>
  );
}
