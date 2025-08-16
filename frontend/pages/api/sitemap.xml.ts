import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/server/db";
import Post from "@/models/Post";

const SITE = "https://waternews.patwua.com"; // set to your prod origin

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const posts = await Post.find({}).sort({ publishedAt: -1 }).limit(5000).lean();

  const urls = posts
    .map((p) => {
      const loc = `${SITE}/news/${p.slug}`;
      const lastmod = new Date(p.publishedAt || Date.now()).toISOString();
      return `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${SITE}</loc><changefreq>hourly</changefreq><priority>1.0</priority></url>\n  ${urls}\n</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=300");
  res.status(200).send(xml);
}

