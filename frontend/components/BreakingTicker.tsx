import Link from "next/link";
import { useMemo } from "react";

type TickerItem = {
  slug: string;
  title: string;
  tags?: string[];
  isBreaking?: boolean;
};

type Props = {
  /** Optional list of items to show. If empty, we render a placeholder. */
  items?: TickerItem[];
  /** Optional placeholder text when there are no items */
  emptyText?: string;
};

export default function BreakingTicker({ items = [], emptyText = "No breaking updates" }: Props) {
  // Prioritize #breaking / #alert / isBreaking
  const prioritized = useMemo(() => {
    const score = (it: TickerItem) => {
      const tags = (it.tags || []).map((t) => t.toLowerCase());
      let s = 0;
      if (it.isBreaking) s += 5;
      if (tags.includes("breaking") || tags.includes("#breaking")) s += 4;
      if (tags.includes("alert") || tags.includes("#alert")) s += 3;
      return s;
    };
    return [...items].sort((a, b) => score(b) - score(a));
  }, [items]);

  const hasItems = prioritized.length > 0;

  return (
    <div className="w-full border-b bg-neutral-50">
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-2 flex items-center gap-3 overflow-x-auto no-scrollbar">
        <span className="text-xs font-semibold uppercase tracking-wide text-red-700">Breaking</span>
        {hasItems ? (
          <ul className="flex items-center gap-4 text-sm">
            {prioritized.map((it) => (
              <li key={it.slug} className="shrink-0">
                <Link href={`/news/${it.slug}`} className="hover:underline">
                  {it.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <span className="text-sm text-neutral-600">{emptyText}</span>
        )}
      </div>
    </div>
  );
}

