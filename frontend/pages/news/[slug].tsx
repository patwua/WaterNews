import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { dbConnect } from "@/lib/server/db";
import Post from "@/models/Post";
import RelatedRail from "@/components/RelatedRail";
import ShareRow from "@/components/ShareRow";
import PrevNext from "@/components/PrevNext";
import { readingTime } from "@/lib/readingTime";
import { slugify } from "@/lib/slugify";

type Props = {
  post: any | null;
  prev: any | null;
  next: any | null;
};

export default function NewsArticlePage({ post, prev, next }: Props) {
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

  return (
    <>
      <Head>
        <title>{post.title} — WaterNewsGY</title>
        <link rel="canonical" href={`https://waternews.onrender.com/news/${post.slug}`} />
        {/* OG/Twitter/meta remain as you set elsewhere */}
      </Head>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <article>
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

          {/* Cover image, if any, with stable ratio */}
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

          {/* Body copy — comfortable measure */}
          <div className="prose max-w-prose">
            {/* If body is markdown-rendered elsewhere, keep it. Here we assume HTML-safe content */}
            <div dangerouslySetInnerHTML={{ __html: post.contentHtml || "" }} />
          </div>

          <ShareRow className="mt-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 rounded" />
        </article>

        <aside className="mt-8">
          <RelatedRail slug={post.slug} title={post.title} tags={post.tags || []} />
        </aside>

        <nav className="mt-8">
          <PrevNext prev={prev} next={next} />
        </nav>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  await dbConnect();
  const slugs = await Post.find({}).select("slug -_id").lean();
  return {
    paths: slugs.map((s: any) => ({ params: { slug: s.slug } })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  await dbConnect();
  const slug = String(params?.slug || "");
  const post = await Post.findOne({ slug }).lean();

  if (!post) {
    return { notFound: true, revalidate: 30 };
  }

  // Basic prev/next by date
  const prev = await Post.findOne({ publishedAt: { $lt: post.publishedAt } })
    .sort({ publishedAt: -1 })
    .select("slug title")
    .lean();
  const next = await Post.findOne({ publishedAt: { $gt: post.publishedAt } })
    .sort({ publishedAt: 1 })
    .select("slug title")
    .lean();

  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
      prev: prev ? JSON.parse(JSON.stringify(prev)) : null,
      next: next ? JSON.parse(JSON.stringify(next)) : null,
    },
    revalidate: 60,
  };
};

