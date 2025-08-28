import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/server/db";
import Post from "@/models/Post";

const SITE = "https://waternews.patwua.com"; // set to your prod origin

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const posts = await Post.find({}).sort({ publishedAt: -1 }).limit(50).lean();

  const items = posts
    .map((p) => {
      const url = `${SITE}/news/${p.slug}`;
      return `\n<item>\n  <title><![CDATA[${p.title}]]></title>\n  <link>${url}</link>\n  <guid isPermaLink="true">${url}</guid>\n  <pubDate>${new Date(p.publishedAt || Date.now()).toUTCString()}</pubDate>\n  <description><![CDATA[${p.excerpt || ""}]]></description>\n</item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>WaterNews</title>\n    <link>${SITE}</link>\n    <description>Latest stories from WaterNewsGY</description>\n    ${items}\n  </channel>\n</rss>`;

  res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=300");
  res.status(200).send(xml);
}

