import { useEffect, useState } from "react";

type AuditRow = {
  _id: string;
  action: "ingest_create" | "assign" | "release" | "flag_second" | "resolve" | "reopen";
  actorId?: string | null;
  targetKind: "event";
  targetId: string;
  prev?: any;
  next?: any;
  meta?: Record<string, any>;
  createdAt: string;
};

export default function AuditTimelineDrawer({
  eventId,
  open,
  onClose,
}: {
  eventId: string | null;
  open: boolean;
  onClose: () => void;
}) {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (!open || !eventId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/moderation/audit/${encodeURIComponent(eventId)}`);
        const json = await res.json();
        setRows(json.rows || []);
      } catch {
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [open, eventId]);

  return (
    <>
      {open && <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/30" onClick={onClose} />
        <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-xl grid grid-rows-[auto,1fr]">
          <header className="p-4 border-b flex items-center justify-between">
            <h3 className="text-base font-semibold">Audit trail</h3>
            <button onClick={onClose} className="text-sm text-neutral-600 hover:underline">Close</button>
          </header>
          <div className="overflow-auto p-4">
            {loading ? (
              <div className="space-y-2">
                <div className="h-4 rounded bg-neutral-200 animate-pulse" />
                <div className="h-4 rounded bg-neutral-200 animate-pulse" />
              </div>
            ) : rows.length === 0 ? (
              <p className="text-sm text-neutral-600">No audit entries.</p>
            ) : (
              <ul className="space-y-3">
                {rows.map((r) => (
                  <li key={r._id} className="p-3 rounded-lg bg-white ring-1 ring-black/5">
                    <div className="text-sm">
                      <span className="font-medium">{r.action}</span>
                      <span className="text-neutral-500"> • {new Date(r.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-neutral-700">
                      {r.actorId ? <>Actor: <span className="font-medium">{r.actorId}</span></> : <span className="text-neutral-500">Actor: —</span>}
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="font-medium text-neutral-600 mb-1">Previous</div>
                        <pre className="whitespace-pre-wrap bg-neutral-50 p-2 rounded">{JSON.stringify(r.prev ?? {}, null, 2)}</pre>
                      </div>
                      <div>
                        <div className="font-medium text-neutral-600 mb-1">Next</div>
                        <pre className="whitespace-pre-wrap bg-neutral-50 p-2 rounded">{JSON.stringify(r.next ?? {}, null, 2)}</pre>
                      </div>
                    </div>
                    {r.meta && Object.keys(r.meta).length > 0 && (
                      <div className="mt-2 text-xs text-neutral-600">
                        Meta: <code className="bg-neutral-50 px-1 py-0.5 rounded">{JSON.stringify(r.meta)}</code>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>}
    </>
  );
}

