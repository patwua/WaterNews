import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/server/db";
import Draft from "@/models/Draft";
import Post from "@/models/Post";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  await dbConnect();

  const { id = "" } = req.query as { id?: string };
  if (!id) return res.status(400).json({ error: "id required" });

  const draft = await Draft.findById(id).lean();
  if (draft) {
    return res.json({ kind: "draft", href: `/admin/newsroom/editor?id=${draft._id}`, title: draft.title, slug: draft.slug });
  }
  const post = await Post.findById(id).lean();
  if (post) {
    return res.json({ kind: "post", href: `/news/${post.slug}`, title: post.title, slug: post.slug });
  }
  return res.json({ kind: null, href: null });
}
