import { useState } from "react";

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

  return (
    <div className="flex rounded-full bg-gray-100 p-1 dark:bg-neutral-800">
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            aria-pressed={isActive}
            className={[
              "px-4 py-2 text-sm font-medium rounded-md transition-colors",
              isActive
                ? "bg-white text-blue-600 shadow-sm dark:bg-neutral-900 dark:text-blue-400"
                : "text-gray-600 hover:text-blue-700 dark:text-neutral-300 dark:hover:text-blue-400",
            ].join(" ")}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

