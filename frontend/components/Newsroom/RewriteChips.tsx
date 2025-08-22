import { useState } from 'react';

type Props = {
  getSelection: () => { start: number; end: number; text: string };
  replaceSelection: (next: string) => void;
  getText: () => string;
  setText: (t: string) => void;
};

export default function RewriteChips({ getSelection, replaceSelection, getText, setText }: Props) {
  const [busy, setBusy] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ mode: string; text: string } | null>(null);

  async function run(mode: string) {
    const sel = getSelection();
    const source = (sel.text && sel.text.trim()) || getText();
    if (!source.trim()) return;
    setBusy(mode);
    try {
      const r = await fetch('/api/newsroom/assistant/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: source, mode }),
      });
      const d = await r.json();
      if (r.ok && d?.text) setPreview({ mode, text: d.text });
    } finally {
      setBusy(null);
    }
  }

  function applyReplace() {
    if (!preview) return;
    const sel = getSelection();
    if (sel.text) replaceSelection(preview.text);
    else setText(preview.text);
    setPreview(null);
  }

  function applyAppend() {
    if (!preview) return;
    const t = getText();
    setText(t ? `${t}\n\n${preview.text}` : preview.text);
    setPreview(null);
  }

  const Chip = ({ mode, label }: { mode: string; label: string }) => (
    <button
      disabled={!!busy}
      onClick={() => run(mode)}
      className="px-2 py-1 text-xs rounded-full border hover:bg-gray-50 disabled:opacity-50"
      title={`Rewrite: ${label}`}
    >
      {busy === mode ? '…' : label}
    </button>
  );

  return (
    <div className="mt-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-500 mr-1">AI Assist:</span>
        <Chip mode="concise" label="Tighten" />
        <Chip mode="neutral" label="Neutral tone" />
        <Chip mode="seo_headline" label="SEO headline" />
        <Chip mode="summarize" label="Summarize" />
      </div>
      {preview ? (
        <div className="mt-2 border rounded-xl p-2 bg-white shadow-sm">
          <div className="text-[11px] text-gray-500 mb-1 uppercase tracking-wide">{preview.mode}</div>
          <div className="text-sm whitespace-pre-wrap">{preview.text}</div>
          <div className="mt-2 flex items-center gap-2">
            <button className="px-2 py-1 text-xs rounded border" onClick={applyReplace}>Replace selection</button>
            <button className="px-2 py-1 text-xs rounded border" onClick={applyAppend}>Append</button>
            <button className="px-2 py-1 text-xs rounded border" onClick={()=>setPreview(null)}>Dismiss</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
