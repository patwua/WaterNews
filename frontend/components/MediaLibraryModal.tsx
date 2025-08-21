import React, { useEffect, useState } from 'react';

export default function MediaLibraryModal({
  open,
  onClose,
  onSelect
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (asset: any) => void;
}) {
  const [q, setQ] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function load(cursor?: string) {
    try {
      setLoading(true);
      setError(null);
      const qs = new URLSearchParams();
      if (q) qs.set('q', q);
      if (cursor) qs.set('nextCursor', cursor);
      const r = await fetch(`/api/media/list?${qs.toString()}`);
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error || 'Failed to load media');
      setItems(cursor ? [...items, ...(d.resources || [])] : (d.resources || []));
      setNextCursor(d.nextCursor || null);
    } catch (e: any) {
      setError(e?.message || 'Failed to load media');
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-[90vw] max-w-5xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="font-medium">Media Library</div>
          <input
            className="ml-auto border rounded px-2 py-1 text-sm w-[240px]"
            placeholder="Search filename or tag…"
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            onKeyDown={(e)=>{ if (e.key === 'Enter') load(); }}
          />
          <button className="text-sm px-3 py-1 border rounded" onClick={()=>load()}>Search</button>
          <button onClick={onClose} className="text-sm underline">Close</button>
        </div>

        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        {loading && <div className="text-gray-500 text-sm mb-2">Loading…</div>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[60vh] overflow-auto">
          {items.map((it) => (
            <button
              key={it.public_id}
              onClick={() => { onSelect(it); onClose(); }}
              className="text-left border rounded overflow-hidden hover:shadow focus:outline-none"
              title={it.public_id}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.secure_url || it.url} alt={it.public_id} className="w-full h-36 object-cover" />
              <div className="p-2">
                <div className="text-xs font-medium truncate">{it.public_id}</div>
                <div className="text-[10px] text-gray-500 truncate">{(it.tags || []).join(', ')}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="text-xs text-gray-500">{items.length} items</div>
          {nextCursor ? (
            <button className="text-sm px-3 py-1 border rounded" onClick={()=>load(nextCursor!)}>Load more</button>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
