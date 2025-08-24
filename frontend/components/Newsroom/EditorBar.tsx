import React, { useMemo } from "react";
import StatusPill from "@/components/StatusPill";

export function LegacyEditorBar({
  value,
  onChange,
  onSave,
  onPublish,
  onOpenLinkChecker,
  onOpenSimilarity,
  onOpenSummary,
}: {
  value: {
    title: string;
    summary: string;
    coverImage: string;
    tags: string[];
    type: "news" | "vip" | "post" | "ads";
    status: "draft" | "scheduled" | "published";
    scheduledFor?: string | null;
  };
  onChange: (patch: Partial<typeof value>) => void;
  onSave: () => void;
  onPublish: () => void;
  onOpenLinkChecker?: () => void;
  onOpenSimilarity?: () => void;
  onOpenSummary?: () => void;
}) {
  const tagText = useMemo(() => value.tags.join(", "), [value.tags]);
  return (
    <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto p-3 flex flex-wrap gap-3 items-center">
        <input
          className="flex-1 min-w-[240px] rounded-xl border px-3 py-2"
          placeholder="Headline..."
          value={value.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
        <input
          className="basis-[320px] grow rounded-xl border px-3 py-2"
          placeholder="Summary (1–2 sentences)"
          value={value.summary}
          onChange={(e) => onChange({ summary: e.target.value })}
        />
        <input
          className="basis-[220px] grow rounded-xl border px-3 py-2"
          placeholder="Cover image URL"
          value={value.coverImage}
          onChange={(e) => onChange({ coverImage: e.target.value })}
        />
        <input
          className="basis-[220px] grow rounded-xl border px-3 py-2"
          placeholder="tags (comma-separated)"
          value={tagText}
          onChange={(e) =>
            onChange({ tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })
          }
        />
        <select
          className="rounded-xl border px-3 py-2"
          value={value.type}
          onChange={(e) => onChange({ type: e.target.value as any })}
        >
          <option value="news">News</option>
          <option value="vip">VIP</option>
          <option value="post">Post</option>
          <option value="ads">Ads</option>
        </select>
        <button onClick={onSave} className="rounded-xl border px-3 py-2 hover:bg-neutral-50">
          Save
        </button>
        <button onClick={onPublish} className="rounded-xl bg-blue-600 text-white px-4 py-2 hover:bg-blue-700">
          Publish
        </button>
        <button onClick={onOpenLinkChecker} className="rounded-md border px-2 py-1 text-xs">
          Link checker
        </button>
        <button onClick={onOpenSimilarity} className="rounded-md border px-2 py-1 text-xs">
          Similarity
        </button>
        <button onClick={onOpenSummary} className="rounded-md border px-2 py-1 text-xs">
          Summary
        </button>
      </div>
    </div>
  );
}

export default function EditorBar({
  title,
  status,
  onSubmit,
  onPublish,
  onPreview,
  onBack,
  saving,
  rightExtra,
}: {
  title?: string;
  status?: string;
  onSubmit?: () => void;
  onPublish?: () => void;
  onPreview?: () => void;
  onBack?: () => void;
  saving?: boolean;
  rightExtra?: React.ReactNode;
}) {
  return (
    <div className="sticky top-0 z-30 bg-gradient-to-r from-gray-50 to-white/90 backdrop-blur border-b">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-md border hover:bg-gray-50"
            aria-label="Back to Newsroom"
            title="Back to Newsroom"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
              <path fill="currentColor" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wide text-gray-500">Editor</div>
            <div className="font-semibold truncate">{title || "Untitled draft"}</div>
          </div>
          {status && (
            <div className="hidden sm:block">
              <StatusPill status={status} />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {rightExtra}
          <button onClick={onPreview} className="px-3 py-2 rounded-md border hover:bg-gray-50">
            Preview
          </button>
          <button onClick={onSubmit} className="px-3 py-2 rounded-md border hover:bg-gray-50">
            Submit
          </button>
          <button
            onClick={onPublish}
            className="px-3 py-2 rounded-md bg-black text-white hover:bg-gray-900"
            disabled={saving}
          >
            {saving ? "Saving…" : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
