import { useEffect, useRef, useState } from "react";

export default function SimilarityDrawer({ value, threshold = 0.75, open, onClose }:
  { value: string; threshold?: number; open: boolean; onClose: () => void }) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    let id: any;
    id = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/newsroom/similarity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: value, limit: 6 }),
        });
        const data = await res.json();
        setRows(Array.isArray(data?.results) ? data.results : []);
      } finally { setLoading(false); }
    }, 1000);
    return () => clearTimeout(id);
  }, [open, value]);

  const flagged = rows.some((r) => (r.score ?? 0) >= threshold);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "Tab") {
        const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!nodes || nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            (last as HTMLElement).focus();
          }
        } else if (document.activeElement === last) {
          e.preventDefault();
          (first as HTMLElement).focus();
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    closeRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <aside
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        className="relative z-10 h-full w-full max-w-md overflow-y-auto bg-white p-4 shadow-xl"
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-medium">Similarity</div>
          <div className="flex items-center gap-2">
            {flagged ? (
              <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-800">Possible duplicate</span>
            ) : null}
            <button
              ref={closeRef}
              onClick={onClose}
              className="rounded border px-2 py-0.5 text-xs hover:bg-neutral-50"
            >
              Close
            </button>
          </div>
        </div>
        {loading ? <div className="text-xs text-neutral-500">Computing…</div> : null}
        <ul className="space-y-3">
          {rows.map((r) => (
            <li key={r.id} className="rounded border p-2">
              <div className="mb-1 flex items-center justify-between text-sm">
                <a href={r.url} target="_blank" rel="noreferrer" className="font-medium underline">{r.title || r.slug}</a>
                <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs">{(r.score ?? 0).toFixed(2)}</span>
              </div>
              <div className="line-clamp-2 text-xs text-neutral-500">{r.excerpt || r.preview || ""}</div>
            </li>
          ))}
        </ul>
        {!rows.length && !loading ? <div className="text-xs text-neutral-400">No similar items found.</div> : null}
      </aside>
    </div>
  );
}

