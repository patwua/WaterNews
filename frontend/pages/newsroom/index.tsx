import React, { useEffect, useState } from "react";
import Link from "next/link";
import Page from "@/components/UX/Page";
import SectionCard from "@/components/UX/SectionCard";

export default function Publisher() {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await fetch("/api/newsroom/drafts");
        const d = await r.json();
        if (mounted) setDrafts(d?.items || []);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function onNewDraft() {
    if (creating) return;
    setCreating(true);
    try {
      const r = await fetch("/api/newsroom/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Untitled draft" }),
      });
      const d = await r.json();
      const id = d?.id || d?.draft?._id || d?.draft?.id;
      if (id) window.location.href = `/newsroom/drafts/${id}`;
    } finally {
      setCreating(false);
    }
  }

  return (
    <Page
      title="Publisher"
      subtitle="Create, edit, and submit stories for review."
      actions={
        <button
          onClick={onNewDraft}
          disabled={creating}
          className="px-4 py-2 rounded-md bg-black text-white hover:bg-gray-900 disabled:opacity-50"
        >
          {creating ? "Creating…" : "New draft"}
        </button>
      }
    >
      <SectionCard title="Your drafts">
        {loading ? (
          <p className="text-gray-600">Loading…</p>
        ) : drafts.length === 0 ? (
          <p className="text-gray-600">No drafts yet. Click “New draft” to start writing.</p>
        ) : (
          <ul className="divide-y">
            {drafts.map((d) => (
              <li key={d._id} className="py-3 flex items-center justify-between">
                <div className="min-w-0">
                  <div className="font-medium truncate">{d.title || "Untitled"}</div>
                  <div className="text-xs text-gray-500">{d.status || "draft"}</div>
                </div>
                <div className="shrink-0 flex items-center gap-3">
                  <Link href={`/newsroom/drafts/${d._id}`} className="text-sm text-blue-600 hover:underline">
                    Open
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </Page>
  );
}
