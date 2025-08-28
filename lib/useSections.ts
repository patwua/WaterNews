import { useEffect, useState } from "react";

/** Fetches section enablement map from admin API. */
export function useSections() {
  const [sections, setSections] = useState<Record<string, boolean> | null>(null);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/admin/sections");
        const data = await res.json();
        if (!cancelled) setSections(data?.map || {});
      } catch {
        if (!cancelled) setSections({});
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);
  return sections;
}
