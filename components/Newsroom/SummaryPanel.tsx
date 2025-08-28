import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  body: string;
  draftId: string | number;
};

export default function SummaryPanel({ open, onClose, body, draftId }: Props) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!open) return;
    setSummary("");
    setError(null);
  }, [open]);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/newsroom/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Summarization failed");
      setSummary(data.summary || "");
    } catch (e: any) {
      setError(e?.message || "Failed to generate summary");
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    setLoading(true);
    setError(null);
    try {
      await fetch(`/api/newsroom/drafts/${draftId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ excerpt: summary, meta: { description: summary } }),
      });
      onClose();
    } catch (e: any) {
      setError(e?.message || "Failed to save summary");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <aside className="relative z-10 h-full w-full max-w-md overflow-y-auto bg-white p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-medium">AI Summary</div>
          <div className="text-xs text-neutral-500">Generate → Edit → Save</div>
        </div>
        <div className="mb-3 flex items-center gap-2">
          <button
            onClick={generate}
            disabled={loading}
            className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
          >
            {loading ? "Generating…" : "Generate Summary"}
          </button>
          <button
            onClick={save}
            disabled={loading || !summary.trim()}
            className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
          >
            Save to excerpt/meta
          </button>
        </div>
        {error ? <div className="mb-3 rounded bg-red-50 p-2 text-xs text-red-700">{error}</div> : null}
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Your summary will appear here…"
          className="min-h-[50vh] w-full resize-y rounded-lg border p-3 text-sm"
        />
        <p className="mt-2 text-xs text-neutral-500">
          Tip: you can edit the summary before saving. Saving writes to <code>excerpt</code> and <code>meta.description</code>.
        </p>
      </aside>
    </div>
  );
}
