import { useEffect, useState } from "react";

/**
 * Minimal dark-mode toggle.
 * - Persists to localStorage("wn-theme") = "dark" | "light"
 * - Applies/removes the "dark" class on <html>
 */
export default function DarkModeToggle() {
  const [ready, setReady] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // SSR guard
    if (typeof window === "undefined" || typeof document === "undefined") return;
    const saved = (localStorage.getItem("wn-theme") || "").toLowerCase();
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const next = saved ? saved === "dark" : prefersDark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    setReady(true);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", next);
    }
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("wn-theme", next ? "dark" : "light");
    }
  };

  // Avoid layout shift until hydrated
  if (!ready) return (
    <button aria-label="Toggle dark mode" className="w-9 h-9 opacity-60" />
  );

  return (
    <button
      type="button"
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={toggle}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      {dark ? (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V5a1 1 0 0 1 1-1Zm7 7a1 1 0 0 1 1 1 8 8 0 1 1-8-8 1 1 0 1 1 0 2 6 6 0 1 0 6 6 1 1 0 0 1 1-1Z" fill="currentColor"/></svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M21.64 13a1 1 0 0 0-1.11-.27 8 8 0 0 1-10.26-10.26 1 1 0 0 0-1.38-1.23 10 10 0 1 0 13 13 1 1 0 0 0-.25-1.24Z" fill="currentColor"/></svg>
      )}
    </button>
  );
}
