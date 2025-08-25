import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import ShareRow from "@/components/ShareRow";
import PrevNext from "@/components/PrevNext";
import Image from "next/image";
import ImageLightbox from "@/components/ImageLightbox";
import { readingTime } from "@/lib/readingTime";
import { slugify } from "@/lib/slugify";
import { buildBreadcrumbsJsonLd, buildNewsArticleJsonLd, jsonLdScript, ogImageForPost } from "@/lib/seo";

const RelatedRail = dynamic(() => import("@/components/RelatedRail"), {
  ssr: false,
  loading: () => (
    <div className="space-y-4 animate-pulse">
      <div className="h-24 bg-gray-200 rounded" />
      <div className="h-24 bg-gray-200 rounded" />
    </div>
  ),
});

const PrevNext = dynamic(() => import("@/components/PrevNext"), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 animate-pulse">
      <div className="h-16 bg-gray-200 rounded" />
      <div className="h-16 bg-gray-200 rounded" />
    </div>
  ),
});

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
  const router = useRouter();
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
  const isPreview = router.query.preview !== undefined;
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
        {!isPreview && <link rel="canonical" href={`${origin}${canonicalPath}`} />}
        {isPreview && <meta name="robots" content="noindex" />}
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
            <div className="mb-4">
              <Image
                src={post.coverImage}
                alt=""
                width={1200}
                height={675}
                className="w-full h-auto object-cover rounded-xl ring-1 ring-black/5"
                priority
                sizes="100vw"
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
