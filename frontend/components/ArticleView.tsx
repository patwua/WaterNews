import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import RelatedRail from "@/components/RelatedRail";
import ShareRow from "@/components/ShareRow";
import PrevNext from "@/components/PrevNext";
import ImageLightbox from "@/components/ImageLightbox";
import { readingTime } from "@/lib/readingTime";
import { slugify } from "@/lib/slugify";
import { buildBreadcrumbsJsonLd, buildNewsArticleJsonLd, jsonLdScript, ogImageForPost } from "@/lib/seo";

export type ArticleViewProps = {
  post: any | null;
  prev?: any | null;
  next?: any | null;
  basePath?: string; // e.g. "news"
  sectionLabel?: string; // e.g. "News"
};

export default function ArticleView({
  post,
  prev,
  next,
  basePath = "news",
  sectionLabel = "News",
}: ArticleViewProps) {
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);

  if (!post) {
    return (
      <main className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-semibold">Story unavailable</h1>
        <p className="text-neutral-600">This article could not be found.</p>
      </main>
    );
  }

  const read = readingTime(post?.content || "").minutes;
  const authorName: string | undefined = post?.author || post?.byline;
  const authorSlug = authorName ? slugify(authorName) : null;
  const authorUrl = authorSlug ? `/author/${authorSlug}` : undefined;
  const origin =
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_SITE_URL || "https://www.waternewsgy.com"
      : window.location.origin;
  const canonicalPath = `/${basePath}/${post.slug}`;
  const ogImage = ogImageForPost(post);
  const breadcrumbs = buildBreadcrumbsJsonLd(origin, [
    { name: "Home", url: "/" },
    { name: sectionLabel, url: `/${basePath}` },
    { name: post.title, url: canonicalPath },
  ]);
  const articleLd = buildNewsArticleJsonLd({
    origin,
    url: canonicalPath,
    headline: post.title,
    description: post.excerpt || post.description || undefined,
    image: post.coverImage || ogImage || undefined,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt || undefined,
    section: post.category || post.section || undefined,
    keywords: Array.isArray(post.tags) ? post.tags : undefined,
    authorName,
    authorUrl,
  });

  // Attach click-to-zoom on images inside the article body
  useEffect(() => {
    const root = document.getElementById("article-body");
    if (!root) return;
    const imgs = Array.from(root.querySelectorAll("img"));
    for (const img of imgs) {
      (img as HTMLImageElement).style.cursor = "zoom-in";
      img.setAttribute("tabindex", "0");
      img.setAttribute("role", "button");
      img.setAttribute("aria-label", "Open image");
      const open = () => setZoomSrc((img as HTMLImageElement).src);
      img.addEventListener("click", open);
      img.addEventListener("keypress", (e: any) => {
        if (e.key === "Enter" || e.key === " ") open();
      });
    }
    return () => {
      for (const img of imgs) {
        const open = () => setZoomSrc((img as HTMLImageElement).src);
        img.removeEventListener("click", open);
      }
    };
  }, [post?.slug]);

  return (
    <>
      <Head>
        <title>{post.title} — WaterNewsGY</title>
        <link rel="canonical" href={`${origin}${canonicalPath}`} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript([breadcrumbs, articleLd]) }}
        />
      </Head>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <article className="wn-fade-in-up">
          <header className="mb-4">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">{post.title}</h1>
            <div className="mt-2 text-sm text-neutral-600 flex flex-wrap items-center gap-2">
              <time dateTime={post.publishedAt}>
                {post.publishedAt ? new Date(post.publishedAt).toLocaleString() : ""}
              </time>
              <span>•</span>
              <span>{read} min read</span>
              {authorName ? (
                <>
                  <span>•</span>
                  {authorSlug ? (
                    <Link
                      href={`/author/${authorSlug}`}
                      className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 rounded"
                    >
                      {authorName}
                    </Link>
                  ) : (
                    <span>{authorName}</span>
                  )}
                </>
              ) : null}
            </div>
          </header>

          {post.coverImage ? (
            <div className="relative w-full mb-4" style={{ paddingTop: "56.25%" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImage}
                alt=""
                className="absolute inset-0 w-full h-full object-cover rounded-xl ring-1 ring-black/5"
              />
            </div>
          ) : null}

          <div id="article-body" className="prose max-w-prose">
            <div dangerouslySetInnerHTML={{ __html: post.contentHtml || "" }} />
          </div>

          {Array.isArray(post?.images) && post.images.length > 1 ? (
            <section className="mt-6">
              <h2 className="text-sm font-semibold text-neutral-700">Gallery</h2>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                {post.images.map((src: string, i: number) => (
                  <button
                    key={src + i}
                    type="button"
                    className="group block rounded-lg overflow-hidden ring-1 ring-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-600"
                    onClick={() => setZoomSrc(src)}
                    aria-label="Open image"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt=""
                      className="aspect-video object-cover group-hover:opacity-90"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          <ShareRow className="mt-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 rounded" />
        </article>

        <aside className="mt-8">
          <RelatedRail slug={post.slug} title={post.title} tags={post.tags || []} />
        </aside>

        <nav className="mt-8">
          <PrevNext prev={prev} next={next} />
        </nav>
        {zoomSrc ? <ImageLightbox src={zoomSrc} onClose={() => setZoomSrc(null)} /> : null}
      </main>
    </>
  );
}
