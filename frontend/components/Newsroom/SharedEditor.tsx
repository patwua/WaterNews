import React, { useState } from "react";
import { useRouter } from "next/router";
import MarkdownEditor from "@/components/Newsroom/MarkdownEditor";
import ModerationNotesDrawer from "@/components/Newsroom/ModerationNotesDrawer";
import StatusPill from "@/components/StatusPill";

type SharedEditorProps = {
  title?: string;
  value: string;
  onChange: (v: string) => void;
  status: string;
  onStatusChange: (s: string) => void;
  statusOptions?: string[];
  draftId?: string;
  scheduleAt?: string | null;
  onPreview?: () => void;
  onSubmit?: () => void;
  onSave?: () => void;
  onPublish?: () => Promise<{ slug?: string } | void>;
  showModerationNotes?: boolean;
  rightPanel?: React.ReactNode;
  children?: React.ReactNode;
};

export default function SharedEditor({
  title,
  value,
  onChange,
  status,
  onStatusChange,
  statusOptions,
  draftId,
  scheduleAt: initScheduleAt,
  onPreview,
  onSubmit,
  onSave,
  onPublish,
  showModerationNotes,
  rightPanel,
  children,
}: SharedEditorProps) {
  const router = useRouter();
  const statuses = statusOptions || [
    "draft",
    "in-review",
    "ready",
    "scheduled",
    "published",
    "archived",
  ];
  const [scheduleAt, setScheduleAt] = useState(initScheduleAt || "");
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [toastSlug, setToastSlug] = useState<string | null>(null);

  const isFuture =
    !!scheduleAt && new Date(scheduleAt).getTime() > Date.now();
  const displayStatus = isFuture ? "scheduled" : status;

  async function handleScheduleChange(next: string) {
    const prev = scheduleAt;
    setScheduleAt(next);
    setScheduleError(null);
    if (!draftId) return;
    try {
      await fetch(`/api/newsroom/drafts/${draftId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publishAt: next || null }),
      });
    } catch {
      setScheduleAt(prev);
      setScheduleError("Failed to save schedule");
    }
  }

  async function handlePublish() {
    if (publishing) return;
    setPublishing(true);
    try {
      let slug: string | undefined;
      if (onPublish) {
        const r = await onPublish();
        if (r && (r as any).slug) slug = (r as any).slug;
      } else if (draftId) {
        const res = await fetch(
          `/api/newsroom/drafts/${draftId}/publish`,
          { method: "POST" }
        );
        const data = await res.json();
        slug = data?.slug;
      }
      if (slug) setToastSlug(slug);
    } finally {
      setPublishing(false);
    }
  }

  function openPreview(slug: string, live = false) {
    const url = live ? `/news/${slug}` : `/news/${slug}?preview=1`;
    window.open(url, "_blank");
  }

  const main = (
    <div className="max-w-4xl">
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          className="border rounded px-2 py-1"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <MarkdownEditor
        value={value}
        onChange={onChange}
        onSave={onSave}
        draftId={draftId}
      />
      {children}
    </div>
  );

  return (
    <section className="mt-6">
      <div className="sticky top-0 z-30 bg-gradient-to-r from-gray-50 to-white/90 backdrop-blur border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => router.push("/newsroom/writer-dashboard")}
              className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-md border hover:bg-gray-50"
              aria-label="Back to Newsroom"
              title="Back to Newsroom"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"
                />
              </svg>
            </button>
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-wide text-gray-500">
                Editor
              </div>
              <div className="font-semibold truncate">
                {title || "Untitled draft"}
              </div>
            </div>
            {displayStatus && (
              <div className="hidden sm:block">
                <StatusPill status={displayStatus} />
              </div>
            )}
            {isFuture && (
              <div className="hidden sm:block text-xs text-gray-500">
                Publishes at {new Date(scheduleAt).toLocaleString()}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <input
                type="datetime-local"
                className="border rounded px-2 py-1"
                value={scheduleAt}
                onChange={(e) => handleScheduleChange(e.target.value)}
              />
            </div>
            {scheduleError && (
              <div className="text-xs text-red-600">{scheduleError}</div>
            )}
            <button
              onClick={onPreview}
              className="px-3 py-2 rounded-md border hover:bg-gray-50"
            >
              Preview
            </button>
            <button
              onClick={onSubmit}
              className="px-3 py-2 rounded-md border hover:bg-gray-50"
            >
              Submit
            </button>
            <button
              onClick={handlePublish}
              className="px-3 py-2 rounded-md bg-black text-white hover:bg-gray-900"
              disabled={publishing}
            >
              {publishing ? "Saving…" : "Publish"}
            </button>
          </div>
        </div>
      </div>
      {rightPanel ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-4">
          {main}
          {rightPanel}
        </div>
      ) : (
        main
      )}
      {showModerationNotes && <ModerationNotesDrawer targetId={draftId} />}
      {toastSlug && (
        <div className="fixed bottom-4 right-4 z-50 bg-gray-800 text-white px-4 py-3 rounded-md shadow flex items-center gap-3 text-sm">
          <span>Preview ready.</span>
          <button
            onClick={() => openPreview(toastSlug)}
            className="underline"
          >
            Open preview
          </button>
          <button
            onClick={() => openPreview(toastSlug, true)}
            className="underline"
          >
            View live
          </button>
          <button
            onClick={() => setToastSlug(null)}
            className="ml-1"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}
    </section>
  );
}

