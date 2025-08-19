import { useEffect, useRef, useState } from "react";

type Tab = {
  key: string;
  label: string;
};

const tabs: Tab[] = [
  { key: "latest", label: "Latest" },
  { key: "trending", label: "Trending" },
  { key: "following", label: "Following" },
];

export default function SmartMenu() {
  const [active, setActive] = useState<string>("latest");
  const scrollerRef = useRef<HTMLDivElement>(null);
  // Conditional arrows + edge fades when overflow is present
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const check = () => setHasOverflow(el.scrollWidth > el.clientWidth + 2);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="relative">
      {/* Left arrow */}
      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => scrollerRef.current?.scrollBy({ left: -160, behavior: "smooth" })}
        className={[
          "absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 px-2 py-1 shadow ring-1 ring-black/5 backdrop-blur hover:bg-white transition-opacity",
          hasOverflow ? "opacity-100" : "opacity-0 pointer-events-none",
        ].join(" ")}
      >
        ‹
      </button>

      {/* Scrollable pill group */}
      <div ref={scrollerRef} className="no-scrollbar mx-7 flex overflow-x-auto rounded-full bg-gray-100 p-1 relative">
        {/* left fade */}
        <div
          className={[
            "pointer-events-none absolute left-0 top-0 h-full w-4 rounded-l-full",
            hasOverflow ? "bg-gradient-to-r from-white/80 to-transparent" : "hidden",
          ].join(" ")}
        />
        {tabs.map((tab) => {
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              aria-pressed={isActive}
              className={[
                "px-4 py-2 text-sm font-medium rounded-md transition-colors text-center",
                isActive ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-blue-700",
              ].join(" ")}
            >
              {tab.label}
            </button>
          );
        })}
        {/* right fade */}
        <div
          className={[
            "pointer-events-none absolute right-0 top-0 h-full w-4 rounded-r-full",
            hasOverflow ? "bg-gradient-to-l from-white/80 to-transparent" : "hidden",
          ].join(" ")}
        />
      </div>

      {/* Right arrow */}
      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => scrollerRef.current?.scrollBy({ left: 160, behavior: "smooth" })}
        className={[
          "absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 px-2 py-1 shadow ring-1 ring-black/5 backdrop-blur hover:bg-white transition-opacity",
          hasOverflow ? "opacity-100" : "opacity-0 pointer-events-none",
        ].join(" ")}
      >
        ›
      </button>
    </div>
  );
}

