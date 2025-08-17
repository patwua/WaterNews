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

  // If no items prop provided, self-fetch from API
  useEffect(() => {
    if (items && items.length >= 0) return; // respect provided props (including empty array)
    let isMounted = true;
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/news/breaking");
        const json = await res.json();
        if (!isMounted) return;
        setAutoItems(Array.isArray(json.items) ? json.items : []);
      } catch {
        if (!isMounted) return;
        setAutoItems([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    run();
    return () => {
      isMounted = false;
    };
  }, [items]);

  const list: TickerItem[] = items ?? autoItems ?? [];
  const hasItems = Array.isArray(list) && list.length > 0;

  return (
    <div className="w-full border-b bg-neutral-50">
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-2 flex items-center gap-3 overflow-x-auto no-scrollbar">
        <span className="text-xs font-semibold uppercase tracking-wide text-red-700">Breaking</span>

        {hasItems ? (
          <ul className="flex items-center gap-4 text-sm">
            {list.map((it) => (
              <li key={it.slug} className="shrink-0">
                <Link href={`/news/${it.slug}`} className="hover:underline">
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

