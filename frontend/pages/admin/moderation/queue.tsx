import { useEffect, useMemo, useState } from "react";

type Item = {
  _id: string;
  type: string;
  visibility: "internal";
  actorId?: string | null;
  targetId?: string | null;
  redactedText?: string;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
  status?: "open" | "in_review" | "flagged" | "resolved";
  assignedTo?: string | null;
  secondReview?: boolean;
};

function StatusBadge({ s }: { s?: Item["status"] }) {
  const map: Record<string, string> = {
    open: "bg-neutral-100 text-neutral-700",
    in_review: "bg-blue-100 text-blue-700",
    flagged: "bg-amber-100 text-amber-800",
    resolved: "bg-green-100 text-green-700",
  };
  const cls = map[s || "open"] || map.open;
  const label = (s || "open").replace("_", " ");
  return <span className={`px-2 py-0.5 rounded-full text-xs ${cls}`}>{label}</span>;
}

export default function ModerationQueuePage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [me, setMe] = useState("");

  const [rows, setRows] = useState<Item[]>([]);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  async function fetchQueue(nextPage = 1) {
    setLoading(true);
    try {
      const qs = new URLSearchParams({
        q, type, status, assignedTo, page: String(nextPage), limit: String(limit),
      });
      const res = await fetch(`/api/moderation/queue?${qs}`);
      const json = await res.json();
      setRows(json.rows || []);
      setPages(json.pages || 1);
      setTotal(json.total || 0);
      setPage(json.page || nextPage);
    } catch {
      setRows([]); setPages(1); setTotal(0); setPage(1);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchQueue(1); }, [type, status, assignedTo, limit]);

  function resetFilters() {
    setQ(""); setType(""); setStatus(""); setAssignedTo(""); setLimit(20);
    fetchQueue(1);
  }

  async function doAction(id: string, action: "assign"|"release"|"flag_second"|"resolve"|"reopen", assignee?: string) {
    await fetch(`/api/moderation/queue/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, assignee, actorId: me || null }),
    });
    fetchQueue(page);
  }

  async function openTarget(targetId?: string | null) {
    if (!targetId) return;
    const res = await fetch(`/api/moderation/resolve-target?id=${encodeURIComponent(String(targetId))}`);
    const json = await res.json();
    if (json?.href) window.open(json.href, "_blank");
  }

  const pager = useMemo(() => {
    const items = [];
    const max = Math.min(pages, 7);
    let start = Math.max(1, page - Math.floor(max / 2));
    let end = Math.min(pages, start + max - 1);
    if (end - start + 1 < max) start = Math.max(1, end - max + 1);
    for (let i = start; i <= end; i++) items.push(i);
    return items;
  }, [page, pages]);

  return (
    <main className="max-w-7xl mx-auto p-4">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Moderation Queue</h1>
        <div className="text-sm text-neutral-600">{total} total</div>
      </header>

      <section className="grid md:grid-cols-6 gap-3 mb-3">
        <input className="rounded-xl border px-3 py-2 md:col-span-2" placeholder="Search text…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="rounded-xl border px-3 py-2" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All types</option>
          <option value="moderation_note">Moderation note</option>
          <option value="thread_hot">Hot thread</option>
          <option value="follow">Follow</option>
          <option value="like">Like</option>
          <option value="article_published">Published article</option>
        </select>
        <select className="rounded-xl border px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Active (open/in_review/flagged)</option>
          <option value="open">Open</option>
          <option value="in_review">In review</option>
          <option value="flagged">Flagged</option>
          <option value="resolved">Resolved</option>
        </select>
        <input className="rounded-xl border px-3 py-2" placeholder="Assigned to" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} />
        <select className="rounded-xl border px-3 py-2" value={limit} onChange={(e) => setLimit(parseInt(e.target.value, 10))}>
          {[10,20,50,100].map(n => <option key={n} value={n}>{n}/page</option>)}
        </select>
        <div className="flex items-center gap-2">
          <button onClick={() => fetchQueue(1)} className="rounded-xl border px-3 py-2 hover:bg-neutral-50">Apply</button>
          <button onClick={resetFilters} className="rounded-xl border px-3 py-2 hover:bg-neutral-50">Reset</button>
        </div>
        <div className="md:col-span-6 flex items-center gap-2">
          <input className="rounded-xl border px-3 py-2" placeholder="Me (id/email)" value={me} onChange={(e) => setMe(e.target.value)} />
          <button onClick={() => { setAssignedTo(me); fetchQueue(1); }} className="rounded-xl border px-3 py-2 hover:bg-neutral-50">Assigned to me</button>
        </div>
      </section>

      <section className="overflow-auto rounded-2xl border">
        <table className="min-w-[1180px] w-full">
          <thead className="bg-neutral-50 text-left text-sm">
            <tr>
              <th className="p-3 w-[160px]">Updated</th>
              <th className="p-3 w-[120px]">Type</th>
              <th className="p-3 w-[120px]">Status</th>
              <th className="p-3 w-[180px]">Assigned</th>
              <th className="p-3 w-[160px]">Actor</th>
              <th className="p-3 w-[200px]">Target</th>
              <th className="p-3">Summary (redacted)</th>
              <th className="p-3 w-[300px]">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-t">
                  {Array.from({ length: 8 }).map((__, j) => (
                    <td key={j} className="p-3"><div className="h-4 bg-neutral-200 rounded animate-pulse" /></td>
                  ))}
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr><td className="p-6 text-neutral-600" colSpan={8}>No items found.</td></tr>
            ) : (
              rows.map((r) => (
                <tr key={r._id} className="border-t align-top">
                  <td className="p-3">{new Date(r.updatedAt || r.createdAt).toLocaleString()}</td>
                  <td className="p-3">{r.type}</td>
                  <td className="p-3"><StatusBadge s={r.status} /></td>
                  <td className="p-3">{r.assignedTo || <span className="text-neutral-400">—</span>}</td>
                  <td className="p-3">{r.actorId || <span className="text-neutral-400">—</span>}</td>
                  <td className="p-3">
                    {r.targetId ? (
                      <button onClick={() => openTarget(r.targetId)} className="text-blue-600 hover:underline">
                        {r.targetId}
                      </button>
                    ) : <span className="text-neutral-400">—</span>}
                  </td>
                  <td className="p-3 whitespace-pre-wrap">{r.redactedText || ""}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      {!r.assignedTo ? (
                        <button onClick={() => doAction(r._id, "assign", me)} disabled={!me} className="rounded-lg border px-2 py-1 hover:bg-neutral-50 disabled:opacity-50">Assign to me</button>
                      ) : (
                        <button onClick={() => doAction(r._id, "release")} className="rounded-lg border px-2 py-1 hover:bg-neutral-50">Release</button>
                      )}
                      {!r?.secondReview ? (
                        <button onClick={() => doAction(r._id, "flag_second")} className="rounded-lg border px-2 py-1 hover:bg-neutral-50">Flag 2nd review</button>
                      ) : (
                        <span className="px-2 py-1 rounded bg-amber-100 text-amber-800 text-xs">2nd review</span>
                      )}
                      {r.status !== "resolved" ? (
                        <button onClick={() => doAction(r._id, "resolve")} className="rounded-lg border px-2 py-1 hover:bg-neutral-50">Resolve</button>
                      ) : (
                        <button onClick={() => doAction(r._id, "reopen")} className="rounded-lg border px-2 py-1 hover:bg-neutral-50">Reopen</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <nav className="mt-3 flex items-center justify-center gap-1">
        <button onClick={() => fetchQueue(Math.max(1, page - 1))} className="rounded-lg border px-3 py-1.5 hover:bg-neutral-50 disabled:opacity-50" disabled={page <= 1 || loading}>Prev</button>
        {pager.map((n) => (
          <button key={n} onClick={() => fetchQueue(n)} className={`rounded-lg border px-3 py-1.5 hover:bg-neutral-50 ${n === page ? "bg-neutral-100" : ""}`} disabled={loading}>{n}</button>
        ))}
        <button onClick={() => fetchQueue(Math.min(pages, page + 1))} className="rounded-lg border px-3 py-1.5 hover:bg-neutral-50 disabled:opacity-50" disabled={page >= pages || loading}>Next</button>
      </nav>
    </main>
  );
}
