import { useEffect, useState } from "react";

export default function BreakingTicker() {
  const [isBreaking, setIsBreaking] = useState(false);
  useEffect(() => {
    // If your ticker fetch already determines breaking state, wire it here.
    // Placeholder: listen for a global custom event `wn:breaking` or keep false.
    const handler = (e: Event) => setIsBreaking((e as CustomEvent<boolean>).detail === true);
    window.addEventListener("wn:breaking", handler as EventListener);
    return () => window.removeEventListener("wn:breaking", handler as EventListener);
  }, []);
  return (
    <div className={`w-full overflow-hidden ${isBreaking ? "text-red-600" : "text-[color:var(--wn-slogan)]"}`}>
      {/* existing marquee/scroll content */}
    </div>
  );
}

