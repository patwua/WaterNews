import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type TickerItem = { slug: string; titleShort: string; summary: string };

export default function BreakingTicker({ items: propItems = [] as TickerItem[] }) {
  const [mode, setMode] = useState<"newswave" | "breaking">("newswave");
  const [items, setItems] = useState<TickerItem[]>(propItems);
  const [reduced, setReduced] = useState(false);

  // Respect reduced-motion
  useEffect(() => {
    if (typeof window !== "undefined" && "matchMedia" in window) {
      setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    }
  }, []);

  // Auto-fetch if no items were provided
  useEffect(() => {
    if (propItems && propItems.length) return;
    let aborted = false;
    (async () => {
      try {
        const r = await fetch("/api/news/ticker", { headers: { Accept: "application/json" } });
        if (!r.ok) return;
        const data = await r.json();
        if (!aborted) {
          setMode(data?.mode === "breaking" ? "breaking" : "newswave");
          setItems(Array.isArray(data?.items) ? data.items : []);
        }
      } catch {}
    })();
    return () => {
      aborted = true;
    };
  }, [propItems]);

  // Visual theme
  const theme = useMemo(() => {
    if (mode === "breaking") {
      // Breaking = strong red
      return {
        wrap: "bg-red-600 text-white",
        label: "Breaking News",
        pill: "bg-white/15 text-white ring-white/20",
      };
    }
    // NewsWave = brand subtle
    return {
      wrap: "bg-brand/5 text-slate-900 dark:bg-slate-700/40",
      label: "NewsWave",
      pill: "bg-black/10 text-black ring-black/10 dark:bg-white/10 dark:text-white/90 dark:ring-white/20",
    };
  }, [mode]);

  // Duplicate items to form an infinite scroll loop
  const loop = useMemo(() => {
    const src = items.length ? items : [];
    // Ensure minimum length for smooth loop
    const base = src.length < 6 ? [...src, ...src, ...src] : src;
    return [...base, ...base];
  }, [items]);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);

  if (!items.length) {
    // Always visible bar with placeholder when empty
    return (
      <div
        className={`${theme.wrap} text-sm`}
        role="region"
        aria-label={mode === "breaking" ? "Breaking News" : "NewsWave headlines"}
        aria-live="polite"
      >
        <div className="max-w-7xl mx-auto px-3 md:px-4 h-9 flex items-center gap-3">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ring-1 ${theme.pill}`}>
            {theme.label}
          </span>
          <span className="opacity-80">No updates yet.</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${theme.wrap} text-sm`}
      role="region"
      aria-label={mode === "breaking" ? "Breaking News" : "NewsWave headlines"}
      aria-live="polite"
    >
      <div className="max-w-7xl mx-auto px-3 md:px-4 h-9 flex items-center gap-3 overflow-hidden">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ring-1 ${theme.pill}`}>
          {theme.label}
        </span>

        {/* Scrolling track */}
        <div
          ref={trackRef}
          className="relative flex-1 overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* We implement marquee-like scroll using CSS animation (no <marquee>) */}
          <div
            className={[
              "whitespace-nowrap will-change-transform flex items-center gap-6",
              reduced ? "" : "animate-[ticker_25s_linear_infinite]",
              paused ? "paused" : "",
            ].join(" ")}
          >
            {loop.map((it, idx) => (
              <Link
                key={`${it.slug}-${idx}`}
                href={`/news/${it.slug}`}
                className="inline-flex items-center gap-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black/40 dark:focus-visible:ring-white/50"
              >
                <span className="font-semibold">{it.titleShort}</span>
                {it.summary ? <span className="opacity-80">— {it.summary}</span> : null}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Inline styles for the marquee animation + pause (global <style> to avoid styled-jsx typings) */}
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .paused {
          animation-play-state: paused !important;
        }
      `}</style>
    </div>
  );
}

