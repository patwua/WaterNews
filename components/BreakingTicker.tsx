import { useEffect, useState } from "react";

export default function BreakingTicker() {
  const [isBreaking, setIsBreaking] = useState(false);
  useEffect(() => {
    let mounted = true;
    const handler = (e: Event) => setIsBreaking((e as CustomEvent<boolean>).detail === true);
    window.addEventListener("wn:breaking", handler as EventListener);
    async function poll() {
      try {
        const res = await fetch("/api/news/ticker");
        const data = await res.json(); // expects { items: [{title, breaking?: boolean}, ...] }
        const breaking = Array.isArray(data?.items) && data.items.some((i: any) => i?.breaking === true);
        if (!mounted) return;
        setIsBreaking(breaking);
        window.dispatchEvent(new CustomEvent("wn:breaking", { detail: breaking }));
      } catch {}
    }
    poll();
    const id = setInterval(poll, 60000);
    return () => {
      mounted = false;
      window.removeEventListener("wn:breaking", handler as EventListener);
      clearInterval(id);
    };
  }, []);
  return (
    <div className={`w-full overflow-hidden ${isBreaking ? "text-red-600" : "text-[color:var(--wn-slogan)]"}`}>
      {/* existing marquee/scroll content */}
    </div>
  );
}

