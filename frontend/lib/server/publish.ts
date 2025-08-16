import Draft from "@/models/Draft";
import Post from "@/models/Post";
import { slugify } from "@/lib/slugify";
import { redact, stableHash } from "@/lib/server/redact";
import Event from "@/models/Event";

function makeExcerpt(markdown: string, fallback: string, max = 240) {
  const text = (markdown || "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[[^\]]*]\([^)]*\)/g, "")
    .replace(/[#>*_\-\+]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const base = text || fallback || "";
  return base.length > max ? base.slice(0, max - 1).trimEnd() + "…" : base;
}

export async function publishDraftById(id: string) {
  const d = await Draft.findById(id);
  if (!d) throw new Error("Draft not found");

  const slug = d.slug || slugify(d.title);
  const tags = Array.isArray(d.tags) ? d.tags : [];
  const isBreaking = tags.some(t => /^#?(breaking|alert)$/i.test(t));

  const post = await Post.findOneAndUpdate(
    { slug },
    {
      slug,
      title: d.title,
      excerpt: d.summary || makeExcerpt(d.body, d.title),
      body: d.body || "",
      coverImage: d.coverImage || "",
      tags,
      category: (d.type as any) || "news",
      publishedAt: new Date(),
      authorId: d.authorId || null,
      isBreaking,
    },
    { new: true, upsert: true }
  );

  // Trigger: article_published (public, redacted)
  const text = `${d.title}\n\n${d.summary || ""}\n\n${d.tags?.join(", ") || ""}`;
  await Event.create({
    type: "article_published",
    actorId: d.authorId || null,
    targetId: String(post._id),
    visibility: "public",
    redactedText: redact(text),
    rawTextHash: stableHash(text),
    tags,
    category: post.category,
  });

  d.status = "published";
  d.scheduledFor = null;
  await d.save();

  return { postSlug: post.slug, postId: String(post._id) };
}
