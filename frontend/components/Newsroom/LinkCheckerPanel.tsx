import { useEffect, useState } from "react";

function extractLinks(markdown: string): string[] {
  const urls = new Set<string>();
  const re = /\[[^\]]*?\]\((https?:\/\/[^\s)]+)\)/g;
  let m; while ((m = re.exec(markdown))) urls.add(m[1]);
  return Array.from(urls);
}

export default function LinkCheckerPanel({ value }: { value: string }) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<any[]>([]);

  async function run(urls: string[]) {
    if (!urls.length) { setRows([]); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/newsroom/link-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls }),
      });
      const data = await res.json();
      setRows(data.results || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const urls = extractLinks(value);
    run(urls);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusClass = (s: number, hints: string[]) => {
    if (hints.includes("timeout")) return "bg-yellow-100 text-yellow-800";
    if (s >= 500) return "bg-red-100 text-red-800";
    if (s >= 400) return "bg-orange-100 text-orange-800";
    if (s >= 300) return "bg-blue-100 text-blue-800";
    if (s >= 200) return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

  const urls = extractLinks(value);

  return (
    <div className="rounded-lg border p-3">
      <div className="mb-2 flex items-center justify-between text-sm">
        <div>Link checker • {urls.length} link(s)</div>
        <button onClick={() => run(urls)} className="rounded-md border px-2 py-1 text-xs">Recheck all</button>
      </div>
      {loading ? <div className="text-xs text-neutral-500">Checking…</div> : null}
      <ul className="space-y-2">
        {rows.map((r) => (
          <li key={r.url} className="flex items-center justify-between gap-3">
            <a href={r.url} target="_blank" rel="noreferrer" className="truncate text-sm underline">{r.url}</a>
            <div className="flex items-center gap-2">
              <span className={`rounded px-2 py-0.5 text-xs ${statusClass(r.status, r.hint)}`}>{r.status || "timeout"}</span>
              {r.hint?.map((h: string) => (
                <span key={h} className="rounded bg-neutral-100 px-2 py-0.5 text-xs">{h}</span>
              ))}
            </div>
          </li>
        ))}
      </ul>
      {!rows.length && !loading ? <div className="text-xs text-neutral-400">No external links detected.</div> : null}
    </div>
  );
}

