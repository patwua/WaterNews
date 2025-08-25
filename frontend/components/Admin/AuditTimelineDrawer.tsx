import React, { useEffect, useMemo, useRef } from "react";

export default function AuditTimelineDrawer({ events, open, onClose }: { events: any[]; open: boolean; onClose: () => void }) {
  const grouped = useMemo(() => {
    const map = new Map<string, any[]>();
    for (const e of events || []) {
      const d = new Date(e.createdAt || e.ts || Date.now());
      const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    return Array.from(map.entries()).sort(([a], [b]) => (a < b ? 1 : -1));
  }, [events]);

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

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
          <div className="text-sm font-medium">Audit Timeline</div>
          <button
            ref={closeRef}
            onClick={onClose}
            className="rounded border px-2 py-0.5 text-xs hover:bg-neutral-50"
          >
            Close
          </button>
        </div>
        <div className="space-y-6">
          {grouped.map(([day, rows]) => (
            <section key={day}>
              <div className="mb-2 text-xs font-semibold text-neutral-500">{day}</div>
              <ul className="space-y-2">
                {rows.map((e, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-neutral-100 text-[11px]">
                      {e.type === "approve" ? "✓" : e.type === "archive" ? "⧉" : e.type === "second_review" ? "②" : "•"}
                    </span>
                    <div className="text-xs">
                      <div className="font-medium">{e.type || "event"}</div>
                      <div className="text-neutral-500">{e.note || ""}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </aside>
    </div>
  );
}

