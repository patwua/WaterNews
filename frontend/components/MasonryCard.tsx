import Link from "next/link";
import { useMemo } from "react";

type Props = {
  item: {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    image?: string;
    tags?: string[];
    engagementScore?: number;
    publishedAt?: string;
    author?: { name: string; slug?: string };
  };
  variantSeed?: number;
  density?: "cozy" | "compact";
  clamp?: 2 | 3;
};

export default function MasonryCard({ item, variantSeed = 0, density = "compact", clamp = 2 }: Props) {
  const ratioClass = useMemo(() => {
    const v = variantSeed % 4;
    if (v === 0) return "aspect-[4/3]";
    if (v === 1) return "aspect-[16/9]";
    if (v === 2) return "aspect-[3/4]";
    return "aspect-square";
  }, [variantSeed]);

  const pad = density === "compact" ? "p-3" : "p-4";
  const titleSize = density === "compact" ? "text-base" : "text-lg";
  const excerptSize = density === "compact" ? "text-sm" : "text-[15px]";

  return (
    <article className={`group rounded-2xl shadow-sm ring-1 ring-black/5 bg-white overflow-hidden hover:shadow-md transition-shadow`}>
      {item.image ? (
        <div className={`w-full ${ratioClass} overflow-hidden`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform"
            loading="lazy"
          />
        </div>
      ) : null}
      <div className={`${pad} grid gap-2`}>
        <h3 className={`${titleSize} font-semibold leading-snug line-clamp-2`}>
          <Link href={`/news/${item.slug}`} className="outline-none focus:ring-2 focus:ring-blue-500 rounded">
            {item.title}
          </Link>
        </h3>

        <p className={`${excerptSize} text-neutral-700 line-clamp-${clamp}`}>
          {item.excerpt}
        </p>

        <div className="mt-1 flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {item.tags?.slice(0, 3).map(t => (
              <span key={t} className="text-xs px-2 py-0.5 bg-neutral-100 rounded-full">{t}</span>
            ))}
          </div>
          {item.publishedAt ? (
            <time className="text-xs text-neutral-500" dateTime={item.publishedAt}>
              {new Date(item.publishedAt).toLocaleDateString()}
            </time>
          ) : null}
        </div>
      </div>
    </article>
  );
}
