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

type Props = {
  iconOnly?: boolean; // new: renders a button that expands to input
};

export default function SearchBox(props: Props) {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  const dq = useDebounced(q, 250);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listboxId = "searchbox-listbox";
  const optionId = (i: number) => `searchbox-option-${i}`;

  useEffect(() => {
    const run = async () => {
      if (!dq) {
        setItems([]);
        setDropdownOpen(false);
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
        setDropdownOpen(true);
        setActive(0);
      } catch {
        setItems([]);
        setDropdownOpen(false);
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
      if (!rootRef.current.contains(e.target as Node)) setDropdownOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDropdownOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Loosen typing to avoid duplicate React module type mismatch in CI
  const onKeyDown = (e: any) => {
    if (!dropdownOpen || !items.length) return;
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

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const close = () => setOpen(false);

  if (props.iconOnly) {
    return (
      <div ref={rootRef} className="relative">
        {!open && (
          <button
            type="button"
            aria-label="Open search"
            onClick={() => setOpen(true)}
            className="w-9 h-9 inline-flex items-center justify-center rounded-full ring-1 ring-black/10 dark:ring-white/10 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus-visible:ring-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 21l-4.35-4.35M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </svg>
          </button>
        )}
        {open && (
          <div className="absolute right-0 top-0 w-[70vw] max-w-md">
            <div className="flex items-center gap-2 px-3 py-2 rounded-full ring-1 ring-black/10 dark:ring-white/10 bg-white dark:bg-neutral-900 shadow-md">
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21 21l-4.35-4.35M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
              </svg>
              <input
                ref={inputRef}
                type="search"
                role="combobox"
                aria-expanded={dropdownOpen}
                aria-controls={dropdownOpen ? listboxId : undefined}
                aria-autocomplete="list"
                placeholder="Search WaterNews"
                className="flex-1 bg-transparent outline-none text-sm placeholder:opacity-70"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onBlur={(e) => {
                  setTimeout(() => setOpen(false), 100);
                }}
                onKeyDown={onKeyDown}
              />
              <button
                type="button"
                onClick={close}
                aria-label="Close search"
                className="w-7 h-7 inline-flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            {dropdownOpen && (
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
        )}
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative w-full max-w-md">
      <input
        ref={inputRef}
        className="w-full rounded-xl border px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500"
        placeholder="Search headlines…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => { if (items.length) setDropdownOpen(true); }}
        onKeyDown={onKeyDown}
        aria-label="Search stories"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={dropdownOpen}
        aria-controls={dropdownOpen ? listboxId : undefined}
        aria-activedescendant={dropdownOpen ? optionId(active) : undefined}
      />

      {dropdownOpen && (
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
