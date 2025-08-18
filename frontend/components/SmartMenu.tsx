import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

// Root and "More" panels
const ROOT_ITEMS = [
  { label: "Latest", href: "/?sort=latest" },
  { label: "Trending", href: "/?sort=trending" },
  { label: "Following", href: "/?tab=following" },
];

const MORE_ITEMS = [
  { label: "Sports", href: "/?cat=sports" },
  { label: "Business", href: "/?cat=business" },
  { label: "Politics", href: "/?cat=politics" },
  { label: "Tech", href: "/?cat=tech" },
  { label: "Weather", href: "/?cat=weather" },
  { label: "Health", href: "/?cat=health" },
];

type Panel = "root" | "more";

/**
 * SmartMenu with sliding panels:
 * - Forward arrow (→) reveals "More" categories (slides left).
 * - Back arrow (←) returns to root.
 * - Reduced motion honors prefers-reduced-motion.
 */
export default function SmartMenu() {
  const [panel, setPanel] = useState<Panel>("root");
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "matchMedia" in window) {
      setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    }
  }, []);

  const transition = reduced ? "" : "transition-transform duration-300 ease-out";
  const offset = panel === "root" ? "translate-x-0" : "-translate-x-full";

  return (
    <nav aria-label="Sections" className="relative overflow-hidden">
      {/* Viewport */}
      <div className={`w-[420px] sm:w-[520px] md:w-[640px] overflow-hidden`}>
        <div
          className={`flex ${transition}`}
          style={{ transform: panel === "root" ? "translateX(0)" : "translateX(-100%)" }}
        >
          {/* ROOT PANEL */}
          <ul className="flex items-center gap-3 min-w-[420px] sm:min-w-[520px] md:min-w-[640px]">
            {ROOT_ITEMS.map(item => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="px-2 py-1.5 text-sm rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus-visible:ring-2"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                type="button"
                aria-label="More sections"
                onClick={() => setPanel("more")}
                className="px-2 py-1.5 text-sm rounded inline-flex items-center gap-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus-visible:ring-2"
              >
                {/* Forward arrow */}
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M13 5l7 7-7 7M5 12h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </li>
          </ul>

          {/* MORE PANEL */}
          <ul
            aria-label="More sections"
            className="flex items-center gap-3 min-w-[420px] sm:min-w-[520px] md:min-w-[640px]"
          >
            <li>
              <button
                type="button"
                aria-label="Back to main sections"
                onClick={() => setPanel("root")}
                className="px-2 py-1.5 text-sm rounded inline-flex items-center gap-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus-visible:ring-2"
              >
                {/* Back arrow */}
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M11 19l-7-7 7-7M19 12H5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </li>
            {MORE_ITEMS.map(item => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="px-2 py-1.5 text-sm rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus-visible:ring-2"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
