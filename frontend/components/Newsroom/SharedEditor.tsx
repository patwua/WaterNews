import React from "react";
import MarkdownEditor from "@/components/Newsroom/MarkdownEditor";
import ModerationNotesDrawer from "@/components/Newsroom/ModerationNotesDrawer";

type SharedEditorProps = {
  value: string;
  onChange: (v: string) => void;
  status: string;
  onStatusChange: (s: string) => void;
  statusOptions?: string[];
  draftId?: string;
  onSave?: () => void;
  showModerationNotes?: boolean;
  rightPanel?: React.ReactNode;
  children?: React.ReactNode;
};

export default function SharedEditor({
  value,
  onChange,
  status,
  onStatusChange,
  statusOptions,
  draftId,
  onSave,
  showModerationNotes,
  rightPanel,
  children,
}: SharedEditorProps) {
  const statuses = statusOptions || [
    "draft",
    "in-review",
    "ready",
    "scheduled",
    "published",
    "archived",
  ];

  const main = (
    <div className="max-w-4xl">
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
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
      <MarkdownEditor value={value} onChange={onChange} onSave={onSave} draftId={draftId} />
      {children}
    </div>
  );

  return (
    <section className="mt-6">
      {rightPanel ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-4">
          {main}
          {rightPanel}
        </div>
      ) : (
        main
      )}
      {showModerationNotes && <ModerationNotesDrawer targetId={draftId} />}
    </section>
  );
}
