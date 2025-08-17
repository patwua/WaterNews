import { useEffect, useRef, useState } from "react";

function useDebounced<T>(value: T, delay = 250) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

type Item = {
  slug: string;
  title: string;
  excerpt?: string;
  publishedAt?: string;
  tags?: string[];
};

export default function SearchBox() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);

  const dq = useDebounced(q, 250);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listboxId = "searchbox-listbox";
  const optionId = (i: number) => `searchbox-option-${i}`;

  useEffect(() => {
    const run = async () => {
      if (!dq) {
        setItems([]);
        setOpen(false);
        return;
      }
      setLoading(true);
      try {
        const qs = new URLSearchParams();
        qs.set("q", dq);
        qs.set("limit", "8");
        const res = await fetch(`/api/search?${qs}`);
        const json = await res.json();
        setItems(json.items || []);
        setOpen(true);
        setActive(0);
      } catch {
        setItems([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [dq]);

  // Close on outside click / ESC
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || !items.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(items.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const it = items[active];
      if (it) window.location.href = `/news/${it.slug}`;
    }
  };

  return (
    <div ref={rootRef} className="relative w-full max-w-md">
      <input
        ref={inputRef}
        className="w-full rounded-xl border px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
        placeholder="Search headlines…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => { if (items.length) setOpen(true); }}
        onKeyDown={onKeyDown}
        aria-label="Search stories"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-activedescendant={open ? optionId(active) : undefined}
      />

      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Search results"
          className="absolute z-40 mt-2 w-full rounded-2xl bg-white shadow-lg ring-1 ring-black/5 overflow-hidden"
        >
          <div className="px-3 py-2 text-xs text-neutral-600 border-b">
            {loading ? "Searching…" : items.length ? `Results (${items.length})` : "No results"}
          </div>
          <ul className="max-h-96 overflow-auto">
            {items.map((it, i) => (
              <li key={it.slug} id={optionId(i)} role="option" aria-selected={i === active}>
                <a
                  href={`/news/${it.slug}`}
                  className={["block px-3 py-2 text-sm", i === active ? "bg-neutral-50" : "", "focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"].join(" ")}
                  onMouseEnter={() => setActive(i)}
                >
                  <div className="font-medium line-clamp-1">{it.title}</div>
                  {it.excerpt ? (
                    <div className="text-xs text-neutral-600 line-clamp-2">{it.excerpt}</div>
                  ) : null}
                  <div className="mt-0.5 text-[11px] text-neutral-500">
                    {it.publishedAt ? new Date(it.publishedAt).toLocaleString() : ""}
                  </div>
                </a>
              </li>
            ))}
          </ul>
          <div className="px-3 py-2 text-xs text-neutral-600 border-t">
            Press <kbd className="border px-1 rounded">↵</kbd> to open
          </div>
        </div>
      )}
    </div>
  );
}
