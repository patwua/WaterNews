import { GetStaticPaths, GetStaticProps } from "next";
import { dbConnect } from "@/lib/server/db";
import Post from "@/models/Post";
import ArticleView from "@/components/ArticleView";

export type Props = {
  post: any | null;
  prev: any | null;
  next: any | null;
};

export default function NewsArticlePage({ post, prev, next }: Props) {
  return <ArticleView post={post} prev={prev} next={next} />;
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
