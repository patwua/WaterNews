import { useEffect, useState } from "react";

/** Reads "wn.lowData" from localStorage; defaults false. */
export function useLowData() {
  const [lowData, setLowData] = useState(false);
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("wn.lowData") : null;
      setLowData(raw === "1");
    } catch {}
  }, []);
  return lowData;
}

/** One-liner to set it elsewhere (e.g., prefs page). */
export function setLowDataPreference(on: boolean) {
  try {
    localStorage.setItem("wn.lowData", on ? "1" : "0");
  } catch {}
}
