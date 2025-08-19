import { useRef, useState } from "react";

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

  // Restyle with center-aligned labels + slide arrows for horizontal overflow
  return (
    <div className="relative">
      {/* Left arrow */}
      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => scrollerRef.current?.scrollBy({ left: -160, behavior: "smooth" })}
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 px-2 py-1 shadow ring-1 ring-black/5 backdrop-blur hover:bg-white"
      >
        ‹
      </button>

      {/* Scrollable pill group */}
      <div
        ref={scrollerRef}
        className="no-scrollbar mx-7 flex overflow-x-auto rounded-full bg-gray-100 p-1"
      >
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
      </div>

      {/* Right arrow */}
      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => scrollerRef.current?.scrollBy({ left: 160, behavior: "smooth" })}
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 px-2 py-1 shadow ring-1 ring-black/5 backdrop-blur hover:bg-white"
      >
        ›
      </button>
    </div>
  );
}

