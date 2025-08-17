import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Notice = {
  id: string;
  type: string;
  createdAt: string; // ISO
  href: string | null;
  title: string;
  summary?: string;
};

export default function NotificationsPage() {
  const [items, setItems] = useState<Notice[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/notifications?limit=50");
        const json = await res.json();
        if (!alive) return;
        setItems(Array.isArray(json.items) ? json.items : []);
      } catch {
        if (!alive) return;
        setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const groups = useMemo(() => {
    // Hook for future grouping (Today / This week). For now, single flat list.
    return [{ label: null as string | null, items: items || [] }];
  }, [items]);

  return (
    <main className="max-w-3xl mx-auto px-4 py-6">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <p className="text-sm text-neutral-600">
          Important updates from authors you follow and story alerts.
        </p>
      </header>

      {loading ? (
        <div aria-busy="true" className="space-y-2" role="status">
          <div className="h-16 rounded-xl bg-neutral-200 animate-pulse" />
          <div className="h-16 rounded-xl bg-neutral-200 animate-pulse" />
          <div className="h-16 rounded-xl bg-neutral-200 animate-pulse" />
        </div>
      ) : !items || items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {groups.map((g, idx) => (
            <section key={idx}>
              {g.label ? (
                <h2 className="text-sm font-semibold text-neutral-700 mb-2">{g.label}</h2>
              ) : null}
              <ul className="space-y-2">
                {g.items.map((n) => (
                  <li
                    key={n.id}
                    className={["rounded-xl ring-1 ring-black/5 bg-white p-3 hover:bg-neutral-50","focus-within:ring-2 focus-within:ring-neutral-400"].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-medium line-clamp-1">
                          {n.href ? (
                            <Link
                              href={n.href}
                              className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 rounded"
                            >
                              {n.title}
                            </Link>
                          ) : (
                            n.title
                          )}
                        </div>
                        {n.summary ? (
                          <div className="text-xs text-neutral-600 line-clamp-2 mt-0.5">
                            {n.summary}
                          </div>
                        ) : null}
                      </div>
                      <time
                        className="shrink-0 text-[11px] text-neutral-500"
                        dateTime={n.createdAt}
                        title={new Date(n.createdAt).toLocaleString()}
                      >
                        {timeAgo(n.createdAt)}
                      </time>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl ring-1 ring-black/5 bg-white p-6">
      <h2 className="text-lg font-semibold">You’re all caught up</h2>
      <p className="text-sm text-neutral-600 mt-1">
        When authors you follow publish or a story trends, updates will appear here.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/"
          className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
        >
          Browse latest stories
        </Link>
        <Link
          href="/profile"
          className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium bg-white ring-1 ring-black/10 hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
        >
          Follow tags & authors
        </Link>
      </div>
    </div>
  );
}

function timeAgo(iso: string) {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const s = Math.max(1, Math.floor((now - then) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

