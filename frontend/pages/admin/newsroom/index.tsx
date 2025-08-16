import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Row = {
  _id: string;
  title: string;
  slug: string;
  status: "draft" | "scheduled" | "published";
  updatedAt: string;
  type: "news" | "vip" | "post" | "ads";
};

export default function NewsroomListPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    const res = await api<{ rows: Row[] }>("/api/newsroom/drafts");
    setRows(res.rows);
  }

  async function search() {
    const res = await api<{ rows: Row[] }>(`/api/newsroom/drafts?q=${encodeURIComponent(q)}`);
    setRows(res.rows);
  }

  return (
    <main className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Newsroom</h1>
        <Link href="/admin/newsroom/editor" className="rounded-xl bg-blue-600 text-white px-4 py-2 hover:bg-blue-700">New Draft</Link>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title..." className="rounded-xl border px-3 py-2" />
        <button onClick={search} className="rounded-xl border px-3 py-2 hover:bg-neutral-50">Search</button>
        <button onClick={refresh} className="rounded-xl border px-3 py-2 hover:bg-neutral-50">Reset</button>
      </div>

      <div className="overflow-auto rounded-2xl border">
        <table className="min-w-[680px] w-full">
          <thead className="bg-neutral-50 text-left text-sm">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Type</th>
              <th className="p-3">Status</th>
              <th className="p-3">Updated</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {rows.map((r) => (
              <tr key={r._id} className="border-t">
                <td className="p-3">{r.title}</td>
                <td className="p-3">{r.type}</td>
                <td className="p-3">{r.status}</td>
                <td className="p-3">{new Date(r.updatedAt).toLocaleString()}</td>
                <td className="p-3 text-right">
                  <Link href={`/admin/newsroom/editor?id=${r._id}`} className="text-blue-600 hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="p-6 text-neutral-600" colSpan={5}>No drafts yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
