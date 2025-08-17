import { useEffect, useMemo, useState } from "react";
import marked from "marked";

export default function MarkdownEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [tab, setTab] = useState<"edit" | "preview">("edit");

  const html = useMemo(() => {
    try {
      const m: any = marked as any;
      return m.parse ? m.parse(value || "") : m(value || "");
    } catch {
      return "<p>Preview unavailable.</p>";
    }
  }, [value]);

  useEffect(() => {
    // Simple autosize for textarea
    const ta = document.getElementById("md-editor") as HTMLTextAreaElement | null;
    if (!ta) return;
    const resize = () => {
      ta.style.height = "auto";
      ta.style.height = Math.min(800, ta.scrollHeight) + "px";
    };
    resize();
  }, [value, tab]);

  return (
    <div className="rounded-2xl border overflow-hidden">
      <div className="flex border-b bg-neutral-50">
        <button
          className={`px-4 py-2 text-sm ${tab === "edit" ? "border-b-2 border-blue-600 text-blue-700" : ""}`}
          onClick={() => setTab("edit")}
        >
          Edit
        </button>
        <button
          className={`px-4 py-2 text-sm ${tab === "preview" ? "border-b-2 border-blue-600 text-blue-700" : ""}`}
          onClick={() => setTab("preview")}
        >
          Preview
        </button>
      </div>
      {tab === "edit" ? (
        <textarea
          id="md-editor"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write your story in Markdown. Paste links, use #tags in-body if you like."
          className="w-full p-4 outline-none min-h-[280px]"
        />
      ) : (
        <div className="prose max-w-none p-4" dangerouslySetInnerHTML={{ __html: html }} />
      )}
    </div>
  );
}
