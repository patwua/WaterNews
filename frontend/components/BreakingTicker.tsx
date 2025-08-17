import Link from "next/link";
import { useEffect, useState } from "react";

type TickerItem = {
  slug: string;
  title: string;
  tags?: string[];
  isBreaking?: boolean;
};

type Props = {
  /** Optional pre-supplied items. If omitted, the ticker fetches /api/news/breaking. */
  items?: TickerItem[];
  /** Optional placeholder text when there are no items. */
  emptyText?: string;
};

export default function BreakingTicker({ items, emptyText = "No breaking updates" }: Props) {
  const [autoItems, setAutoItems] = useState<TickerItem[] | null>(null);
  const [loading, setLoading] = useState(false);

  // Self-fetch from API if no items prop was passed
  useEffect(() => {
    if (items !== undefined) return; // respect provided props (even empty)
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/news/breaking");
        const json = await res.json();
        if (!alive) return;
        setAutoItems(Array.isArray(json.items) ? json.items : []);
      } catch {
        if (!alive) return;
        setAutoItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [items]);

  const list: TickerItem[] = items ?? autoItems ?? [];
  const hasItems = list.length > 0;

  return (
    <div className="w-full border-b bg-neutral-50">
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-2 flex items-center gap-3 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-semibold uppercase tracking-wide bg-red-50 text-red-800 px-2 py-0.5 rounded">
          Breaking
        </span>

        {hasItems ? (
          <ul className="flex items-center gap-4 text-sm">
            {list.map((it) => (
              <li key={it.slug} className="shrink-0">
                <Link
                  href={`/news/${it.slug}`}
                  className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 rounded"
                >
                  {it.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <span className="text-sm text-neutral-600">
            {loading ? "Loading…" : emptyText}
          </span>
        )}
      </div>
    </div>
  );
}
