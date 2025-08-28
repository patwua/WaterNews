import React, { useEffect, useState } from "react";
import type { GetServerSideProps } from "next";
import { requireAuthSSR } from "@/lib/user-guard";
import Page from "@/components/UX/Page";
import SectionCard from "@/components/UX/SectionCard";
import EmptyState from "@/components/UX/EmptyState";

export const getServerSideProps: GetServerSideProps = (ctx) => requireAuthSSR(ctx);

type Post = {
  _id?: string;
  slug: string;
  title: string;
  excerpt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function MyPosts() {
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch("/api/newsroom/posts");
        const d = await r.json();
        if (!alive) return;
        setItems(Array.isArray(d?.items) ? d.items : []);
      } catch {
        if (!alive) return;
        setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const visible = items.filter((p) =>
    !q.trim() || (p.title || "").toLowerCase().includes(q.trim().toLowerCase())
  );

  function copyLink(slug: string) {
    const url = `${window.location.origin}/news/${slug}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          setCopied(slug);
          setTimeout(() => setCopied(null), 1500);
        })
        .catch(() => window.open(url, "_blank"));
    } else {
      window.open(url, "_blank");
    }
  }

  return (
    <Page title="My Posts" subtitle="Published articles you’ve authored">
      <div className="grid gap-6">
        <SectionCard title="Search">
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
            <input
              className="flex-1 border px-3 py-2 rounded"
              placeholder="Search my posts…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </form>
        </SectionCard>
        <SectionCard title="Published">
          {loading ? (
            <div>Loading…</div>
          ) : visible.length === 0 ? (
            <EmptyState title={q ? "No matches" : "No posts yet"}>
              {q ? "Try a different search." : "Publish your first story from the Newsroom."}
            </EmptyState>
          ) : (
            <ul className="divide-y">
              {visible.map((p) => (
                <li key={p.slug} className="py-3 flex items-start justify-between gap-4">
                  <div>
                    <a href={`/news/${p.slug}`} className="font-medium hover:underline">
                      {p.title}
                    </a>
                    {p.excerpt && (
                      <div className="text-sm text-gray-600">{p.excerpt}</div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      {p.updatedAt
                        ? `Updated ${new Date(p.updatedAt).toLocaleString()}`
                        : p.createdAt
                        ? `Published ${new Date(p.createdAt).toLocaleString()}`
                        : null}
                    </div>
                  </div>
                  <button
                    onClick={() => copyLink(p.slug)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {copied === p.slug ? "Copied!" : "Copy link"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </Page>
  );
}
