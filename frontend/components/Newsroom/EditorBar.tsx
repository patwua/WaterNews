import { useMemo } from "react";

export default function EditorBar({
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
          onChange={(e) => onChange({ tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
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
        <button onClick={onSave} className="rounded-xl border px-3 py-2 hover:bg-neutral-50">Save</button>
        <button onClick={onPublish} className="rounded-xl bg-blue-600 text-white px-4 py-2 hover:bg-blue-700">Publish</button>
        <button onClick={onOpenLinkChecker} className="rounded-md border px-2 py-1 text-xs">Link checker</button>
        <button onClick={onOpenSimilarity} className="rounded-md border px-2 py-1 text-xs">Similarity</button>
        <button onClick={onOpenSummary} className="rounded-md border px-2 py-1 text-xs">Summary</button>
      </div>
    </div>
  );
}
