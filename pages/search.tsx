import React, { useState } from "react";
import Page from "@/components/UX/Page";
import SectionCard from "@/components/UX/SectionCard";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!q) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const d = await r.json();
      setResults(d?.items || []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page title="Search" subtitle="Find stories, authors, and topics.">
      <div className="grid gap-6">
          <SectionCard id="search-form">
          <form onSubmit={onSubmit} className="flex gap-2">
            <input className="flex-1 border px-3 py-2 rounded" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles…" />
            <button className="px-4 py-2 rounded-md bg-black text-white hover:bg-gray-900">Search</button>
          </form>
        </SectionCard>
          {loading && <SectionCard id="search-loading">Searching…</SectionCard>}
        {results && (
            <SectionCard id="search-results" title="Results">
            <ul className="space-y-3">
              {results.map((r) => (
                <li key={r.slug} className="border rounded p-3 hover:bg-gray-50">
                  <a href={`/news/${r.slug}`} className="font-medium hover:underline">{r.title}</a>
                  <div className="text-sm text-gray-600">{r.excerpt}</div>
                </li>
              ))}
            </ul>
          </SectionCard>
        )}
      </div>
    </Page>
  );
}
