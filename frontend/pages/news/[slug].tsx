import { GetStaticPaths, GetStaticProps } from "next";
import { dbConnect } from "@/lib/server/db";
import Post from "@/models/Post";
import ArticleView from "@/components/ArticleView";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export type Props = {
  post: any | null;
  prev: any | null;
  next: any | null;
};

export default function NewsArticlePage({ post, prev, next }: Props) {
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      setShowPreview(router.query.preview === "1");
    }
  }, [router.isReady, router.query.preview]);

  function viewLive() {
    const url = new URL(window.location.href);
    url.searchParams.delete("preview");
    router.replace(url.pathname + url.search, undefined, { shallow: true });
    setShowPreview(false);
  }

  return (
    <>
      {showPreview && (
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 text-sm flex justify-between items-center">
          <span>You’re viewing a preview of this article.</span>
          <button onClick={viewLive} className="underline">
            View live
          </button>
        </div>
      )}
      <ArticleView post={post} prev={prev} next={next} />
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
