import { useEffect, useState } from "react";
import Link from "next/link";

const ROOT_ITEMS = [
  { label: "Latest", href: "/?sort=latest" },
  { label: "Trending", href: "/?sort=trending" },
  { label: "Following", href: "/?tab=following" },
];

// Additional items will be appended AFTER defaults, but we keep a baked-in fallback:
const FALLBACK_MORE = [
  { label: "Sports", href: "/?cat=sports" },
  { label: "Business", href: "/?cat=business" },
  { label: "Politics", href: "/?cat=politics" },
  { label: "Tech", href: "/?cat=tech" },
  { label: "Weather", href: "/?cat=weather" },
  { label: "Health", href: "/?cat=health" },
];

type Panel = "root" | "more";

export default function SmartMenu() {
  const [panel, setPanel] = useState<Panel>("root");
  const [reduced, setReduced] = useState(false);
  const [more, setMore] = useState(FALLBACK_MORE);

  useEffect(() => {
    if (typeof window !== "undefined" && "matchMedia" in window) {
      setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    }
  }, []);

  // Optional server-driven categories — appended after defaults, never reorders ROOT_ITEMS
  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        const r = await fetch("/api/categories", { headers: { "Accept": "application/json" } });
        if (!r.ok) return;
        const data = await r.json();
        if (!aborted && Array.isArray(data) && data.length) {
          // Merge while keeping FALLBACK_MORE, avoid dups by label
          const labels = new Set(FALLBACK_MORE.map(i => i.label.toLowerCase()));
          const merged = [...FALLBACK_MORE];
          for (const it of data) {
            if (!it?.label || !it?.href) continue;
            const key = String(it.label).toLowerCase();
            if (!labels.has(key)) {
              labels.add(key);
              merged.push({ label: it.label, href: it.href });
            }
          }
          setMore(merged);
        }
      } catch { /* ignore */ }
    })();
    return () => { aborted = true; };
  }, []);

  const transition = reduced ? "" : "transition-transform duration-300 ease-out";
  const baseItem =
    "px-2 py-1.5 text-sm rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50";

  return (
    <nav aria-label="Sections" className="relative">
      {/* Shaded rail */}
      <div className="rounded-full px-2 py-1 bg-neutral-50/90 dark:bg-neutral-900/60 ring-1 ring-black/5 dark:ring-white/10">
        {/* viewport */}
        <div className="w-[420px] sm:w-[520px] md:w-[640px] overflow-hidden">
          <div className={`flex ${transition}`} style={{ transform: panel === "root" ? "translateX(0)" : "translateX(-100%)" }}>
            {/* ROOT */}
            <ul className="flex items-center gap-2 min-w-[420px] sm:min-w-[520px] md:min-w-[640px]">
              {ROOT_ITEMS.map(item => (
                <li key={item.label}>
                  <Link href={item.href} className={baseItem}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  aria-label="More sections"
                  onClick={() => setPanel("more")}
                  className={baseItem + " inline-flex items-center gap-1"}
                >
                  {/* longer forward arrow */}
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h12M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </li>
            </ul>

            {/* MORE */}
            <ul aria-label="More sections" className="flex items-center gap-2 min-w-[420px] sm:min-w-[520px] md:min-w-[640px]">
              <li>
                <button
                  type="button"
                  aria-label="Back to main sections"
                  onClick={() => setPanel("root")}
                  className={baseItem + " inline-flex items-center gap-1"}
                >
                  {/* longer back arrow */}
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 12H7M11 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </li>
              {more.map(item => (
                <li key={item.label}>
                  <Link href={item.href} className={baseItem}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
