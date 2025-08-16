import Link from "next/link";
import { useMemo } from "react";

/** Minimal shape used by the hero scoring & rendering */
export type Article = {
  slug: string;
  title: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
  engagementScore?: number;      // optional: used if provided
  publishedAt?: string | Date;   // ISO or Date
  isBreaking?: boolean;
};

type HeroPropsV1 = {
  /** Legacy shape: already-picked articles */
  primary: Article;
  rail: Article[];
};

type HeroPropsV2 = {
  /** New shape: let Hero pick the primary/rail from a list, with optional category hint */
  category?: string | null;
  articles: Article[];
};

type Props = HeroPropsV1 | HeroPropsV2;

/** Basic weighted scoring — recency + engagement + category/tag boost */
function scoreArticle(a: Article, category?: string | null) {
  const now = Date.now();
  const ts = a.publishedAt ? new Date(a.publishedAt).getTime() : now;
  const hoursOld = Math.max(1, (now - ts) / (1000 * 60 * 60));
  const recency = 1 / hoursOld; // fresher → higher
  const engagement = (a.engagementScore ?? 0) / 100; // scale down if huge
  const tags = (a.tags || []).map(t => String(t).toLowerCase());
  const cat = (category || "").toLowerCase();
  const tagBoost =
    cat && tags.some(t => t === cat || t === `#${cat}`) ? 0.6 : 0;

  const breakingBoost =
    a.isBreaking || tags.includes("breaking") || tags.includes("#breaking")
      ? 0.8
      : 0;

  return recency * 1.2 + engagement * 1.0 + tagBoost + breakingBoost;
}

/** Normalize both prop shapes into { primary, rail } */
function useNormalized(props: Props) {
  return useMemo(() => {
    if ("primary" in props && "rail" in props) {
      // Legacy callers pass pre-selected articles
      return { primary: props.primary, rail: props.rail.slice(0, 4) };
    }
    // New callers pass a pool to select from
    const pool = (props.articles || []).slice();
    // Score & sort
    const ranked = pool
      .map(a => ({ a, s: scoreArticle(a, props.category) }))
      .sort((x, y) => y.s - x.s)
      .map(x => x.a);

    const primary = ranked[0];
    const rail = ranked.slice(1, 5);
    return { primary, rail };
  }, [props]);
}

export default function Hero(props: Props) {
  const { primary, rail } = useNormalized(props);

  // Nothing to render
  if (!primary) return null;

  return (
    <section className="mb-6">
      <div className="grid md:grid-cols-3 gap-4">
        {/* Primary story */}
        <article className="md:col-span-2 rounded-2xl overflow-hidden ring-1 ring-black/5 bg-white">
          {primary.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={primary.coverImage}
              alt=""
              className="w-full h-56 md:h-72 object-cover"
            />
          ) : null}
          <div className="p-4">
            <h2 className="text-xl md:text-2xl font-bold leading-tight">
              <Link href={`/news/${primary.slug}`} className="hover:underline">
                {primary.title}
              </Link>
            </h2>
            {primary.excerpt ? (
              <p className="mt-2 text-neutral-700 line-clamp-3">
                {primary.excerpt}
              </p>
            ) : null}
            {primary.tags?.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {primary.tags.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700"
                  >
                    #{String(t).replace(/^#/, "")}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </article>

        {/* Rail */}
        <div className="space-y-3">
          {rail.map((it) => (
            <article
              key={it.slug}
              className="rounded-xl p-3 ring-1 ring-black/5 bg-white hover:bg-neutral-50"
            >
              <h3 className="text-sm font-semibold leading-snug">
                <Link href={`/news/${it.slug}`} className="hover:underline">
                  {it.title}
                </Link>
              </h3>
              {it.excerpt ? (
                <p className="mt-1 text-xs text-neutral-700 line-clamp-2">
                  {it.excerpt}
                </p>
              ) : null}
              {it.tags?.length ? (
                <div className="mt-1 flex flex-wrap gap-1">
                  {it.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700"
                    >
                      #{String(t).replace(/^#/, "")}
                    </span>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

