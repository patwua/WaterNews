import React, { useEffect, useState } from "react";

export type Column = {
  key: string;
  label: string;
  render?: (item: any) => React.ReactNode;
};

interface DraftListProps {
  fetchUrl: string;
  columns: Column[];
  actions?: (item: any) => React.ReactNode;
  showSearch?: boolean;
  showStatusFilter?: boolean;
  refreshDeps?: any[];
}

export default function DraftList({
  fetchUrl,
  columns,
  actions,
  showSearch = false,
  showStatusFilter = false,
  refreshDeps = [],
}: DraftListProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    const params = new URLSearchParams();
    if (showSearch && q) params.set("q", q);
    if (showStatusFilter && status && status !== "all") params.set("status", status);
    setLoading(true);
    fetch(`${fetchUrl}${params.toString() ? `?${params.toString()}` : ""}`)
      .then((r) => r.json())
      .then((d) => setItems(d.items || d.rows || []))
      .finally(() => setLoading(false));
  }, [fetchUrl, q, status, showSearch, showStatusFilter, ...refreshDeps]);

  return (
    <div>
      {(showSearch || showStatusFilter) && (
        <div className="flex items-center gap-2 mb-4">
          {showSearch && (
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title..."
              className="rounded-xl border px-3 py-2"
            />
          )}
          {showStatusFilter && (
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-xl border px-3 py-2"
            >
              {["all", "draft", "in-review", "ready", "scheduled", "published", "archived"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          )}
        </div>
      )}

      <div className="overflow-auto rounded-2xl border">
        <table className="min-w-[680px] w-full">
          <thead className="bg-neutral-50 text-left text-sm">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="p-3">
                  {col.label}
                </th>
              ))}
              {actions && <th className="p-3" />}
            </tr>
          </thead>
          <tbody className="text-sm">
            {items.map((item) => (
              <tr key={item._id || item.id} className="border-t">
                {columns.map((col) => (
                  <td key={col.key} className="p-3">
                    {col.render ? col.render(item) : item[col.key]}
                  </td>
                ))}
                {actions && <td className="p-3 text-right">{actions(item)}</td>}
              </tr>
            ))}
            {!loading && items.length === 0 && (
              <tr>
                <td
                  className="p-6 text-neutral-600"
                  colSpan={columns.length + (actions ? 1 : 0)}
                >
                  No drafts yet.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td
                  className="p-6 text-neutral-600"
                  colSpan={columns.length + (actions ? 1 : 0)}
                >
                  Loading…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
