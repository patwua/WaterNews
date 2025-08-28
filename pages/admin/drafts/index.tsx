import Link from "next/link";
import DraftList from "@/components/Newsroom/DraftList";
import type { ReactNode } from "react";

interface Column {
  key: string;
  label: string;
  render?: (x: any) => ReactNode;
}

export default function DraftsList() {
  async function createDraft(): Promise<void> {
    const r = await fetch("/api/drafts/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const d = await r.json();
    if (d.id) location.href = `/admin/drafts/${d.id}`;
  }

  const columns: Column[] = [
    {
      key: "updatedAt",
      label: "Updated",
      render: (x) => new Date(x.updatedAt).toLocaleString(),
    },
    { key: "title", label: "Title" },
    { key: "status", label: "Status", render: (x) => x.status },
    {
      key: "assignedTo",
      label: "Assigned",
      render: (x) => x.assignedTo?.name || x.assignedTo?.email || "—",
    },
    {
      key: "scheduledAt",
      label: "Scheduled",
      render: (x) => (x.scheduledAt ? new Date(x.scheduledAt).toLocaleString() : "—"),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Drafts</h1>
        <button
          onClick={createDraft}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          New Draft
        </button>
      </div>

      <DraftList
        fetchUrl="/api/drafts/list"
        columns={columns}
        actions={(x) => (
          <Link
            href={`/admin/drafts/${x._id}`}
            className="text-blue-600 underline"
          >
            Open
          </Link>
        )}
        showSearch
        showStatusFilter
      />
    </div>
  );
}
