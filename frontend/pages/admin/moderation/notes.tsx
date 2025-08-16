import { useEffect, useMemo, useState } from "react";

type Note = {
  _id: string;
  type: "moderation_note";
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

function toISODateLocal(d: Date) {
  // yyyy-mm-dd
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function StatusBadge({ s }: { s?: Note["status"] }) {
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

export default function ModerationNotesPage() {
  const [q, setQ] = useState("");
  const [targetId, setTargetId] = useState("");
  const [actorId, setActorId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [me, setMe] = useState(""); // simplistic "current user" text id/email; integrate with your auth later

  const [rows, setRows] = useState<Note[]>([]);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  async function fetchNotes(nextPage = 1) {
    setLoading(true);
    try {
      const qs = new URLSearchParams({
        q, targetId, actorId, from, to,
        page: String(nextPage), limit: String(limit),
        status, assignedTo,
      });
      const res = await fetch(`/api/moderation/notes?${qs}`);
      const json = await res.json();
      setRows(json.rows || []);
      setPages(json.pages || 1);
      setTotal(json.total || 0);
      setPage(json.page || nextPage);
    } catch {
      setRows([]);
      setPages(1);
      setTotal(0);
      setPage(1);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // default date range: last 7 days
    if (!from && !to) {
      const now = new Date();
      const start = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
      setFrom(toISODateLocal(start));
      setTo(toISODateLocal(now));
    }
  }, []);

  useEffect(() => {
    if (from || to) fetchNotes(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, limit, status, assignedTo]); // expanded deps

  function resetFilters() {
    setQ("");
    setTargetId("");
    setActorId("");
    const now = new Date();
    const start = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
    setFrom(toISODateLocal(start));
    setTo(toISODateLocal(now));
    setLimit(20);
    setStatus(""); setAssignedTo("");
    fetchNotes(1);
  }

  function downloadCSV() {
    const header = ["createdAt", "actorId", "targetId", "tags", "redactedText"];
    const lines = [header.join(",")];
    rows.forEach((r) => {
      const cols = [
        new Date(r.createdAt).toISOString(),
        r.actorId ?? "",
        r.targetId ?? "",
        (r.tags || []).join("|"),
        (r.redactedText || "").replace(/\n/g, " ").replace(/"/g, '""'),
      ];
      lines.push(cols.map((c) => `"${String(c)}"`).join(","));
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `moderation-notes-${toISODateLocal(new Date())}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function doAction(id: string, action: "assign"|"release"|"flag_second"|"resolve"|"reopen", assignee?: string) {
    await fetch(`/api/moderation/notes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, assignee }),
    });
    fetchNotes(page);
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
        <h1 className="text-2xl font-semibold">Moderation Notes</h1>
        <div className="text-sm text-neutral-600">{total} total</div>
      </header>

      <section className="grid md:grid-cols-5 gap-3 mb-3">
        <input className="rounded-xl border px-3 py-2 md:col-span-2" placeholder="Search text…" value={q} onChange={(e) => setQ(e.target.value)} />
        <input className="rounded-xl border px-3 py-2" placeholder="Target ID (draft/post)" value={targetId} onChange={(e) => setTargetId(e.target.value)} />
        <input className="rounded-xl border px-3 py-2" placeholder="Actor ID" value={actorId} onChange={(e) => setActorId(e.target.value)} />
        <div className="flex items-center gap-2">
          <select className="rounded-xl border px-3 py-2" value={limit} onChange={(e) => setLimit(parseInt(e.target.value, 10))}>
            {[10,20,50,100].map(n => <option key={n} value={n}>{n}/page</option>)}
          </select>
          <button onClick={() => fetchNotes(1)} className="rounded-xl border px-3 py-2 hover:bg-neutral-50">Apply</button>
          <button onClick={resetFilters} className="rounded-xl border px-3 py-2 hover:bg-neutral-50">Reset</button>
        </div>
        <div className="md:col-span-5 flex flex-wrap items-center gap-2">
          <label className="text-sm text-neutral-600">From</label>
          <input type="date" className="rounded-xl border px-3 py-2" value={from} onChange={(e) => setFrom(e.target.value)} />
          <label className="text-sm text-neutral-600">To</label>
          <input type="date" className="rounded-xl border px-3 py-2" value={to} onChange={(e) => setTo(e.target.value)} />
          <select className="rounded-xl border px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            <option value="open">Open</option>
            <option value="in_review">In review</option>
            <option value="flagged">Flagged</option>
            <option value="resolved">Resolved</option>
          </select>
          <input className="rounded-xl border px-3 py-2" placeholder="Assigned to (id/email)" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} />
          <div className="ml-auto flex items-center gap-2">
            <input className="rounded-xl border px-3 py-2" placeholder="Me (id/email)" value={me} onChange={(e) => setMe(e.target.value)} />
            <button onClick={() => { setAssignedTo(me); fetchNotes(1); }} className="rounded-xl border px-3 py-2 hover:bg-neutral-50">Assigned to me</button>
            <button onClick={downloadCSV} className="rounded-xl border px-3 py-2 hover:bg-neutral-50">Export CSV</button>
          </div>
        </div>
      </section>

      <section className="overflow-auto rounded-2xl border">
        <table className="min-w-[1080px] w-full">
          <thead className="bg-neutral-50 text-left text-sm">
            <tr>
              <th className="p-3 w-[180px]">When</th>
              <th className="p-3 w-[120px]">Status</th>
              <th className="p-3 w-[180px]">Assigned</th>
              <th className="p-3 w-[160px]">Actor</th>
              <th className="p-3 w-[200px]">Target</th>
              <th className="p-3">Note (redacted)</th>
              <th className="p-3 w-[260px]">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-t">
                  {Array.from({ length: 7 }).map((__, j) => (
                    <td key={j} className="p-3"><div className="h-4 bg-neutral-200 rounded animate-pulse" /></td>
                  ))}
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr><td className="p-6 text-neutral-600" colSpan={7}>No notes found for this filter.</td></tr>
            ) : (
              rows.map((r) => (
                <tr key={r._id} className="border-t align-top">
                  <td className="p-3">{new Date(r.createdAt).toLocaleString()}</td>
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
        <button
          onClick={() => fetchNotes(Math.max(1, page - 1))}
          className="rounded-lg border px-3 py-1.5 hover:bg-neutral-50 disabled:opacity-50"
          disabled={page <= 1 || loading}
        >
          Prev
        </button>
        {pager.map((n) => (
          <button
            key={n}
            onClick={() => fetchNotes(n)}
            className={`rounded-lg border px-3 py-1.5 hover:bg-neutral-50 ${n === page ? "bg-neutral-100" : ""}`}
            disabled={loading}
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => fetchNotes(Math.min(pages, page + 1))}
          className="rounded-lg border px-3 py-1.5 hover:bg-neutral-50 disabled:opacity-50"
          disabled={page >= pages || loading}
        >
          Next
        </button>
      </nav>
    </main>
  );
}
