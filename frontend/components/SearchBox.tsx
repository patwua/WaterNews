import { useEffect, useMemo, useRef, useState } from "react";

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
  const [tag, setTag] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const [suggestions, setSuggestions] = useState<{ tags: { tag: string; count: number }[]; headlines: { slug: string; title: string; publishedAt?: string }[] }>({ tags: [], headlines: [] });
  const [showSuggestions, setShowSuggestions] = useState(false);

  const dq = useDebounced(q, 250);
  const dt = useDebounced(tag, 250);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Fetch suggestions on mount (popular tags + trending headlines)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/search/suggestions");
        const json = await res.json();
        setSuggestions({
          tags: Array.isArray(json.tags) ? json.tags : [],
          headlines: Array.isArray(json.headlines) ? json.headlines : [],
        });
      } catch {
        setSuggestions({ tags: [], headlines: [] });
      }
    })();
  }, []);

  // Fetch results
  useEffect(() => {
    const run = async () => {
      if (!dq && !dt) {
        setItems([]);
        setOpen(true);       // keep panel open to show suggestions
        setShowSuggestions(true);
        return;
      }
      setLoading(true);
      try {
        const qs = new URLSearchParams();
        if (dq) qs.set("q", dq);
        if (dt) qs.set("tags", dt);
        qs.set("limit", "8");
        const res = await fetch(`/api/search?${qs}`);
        const json = await res.json();
        setItems(json.items || []);
        setOpen(true);
        setActive(0);
        setShowSuggestions(false);
      } catch {
        setItems([]);
        setOpen(true);
        setShowSuggestions(true);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [dq, dt]);

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
    if (!open) return;
    if (showSuggestions) return; // don't arrow through suggestions; use mouse/click
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

  const hint = useMemo(() => (tag ? `#${tag}` : "headline or tag"), [tag]);

  return (
    <div ref={rootRef} className="relative w-full max-w-md">
      <div className="flex gap-1">
        <input
          ref={inputRef}
          className="w-full rounded-xl border px-3 py-2"
          placeholder={`Search ${hint}…`}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => { setOpen(true); setShowSuggestions(!q && !tag); }}
          onKeyDown={onKeyDown}
          aria-label="Search stories"
        />
        <input
          className="w-32 rounded-xl border px-3 py-2"
          placeholder="tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          onFocus={() => { setOpen(true); setShowSuggestions(!q && !tag); }}
          aria-label="Filter by tag"
        />
      </div>

      {open && (
        <div
          role="listbox"
          aria-label="Search results"
          className="absolute z-40 mt-2 w-full rounded-2xl bg-white shadow-lg ring-1 ring-black/5 overflow-hidden"
        >
          {showSuggestions ? (
            <div className="p-3">
              <div className="text-xs text-neutral-600 mb-2">Suggestions</div>
              <div className="mb-3">
                <div className="text-xs font-semibold text-neutral-700 mb-1">Popular tags</div>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.tags.length === 0 ? (
                    <span className="text-xs text-neutral-500">No tags yet</span>
                  ) : (
                    suggestions.tags.map((t) => (
                      <button
                        key={t.tag}
                        onClick={() => { setTag(String(t.tag).replace(/^#/, "")); inputRef.current?.focus(); }}
                        className="text-xs px-2 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200"
                        aria-label={`Use tag ${t.tag}`}
                      >
                        #{String(t.tag).replace(/^#/, "")}
                        <span className="ml-1 text-[10px] text-neutral-500">{t.count}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-neutral-700 mb-1">Trending stories</div>
                <ul className="max-h-72 overflow-auto divide-y">
                  {suggestions.headlines.length === 0 ? (
                    <li className="py-2 text-xs text-neutral-500">No recent stories</li>
                  ) : (
                    suggestions.headlines.map((h) => (
                      <li key={h.slug} className="py-2">
                        <a href={`/news/${h.slug}`} className="block">
                          <div className="text-sm font-medium line-clamp-1">{h.title}</div>
                          <div className="text-[11px] text-neutral-500">{h.publishedAt ? new Date(h.publishedAt).toLocaleString() : ""}</div>
                        </a>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          ) : (
            <>
              <div className="px-3 py-2 text-xs text-neutral-600 border-b">
                {loading ? "Searching…" : items.length ? `Results (${items.length})` : "No results"}
              </div>
              <ul className="max-h-96 overflow-auto">
                {items.map((it, i) => (
                  <li key={it.slug}>
                    <a
                      href={`/news/${it.slug}`}
                      className={`block px-3 py-2 text-sm ${i === active ? "bg-neutral-50" : ""}`}
                      onMouseEnter={() => setActive(i)}
                      role="option"
                      aria-selected={i === active}
                    >
                      <div className="font-medium line-clamp-1">{it.title}</div>
                      <div className="text-xs text-neutral-600 line-clamp-2">{it.excerpt}</div>
                      <div className="mt-0.5 text-[11px] text-neutral-500">
                        {it.publishedAt ? new Date(it.publishedAt).toLocaleString() : ""}
                        {it.tags?.length ? <> · {it.tags.slice(0, 3).map(t => `#${String(t).replace(/^#/, "")}`).join(" ")} </> : null}
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="px-3 py-2 text-xs text-neutral-600 border-t">
                Press <kbd className="border px-1 rounded">↵</kbd> to open · <a className="text-blue-600 hover:underline" href={`/search?q=${encodeURIComponent(q)}${tag ? `&tags=${encodeURIComponent(tag)}` : ""}`}>Open full search</a>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

