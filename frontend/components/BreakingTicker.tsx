import Link from "next/link";

type TickerItem = {
  slug: string;
  title: string;
  tags?: string[];
  isBreaking?: boolean;
};

type Props = {
  /** Optional list of items to show. If omitted/empty, the ticker hides. */
  items?: TickerItem[];
};

export default function BreakingTicker({ items = [] }: Props) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <div className="relative overflow-hidden rounded-2xl bg-red-600 text-white">
      <div className="px-3 py-2 text-xs font-semibold tracking-wide uppercase bg-red-700 inline-flex items-center gap-2 rounded-br-xl">
        <span>Breaking</span>
        <span aria-hidden>•</span>
        <span className="text-white/80">Live</span>
      </div>
      <div className="whitespace-nowrap overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="inline-flex gap-6 animate-[ticker_24s_linear_infinite] will-change-transform">
          {items.map((it) => (
            <Link key={it.slug} href={`/news/${it.slug}`} className="py-2 px-4 inline-block hover:underline focus:outline-none focus:ring-2 focus:ring-white/70 rounded">
              {it.title}
            </Link>
          ))}
          {items.map((it, i) => (
            <Link key={`${it.slug}-dup-${i}`} href={`/news/${it.slug}`} className="py-2 px-4 inline-block hover:underline rounded">
              {it.title}
            </Link>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
}
