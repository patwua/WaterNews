import { useEffect, useState } from "react";

function readAffinity() {
  if (typeof window === "undefined") return { tagList: [], authorList: [] };
  try {
    const tagList = JSON.parse(localStorage.getItem("wn:follows:tags") || "[]");
    const authorList = JSON.parse(localStorage.getItem("wn:follows:authors") || "[]");
    return {
      tagList: Array.isArray(tagList) ? tagList : [],
      authorList: Array.isArray(authorList) ? authorList : [],
    };
  } catch {
    return { tagList: [], authorList: [] };
  }
}

export default function RelatedRail({
  slug,
  title,
  tags,
  limit = 6,
}: {
  slug?: string;
  title?: string;
  tags?: string[];
  limit?: number;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const { tagList, authorList } = readAffinity();
        const qs = new URLSearchParams({
          limit: String(limit),
        });
        if (slug) qs.set("slug", slug);
        if (title) qs.set("title", title);
        if (tags?.length) qs.set("tags", tags.join(","));
        if (tagList.length) qs.set("affinityTags", tagList.join(","));
        if (authorList.length) qs.set("affinityAuthors", authorList.join(","));
        const res = await fetch(`/api/recs/related?` + qs.toString());
        const json = await res.json();
        setItems(json.items || []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [slug, title, JSON.stringify(tags), limit]);

  if (loading) {
    return (
      <div>
        <h3 className="text-sm font-semibold mb-2">Related stories</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="h-24 rounded-xl bg-neutral-200 animate-pulse" />
          <div className="h-24 rounded-xl bg-neutral-200 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!items.length) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold mb-2">Related stories</h3>
      <ul className="grid sm:grid-cols-2 gap-3">
        {items.map((it: any) => (
          <li key={it.slug} className="p-3 rounded-xl bg-white ring-1 ring-black/5 hover:bg-neutral-50">
            <a href={`/news/${it.slug}`} className="block">
              <div className="text-sm font-medium line-clamp-2">{it.title}</div>
              <div className="text-xs text-neutral-600 mt-1">{it.excerpt}</div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

