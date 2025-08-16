import Head from "next/head";
import { GetServerSideProps } from "next";
import { dbConnect } from "@/lib/server/db";
import Post from "@/models/Post";
import type { PostDoc } from "@/models/Post";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  ok: boolean;
  post?: any;
};

function fmtDate(d?: string | Date) {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Markdown({ source }: { source: string }) {
  // lightweight client-side markdown render using marked (already in pkg.json per your logs)
  const [html, setHtml] = useState<string>("");
  useEffect(() => {
    (async () => {
      const { marked } = await import("marked");
      setHtml(marked.parse(source || "", { breaks: true }) as string);
    })();
  }, [source]);
  // eslint-disable-next-line react/no-danger
  return <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function NewsArticle({ ok, post }: Props) {
  if (!ok || !post) {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold">Article not found</h1>
        <p className="mt-2 text-neutral-600">This story may have been removed or unpublished.</p>
        <div className="mt-6"><Link href="/" className="text-blue-600 hover:underline">Back to home</Link></div>
      </main>
    );
  }

  const {
    title,
    excerpt,
    body,
    coverImage,
    tags = [],
    slug,
    publishedAt,
  } = post as PostDoc;

  const canonical = `/news/${slug}`;
  const site = "https://waternews.patwua.com"; // change to your prod origin
  const fullUrl = `${site}${canonical}`;
  const ogImg = coverImage || `${site}/og-default.jpg`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    datePublished: new Date(publishedAt || Date.now()).toISOString(),
    dateModified: new Date(publishedAt || Date.now()).toISOString(),
    description: excerpt,
    mainEntityOfPage: fullUrl,
    image: ogImg,
    author: post.authorId ? { "@type": "Person", name: String(post.authorId) } : undefined,
    articleSection: post.category || "news",
    keywords: (tags || []).join(", "),
  };

  return (
    <>
      <Head>
        <title>{title} — WaterNews</title>
        <link rel="canonical" href={fullUrl} />
        {/* OpenGraph / Twitter */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={excerpt || title} />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:image" content={ogImg} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={excerpt || title} />
        <meta name="twitter:image" content={ogImg} />
        {/* JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      <article className="max-w-3xl mx-auto px-4 md:px-6 py-6">
        <header className="mb-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600">
            <Link href="/" className="hover:underline">Home</Link>
            <span>·</span>
            <span>{fmtDate(publishedAt)}</span>
            {post.isBreaking && (<><span>·</span><span className="px-2 py-0.5 rounded-full bg-red-600/10 text-red-700 font-medium">Breaking</span></>)}
          </div>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
          {excerpt ? <p className="mt-2 text-neutral-700">{excerpt}</p> : null}
          {tags?.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((t: string) => (
                <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">#{t.replace(/^#/, "")}</span>
              ))}
            </div>
          ) : null}
          {coverImage ? (
            <div className="mt-4 rounded-2xl overflow-hidden ring-1 ring-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverImage} alt="" className="w-full h-auto object-cover" />
            </div>
          ) : null}
        </header>

        <section className="mt-6 prose prose-neutral max-w-none">
          <Markdown source={body || ""} />
        </section>

        <footer className="mt-8 border-t pt-6">
          <RelatedRail slug={slug} tags={tags} title={title} />
        </footer>
      </article>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const slug = String(ctx.params?.slug || "");
  await dbConnect();
  const doc = await Post.findOne({ slug }).lean();
  if (!doc) {
    return { props: { ok: false } };
  }
  // minimal serialization
  const post = {
    ...doc,
    _id: String(doc._id),
    publishedAt: doc.publishedAt ? new Date(doc.publishedAt).toISOString() : null,
  };
  return { props: { ok: true, post: JSON.parse(JSON.stringify(post)) } };
};

// Local component import placed at bottom to avoid SSR circular deps
import RelatedRail from "@/components/RelatedRail";

