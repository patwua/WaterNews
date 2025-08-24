import React, { useState } from "react";
import Link from "next/link";
import Page from "@/components/UX/Page";
import SectionCard from "@/components/UX/SectionCard";
import DraftList, { Column } from "@/components/Newsroom/DraftList";

export default function Publisher() {
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const columns: Column[] = [
    { key: "title", label: "Title", render: (d) => d.title || "Untitled" },
    { key: "status", label: "Status", render: (d) => d.status || "draft" },
  ];

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
      setRefreshKey((k) => k + 1);
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
        <DraftList
          fetchUrl="/api/newsroom/drafts"
          columns={columns}
          actions={(d) => (
            <div className="flex items-center gap-3">
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
          )}
          refreshDeps={[refreshKey]}
        />
      </SectionCard>
    </Page>
  );
}
