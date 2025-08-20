import { useEffect, useState } from "react";
import Link from "next/link";

export default function DraftsList() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [items, setItems] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    fetch(`/api/drafts/list?${params}`).then(r=>r.json()).then(d=>setItems(d.items||[]));
  }, [q, status]);

  async function createDraft() {
    const r = await fetch("/api/drafts/create", { method:"POST", headers:{ "Content-Type":"application/json"}, body: JSON.stringify({}) });
    const d = await r.json();
    if (d.id) location.href = `/admin/drafts/${d.id}`;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Drafts</h1>
        <button onClick={createDraft} className="px-4 py-2 bg-blue-600 text-white rounded-lg">New Draft</button>
      </div>

      <div className="mt-4 flex gap-3">
        <input className="border rounded px-3 py-2" placeholder="Search…" value={q} onChange={e=>setQ(e.target.value)} />
        <select className="border rounded px-3 py-2" value={status} onChange={e=>setStatus(e.target.value)}>
          {["all","draft","in-review","ready","scheduled","published","archived"].map(s=><option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="mt-6 bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 text-left text-sm">
            <tr>
              <th className="px-4 py-2">Updated</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Assigned</th>
              <th className="px-4 py-2">Scheduled</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {items.map(x=>(
              <tr key={x._id} className="border-t">
                <td className="px-4 py-2">{new Date(x.updatedAt).toLocaleString()}</td>
                <td className="px-4 py-2">{x.title}</td>
                <td className="px-4 py-2 capitalize">{x.status}</td>
                <td className="px-4 py-2">{x.assignedTo?.name || x.assignedTo?.email || "—"}</td>
                <td className="px-4 py-2">{x.scheduledAt ? new Date(x.scheduledAt).toLocaleString() : "—"}</td>
                <td className="px-4 py-2">
                  <Link href={`/admin/drafts/${x._id}`} className="text-blue-600 underline">Open</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
