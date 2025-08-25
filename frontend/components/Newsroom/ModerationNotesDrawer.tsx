import { useEffect, useRef, useState } from "react";

export default function ModerationNotesDrawer({
  targetId,       // draftId or postId
  defaultOpen = false,
}: {
  targetId: string | null;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState<null | "ok" | "err">(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  async function saveNote() {
    if (!targetId || !text.trim()) return;
    setSaving(true);
    setOk(null);
    try {
      await fetch("/api/ingest/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "moderation_note",
          targetId,
          text,
          visibility: "internal",
        }),
      });
      setOk("ok");
      setText("");
    } catch {
      setOk("err");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
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
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-40 rounded-full bg-amber-600 text-white px-4 py-2 shadow-lg hover:bg-amber-700"
      >
        Mod Notes
      </button>

      {open && (
        <div className="fixed inset-0 z-50 mb-16">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl p-4 grid grid-rows-[auto,1fr,auto]"
          >
            <header className="flex items-center justify-between">
              <h3 className="text-base font-semibold">Moderation notes (internal)</h3>
              <button
                ref={closeRef}
                className="text-sm text-neutral-600 hover:underline"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </header>
            <div className="mt-3">
              <textarea
                className="w-full h-64 border rounded-xl p-3"
                placeholder="Leave a private note for moderators/editors. Sensitive data will be redacted on ingest."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              {ok === "ok" && <p className="text-xs text-green-700 mt-2">Saved.</p>}
              {ok === "err" && <p className="text-xs text-red-700 mt-2">Failed to save.</p>}
            </div>
            <footer className="flex items-center justify-end gap-2">
              <button className="rounded-xl border px-3 py-1.5 hover:bg-neutral-50" onClick={() => setOpen(false)}>Done</button>
              <button
                className="rounded-xl bg-amber-600 text-white px-4 py-2 hover:bg-amber-700 disabled:opacity-60"
                onClick={saveNote}
                disabled={!targetId || !text.trim() || saving}
              >
                {saving ? "Saving…" : "Save note"}
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}

