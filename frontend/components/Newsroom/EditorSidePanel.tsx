import { useEffect, useState } from "react";

export default function EditorSidePanel({
  title,
  tags,
  onInsertReferences,
}: {
  title: string;
  tags: string[];
  onInsertReferences: (items: { slug: string; title: string }[]) => void;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const qs = new URLSearchParams({
          title: title || "",
          tags: (tags || []).join(","),
        });
        const res = await fetch(`/api/recs/related?${qs}`);
        const json = await res.json();
        setItems(json.items || []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    if (title || (tags && tags.length)) run();
  }, [title, JSON.stringify(tags)]);

  return (
    <aside className="sticky top-16 h-[calc(100vh-6rem)] overflow-auto p-3 border-l bg-neutral-50/40">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">Related stories</h3>
        <button
          className="text-xs text-blue-600 hover:underline"
          onClick={() => onInsertReferences(items.map((x:any) => ({ slug: x.slug, title: x.title })))}
          disabled={!items.length}
        >
          Insert refs
        </button>
      </div>
      {loading ? (
        <div className="space-y-2">
          <div className="h-16 rounded-lg bg-neutral-200 animate-pulse" />
          <div className="h-16 rounded-lg bg-neutral-200 animate-pulse" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-neutral-600">No related items yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((it:any) => (
            <li key={it.slug} className="p-2 rounded-lg bg-white ring-1 ring-black/5">
              <a href={`/news/${it.slug}`} target="_blank" rel="noreferrer" className="text-sm font-medium hover:underline">
                {it.title}
              </a>
              <div className="text-xs text-neutral-600">Score {it.score}</div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
