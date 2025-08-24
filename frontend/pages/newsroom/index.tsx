import React, { useEffect, useState } from "react";
import Link from "next/link";
import Page from "@/components/UX/Page";
import SectionCard from "@/components/UX/SectionCard";

export default function Publisher() {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

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

  async function onDelete(id: string) {
    if (deleting) return;
    if (!confirm("Delete this draft?")) return;
    setDeleting(id);
    try {
      const r = await fetch(`/api/newsroom/drafts/${id}/delete`, { method: "POST" });
      const json = await r.json();
      if (!r.ok || !json?.ok) throw new Error("Failed to delete");
      setDrafts((ds) => ds.filter((d) => d._id !== id));
    } finally {
      setDeleting(null);
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
          className="rounded-xl bg-[#1583c2] px-4 py-2 font-semibold text-white hover:brightness-110 disabled:opacity-60"
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
                  <Link
                    href={`/newsroom/drafts/${d._id}`}
                    className="text-sm font-semibold text-[#1583c2] hover:underline"
                  >
                    Open
                  </Link>
                  <button
                    onClick={() => onDelete(d._id)}
                    disabled={deleting === d._id}
                    className="text-sm text-red-600 hover:underline disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </Page>
  );
}
