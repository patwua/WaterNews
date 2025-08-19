import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

export default function ModerationQueuePage() {
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const assignee = (router.query.assignee as string) || "all"; // "me" | "unassigned" | "all"

  async function load() {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (assignee && assignee !== "all") q.set("assignee", assignee);
      const res = await fetch(`/api/moderation/queue?${q.toString()}`);
      const data = await res.json();
      setItems(Array.isArray(data?.items) ? data.items : []);
      setSelected({});
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignee]);

  const allSelected = useMemo(
    () => items.length > 0 && items.every((it) => selected[it.id]),
    [items, selected]
  );
  const anySelected = useMemo(
    () => Object.values(selected).some(Boolean),
    [selected]
  );

  function toggleAll() {
    if (allSelected) return setSelected({});
    const next: Record<string, boolean> = {};
    for (const it of items) next[it.id] = true;
    setSelected(next);
  }

  function toggleOne(id: string) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }

  async function runBulk(action: "approve" | "archive" | "second_review") {
    const ids = Object.entries(selected).filter(([, v]) => v).map(([k]) => k);
    if (!ids.length) return;
    setLoading(true);
    try {
      await fetch("/api/moderation/queue/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ids }),
      });
      await load();
    } finally {
      setLoading(false);
    }
  }

  async function runInline(action: "approve" | "archive" | "second_review", id: string) {
    setLoading(true);
    try {
      await fetch(`/api/moderation/queue/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      await load();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Moderation Queue</h1>
        <select
          className="rounded-md border px-2 py-1 text-sm"
          value={assignee}
          onChange={(e) =>
            router.replace({ pathname: router.pathname, query: { ...router.query, assignee: e.target.value } }, undefined, { shallow: true })
          }
        >
          <option value="all">All</option>
          <option value="me">Assigned to me</option>
          <option value="unassigned">Unassigned</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full table-fixed text-sm">
          <thead className="bg-neutral-50">
            <tr>
              <th className="w-10 p-2">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Select all" />
              </th>
              <th className="p-2 text-left">Item</th>
              <th className="w-40 p-2 text-left">Submitted</th>
              <th className="w-56 p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-t">
                <td className="p-2 align-top">
                  <input type="checkbox" checked={!!selected[it.id]} onChange={() => toggleOne(it.id)} aria-label={`Select ${it.title || it.id}`} />
                </td>
                <td className="p-2">
                  <div className="font-medium">{it.title || it.slug || it.id}</div>
                  <div className="mt-1 line-clamp-2 text-xs text-neutral-500">{it.preview || it.excerpt || ""}</div>
                </td>
                <td className="p-2 align-top text-xs text-neutral-500">{it.createdAt ? new Date(it.createdAt).toLocaleString() : "-"}</td>
                <td className="p-2 align-top">
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => runInline("approve", it.id)} className="rounded-md border px-2 py-1 text-xs">Approve</button>
                    <button onClick={() => runInline("archive", it.id)} className="rounded-md border px-2 py-1 text-xs">Archive</button>
                    <button onClick={() => runInline("second_review", it.id)} className="rounded-md border px-2 py-1 text-xs">2nd review</button>
                  </div>
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr><td colSpan={4} className="p-6 text-center text-sm text-neutral-500">{loading ? "Loading…" : "No items in queue."}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={[
        "pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center transition-opacity",
        anySelected ? "opacity-100" : "opacity-0"
      ].join(" ")}>
        <div className="pointer-events-auto flex items-center gap-2 rounded-full border bg-white/90 px-3 py-2 shadow-lg backdrop-blur">
          <span className="text-xs text-neutral-600">{Object.values(selected).filter(Boolean).length} selected</span>
          <button onClick={() => runBulk("approve")} className="rounded-full border px-3 py-1 text-xs">Approve</button>
          <button onClick={() => runBulk("archive")} className="rounded-full border px-3 py-1 text-xs">Archive</button>
          <button onClick={() => runBulk("second_review")} className="rounded-full border px-3 py-1 text-xs">2nd review</button>
        </div>
      </div>
    </div>
  );
}

