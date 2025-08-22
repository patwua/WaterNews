import { useEffect, useState } from 'react';

type Counts = { like: number; insight: number; question: number };
const types: Array<keyof Counts> = ['like','insight','question'];

export default function ReactionBar({ slug }: { slug: string }) {
  const [counts, setCounts] = useState<Counts>({ like: 0, insight: 0, question: 0 });
  const [busy, setBusy] = useState<keyof Counts | ''>('');

  async function load() {
    const r = await fetch(`/api/reactions/summary?slug=${encodeURIComponent(slug)}`);
    const d = await r.json();
    if (r.ok) setCounts(d);
  }
  useEffect(() => { void load(); }, [slug]);

  async function toggle(type: keyof Counts) {
    setBusy(type);
    try {
      const r = await fetch('/api/reactions/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, type })
      });
      if (!r.ok) return;
      await load();
    } finally {
      setBusy('');
    }
  }

  return (
    <div className="flex items-center gap-3">
      {types.map((t) => (
        <button key={t} onClick={()=>toggle(t)} className="px-3 py-2 rounded-full border text-sm">
          {busy === t ? '…' : null}
          {t === 'like' ? '👍' : t === 'insight' ? '💡' : '❓'}{' '}
          <span className="capitalize">{t}</span> {counts[t] ? `(${counts[t]})` : ''}
        </button>
      ))}
    </div>
  );
}
