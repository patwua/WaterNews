import Link from "next/link";

type Props = {
  slug: string;
  title: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
  publishedAt?: string | Date;
};

export default function MasonryCard({
  slug,
  title,
  excerpt,
  coverImage,
  tags = [],
  publishedAt,
}: Props) {
  return (
    <article className="rounded-xl overflow-hidden ring-1 ring-black/5 bg-white hover:bg-neutral-50">
      {coverImage ? (
        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coverImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
        </div>
      ) : null}
      <div className="p-3">
        <h3 className="text-sm font-semibold leading-snug">
          <Link href={`/news/${slug}`} className="hover:underline">
            {title}
          </Link>
        </h3>
        {excerpt ? <p className="mt-1 text-xs text-neutral-700 line-clamp-2">{excerpt}</p> : null}
        {tags.length ? (
          <div className="mt-1 flex flex-wrap gap-1">
            {tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700"
              >
                #{String(t).replace(/^#/, "")}
              </span>
            ))}
          </div>
        ) : null}
        <div className="mt-1 text-[11px] text-neutral-500">
          {publishedAt ? new Date(publishedAt).toLocaleDateString() : ""}
        </div>
      </div>
    </article>
  );
}

