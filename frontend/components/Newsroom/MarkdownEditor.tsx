// Avoid importing React event types from the module; rely on the local React shim's global namespace.
// (No type imports from 'react' in this file to prevent mixed origins.)
import { useEffect, useRef, useState } from "react";
import { readingTime } from "@/lib/readingTime";

export default function MarkdownEditor({ draft, onChange }: { draft: any; onChange: (val: string) => void }) {
  const [value, setValue] = useState(draft?.body || "");
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const saveTimer = useRef<any>(null);
  const saving = useRef(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setValue(draft?.body || "");
  }, [draft?.id]);

  function scheduleSave(next: string) {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      if (saving.current) return;
      saving.current = true;
      try {
        await fetch(`/api/newsroom/drafts/${draft.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body: next }),
        });
        setSavedAt(Date.now());
      } catch {}
      saving.current = false;
    }, 600);
  }

  function handleChange(v: string) {
    setValue(v);
    onChange(v);
    scheduleSave(v);
  }

  function insertSnippet(snippet: string) {
    const el = taRef.current;
    if (!el) return;
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? start;
    const next = value.slice(0, start) + snippet + value.slice(end);
    setValue(next);
    onChange(next);
    scheduleSave(next);
    requestAnimationFrame(() => {
      const pos = start + snippet.length;
      el.setSelectionRange(pos, pos);
      el.focus();
    });
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const mod = e.metaKey || e.ctrlKey;
    if (!mod) return;
    if (e.key.toLowerCase() === "b") { e.preventDefault(); wrap("**"); }
    if (e.key.toLowerCase() === "i") { e.preventDefault(); wrap("_"); }
    if (e.key.toLowerCase() === "k") { e.preventDefault(); insertSnippet("[](https://)"); }
    if (["1","2","3"].includes(e.key)) { e.preventDefault(); heading(Number(e.key) as 1|2|3); }
  };

  function wrap(token: string) {
    const el = taRef.current; if (!el) return;
    const s = el.selectionStart ?? 0, e = el.selectionEnd ?? 0;
    const sel = value.slice(s, e);
    const next = value.slice(0, s) + token + sel + token + value.slice(e);
    setValue(next); onChange(next); scheduleSave(next);
    requestAnimationFrame(() => { el.setSelectionRange(s+token.length, e+token.length); el.focus(); });
  }

  function heading(level: 1|2|3) {
    const el = taRef.current; if (!el) return;
    const s = el.selectionStart ?? 0;
    const lineStart = value.lastIndexOf("\n", s - 1) + 1;
    const prefix = "#".repeat(level) + " ";
    const next = value.slice(0, lineStart) + prefix + value.slice(lineStart);
    setValue(next); onChange(next); scheduleSave(next);
    requestAnimationFrame(() => { el.setSelectionRange(s+prefix.length, s+prefix.length); el.focus(); });
  }

  const words = value.trim().length ? value.trim().split(/\s+/).length : 0;
  const rt = readingTime(value || "");

  return (
    <div className="flex flex-col gap-2">
      {/* Snippet palette (simple buttons) */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => insertSnippet("**Lede:** Write a sharp opening paragraph here.\n\n")} className="rounded-md border px-2 py-1 text-xs">Lede</button>
        <button onClick={() => insertSnippet("## Subhead\n\n")} className="rounded-md border px-2 py-1 text-xs">Subhead (H2)</button>
        <button onClick={() => insertSnippet("> “Pull‑quote goes here.”\n\n")} className="rounded-md border px-2 py-1 text-xs">Pull‑quote</button>
        <button onClick={() => insertSnippet("**Recap:** • Point 1 • Point 2 • Point 3\n\n")} className="rounded-md border px-2 py-1 text-xs">Recap box</button>
      </div>

      <textarea
        ref={taRef}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={onKeyDown}
        className="min-h-[50vh] w-full resize-y rounded-lg border p-4 font-mono text-sm"
        placeholder="Start writing…"
      />

      {/* Status bar */}
      <div className="flex items-center justify-between text-xs text-neutral-500">
        <div>{words} words • ~{Math.max(1, Math.round(rt.minutes))} min read</div>
        <div>{savedAt ? "Saved just now" : "Autosave on"}</div>
      </div>
    </div>
  );
}

