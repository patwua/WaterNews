import Link from "next/link";
import { useMemo } from "react";
import Image from "next/image";
import { useLowData } from "@/utils/useLowData";

/** Minimal article shape for hero */
export type Article = {
  slug: string;
  title: string;
  excerpt?: string;
  coverImage?: string;
  coverVideo?: string;
  tags?: string[];
  engagementScore?: number;
  publishedAt?: string | Date;
  isBreaking?: boolean;
};

type HeroPropsV1 = {
  primary: Article;
  rail: Article[];
};

type HeroPropsV2 = {
  category?: string | null;
  articles: Article[];
};

type Props = HeroPropsV1 | HeroPropsV2;

/** Weighted scoring — recency + engagement + category/tag boost + breaking */
function scoreArticle(a: Article, category?: string | null) {
  const now = Date.now();
  const ts = a.publishedAt ? new Date(a.publishedAt).getTime() : now;
  const hoursOld = Math.max(1, (now - ts) / (1000 * 60 * 60));
  const recency = 1 / hoursOld;
  const engagement = (a.engagementScore ?? 0) / 100;
  const tags = (a.tags || []).map((t) => String(t).toLowerCase());
  const cat = (category || "").toLowerCase();
  const tagBoost = cat && tags.some((t) => t === cat || t === `#${cat}`) ? 0.6 : 0;
  const breakingBoost =
    a.isBreaking || tags.includes("breaking") || tags.includes("#breaking") ? 0.8 : 0;
  return recency * 1.2 + engagement * 1.0 + tagBoost + breakingBoost;
}

/** Normalize both prop shapes into { primary, rail } */
function useNormalized(props: Props) {
  return useMemo(() => {
    if ("primary" in props && "rail" in props) {
      return { primary: props.primary, rail: props.rail.slice(0, 4) };
    }
    const pool = (props as HeroPropsV2).articles || [];
    const ranked = pool
      .map((a) => ({ a, s: scoreArticle(a, (props as HeroPropsV2).category) }))
      .sort((x, y) => y.s - x.s)
      .map((x) => x.a);
    const primary = ranked[0];
    const rail = ranked.slice(1, 5);
    return { primary, rail };
  }, [props]);
}

export default function Hero(props: Props) {
  const lowData = useLowData();
  const { primary, rail } = useNormalized(props);
  if (!primary) return null;

  return (
    <section className="mb-6 wn-fade-in-up">
      <div className="grid md:grid-cols-3 gap-4">
        {/* Primary */}
        <article className="md:col-span-2 rounded-2xl overflow-hidden ring-1 ring-black/5 bg-white">
          {/* Fixed visual ratio to reduce layout shift */}
          {primary.coverVideo && !lowData ? (
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <video
                className="absolute inset-0 w-full h-full object-cover"
                src={primary.coverVideo}
                controls
                preload="metadata"
                playsInline
                poster={primary.coverImage || ""}
              />
            </div>
          ) : primary.coverImage ? (
            <Image
              src={primary.coverImage}
              alt=""
              width={1200}
              height={675}
              className="w-full h-auto object-cover"
              priority
              sizes="(min-width: 768px) 66vw, 100vw"
            />
          ) : null}
          <div className="p-4">
            <h2 className="text-xl md:text-2xl font-bold leading-tight">
              <Link href={`/news/${primary.slug}`} className="hover:underline">
                {primary.title}
              </Link>
            </h2>
            {primary.excerpt ? (
              <p className="mt-2 text-neutral-700 line-clamp-3">{primary.excerpt}</p>
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
                <p className="mt-1 text-xs text-neutral-700 line-clamp-2">{it.excerpt}</p>
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

