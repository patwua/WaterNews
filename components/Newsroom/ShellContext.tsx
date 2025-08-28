import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type ShellCtx = {
  user?: any;
  setUser: (u: any) => void;
  // Desktop rail (md+)
  isCollapsed: boolean;
  toggleCollapse: () => void;
  // Mobile drawer (sm)
  isMobileOpen: boolean;
  openMobile: () => void;
  closeMobile: () => void;
};

const Ctx = createContext<ShellCtx>({
  user: undefined,
  setUser: () => {},
  isCollapsed: false,
  toggleCollapse: () => {},
  isMobileOpen: false,
  openMobile: () => {},
  closeMobile: () => {},
});

export function useShell() {
  return useContext(Ctx);
}

export default function ShellProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(undefined);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  // Persist collapsed state per user
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("wn_nr_collapsed");
      if (raw != null) setIsCollapsed(raw === "1");
    } catch {}
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("wn_nr_collapsed", isCollapsed ? "1" : "0");
    } catch {}
  }, [isCollapsed]);

  // Ensure collapse doesn’t accidentally apply on mobile (visual safety)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => {
      if (!mq.matches && isCollapsed) setIsCollapsed(false);
    };
    sync();
    mq.addEventListener?.("change", sync);
    return () => mq.removeEventListener?.("change", sync);
  }, [isCollapsed]);

  // Close drawer on route changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => setIsMobileOpen(false);
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      isCollapsed,
      toggleCollapse: () => setIsCollapsed((v) => !v),
      isMobileOpen,
      openMobile: () => setIsMobileOpen(true),
      closeMobile: () => setIsMobileOpen(false),
    }),
    [user, isCollapsed, isMobileOpen]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
