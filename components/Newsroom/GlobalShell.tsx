import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useShell } from "./ShellContext";
import { withCloudinaryAuto } from "@/lib/media";
import ProfilePhoto from "@/components/User/ProfilePhoto";

// Constants for layout
const RAIL_W = 280; // px expanded
const RAIL_W_COLLAPSED = 76; // px collapsed

export default function GlobalShell({ children }: { children: React.ReactNode }) {
  const { user, setUser, closeMobile } = useShell();
  const router = useRouter();

  // Bootstrap the signed-in user so the shell can render on mobile
  useEffect(() => {
    let cancelled = false;
    (async () => {
      // undefined = unknown; null/obj = known
      if (user !== undefined) return;
      try {
        const r = await fetch("/api/users/summary");
        if (!r.ok) {
          if (!cancelled) setUser(null);
          return;
        }
        const d = await r.json();
        const u = d?.me || d?.user || null;
        if (!cancelled) setUser(u);
      } catch {
        if (!cancelled) setUser(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, setUser]);

  // Close mobile drawer on route changes (client router)
  useEffect(() => {
    const onStart = () => closeMobile();
    router.events.on("routeChangeStart", onStart);
    return () => router.events.off("routeChangeStart", onStart);
  }, [router.events, closeMobile]);

  // Only render shell for logged-in users
  if (!user) return <>{children}</>;

  return <ResponsiveShell>{children}</ResponsiveShell>;
}

function SectionLink({ href, label, icon }: { href: string; label: string; icon?: React.ReactNode }) {
  const router = useRouter();
  const active = router.pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-50 truncate ${
        active ? "bg-gray-100 font-medium" : ""
      }`}
    >
      {icon}
      <span className="truncate">{label}</span>
    </Link>
  );
}

function RailContents() {
  const { user, isCollapsed, toggleCollapse } = useShell();
  const router = useRouter();
  const photo = withCloudinaryAuto(user?.profilePhotoUrl || user?.avatarUrl);

  return (
    <div className="h-full flex flex-col">
      {/* Header / Bio (clickable to dashboard) */}
      <div className="p-4 border-b flex items-center gap-3">
        <button
          className="flex items-center gap-3 text-left group"
          onClick={() => router.push("/newsroom/writer-dashboard")}
          title="Go to Writer dashboard"
        >
          <ProfilePhoto
            name={user?.displayName || user?.name || "You"}
            url={photo || undefined}
            size={isCollapsed ? 40 : 48}
            className="border"
          />
          {!isCollapsed && (
            <div className="min-w-0">
              <div className="font-semibold truncate">{user?.displayName || user?.name || "You"}</div>
              <div className="text-xs text-gray-500 truncate">@{user?.handle || "handle"}</div>
            </div>
          )}
        </button>
        {/* Collapse toggle (desktop only) */}
        <button
          type="button"
          onClick={toggleCollapse}
          title={isCollapsed ? "Expand" : "Collapse"}
          className="ml-auto hidden md:inline-flex items-center justify-center rounded-md border px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
        >
          {isCollapsed ? "»" : "«"}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-auto p-2">
        {!isCollapsed && (
          <div className="text-xs uppercase tracking-wide text-gray-500 px-2 mb-2">NewsRoom</div>
        )}
        <SectionLink href="/newsroom/writer-dashboard" label={isCollapsed ? "Home" : "Dashboard"} />
        <SectionLink href="/newsroom" label={isCollapsed ? "Write" : "Publisher"} />
        <SectionLink href="/newsroom/collab" label={isCollapsed ? "Collab" : "Collaboration"} />
        <SectionLink href="/newsroom/media" label="Media" />
        <SectionLink href="/newsroom/assistant" label={isCollapsed ? "AI" : "AI Assistant"} />
        <SectionLink href="/newsroom/notice-board" label={isCollapsed ? "Notes" : "Notice Board"} />
        <SectionLink href="/newsroom/profile" label={isCollapsed ? "Profile" : "Profile & Settings"} />
        <SectionLink href="/newsroom/help" label="Help" />
        <SectionLink href="/newsroom/invite" label={isCollapsed ? "Invite" : "Invite a friend"} />
      </nav>

      {/* Footer / Changelog strip (kept minimal) */}
      <div className="p-3 text-xs text-gray-500 border-t">
        <div className="flex items-center justify-between">
          <span>UI updates</span>
          <Link href="/admin/moderation/dashboard" className="hover:underline">See more</Link>
        </div>
      </div>
    </div>
  );
}

function MobileTopBar() {
  const { user, openMobile } = useShell();
  const router = useRouter();
  const photo = withCloudinaryAuto(user?.profilePhotoUrl || user?.avatarUrl);
  return (
    <div className="md:hidden sticky top-0 z-50 bg-white/85 backdrop-blur border-b">
      <div className="h-14 px-3 flex items-center gap-3">
        <button
          onClick={() => router.push("/newsroom/writer-dashboard")}
          className="flex items-center gap-2 min-w-0"
          title="Go to Writer dashboard"
        >
          <ProfilePhoto
            name={user?.displayName || user?.name || "You"}
            url={photo || undefined}
            size={32}
            className="border"
          />
          <div className="min-w-0">
            <div className="text-sm font-semibold leading-5 truncate">
              {user?.displayName || user?.name || "You"}
            </div>
            <div className="text-[11px] text-gray-500 -mt-0.5 truncate">
              @{user?.handle || "handle"}
            </div>
          </div>
        </button>
        <button
          onClick={openMobile}
          className="ml-auto inline-flex items-center justify-center w-11 h-11 p-3 rounded-md border bg-white hover:bg-gray-50"
          aria-label="Open Newsroom menu"
          title="Open menu"
        >
          {/* Hamburger */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

function MobileDrawer({ children }: { children: React.ReactNode }) {
  const { isMobileOpen, closeMobile, openMobile } = useShell();
  // Lock body scroll when open
  useEffect(() => {
    if (typeof document === "undefined") return;
    const body = document.body;
    if (isMobileOpen) body.classList.add("overflow-hidden");
    else body.classList.remove("overflow-hidden");
    return () => body.classList.remove("overflow-hidden");
  }, [isMobileOpen]);
  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeMobile]);

  // Focus trap + return focus
  const [initialButton, setInitialButton] = useState<HTMLButtonElement | null>(null);
  const [panelRef, setPanelRef] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!isMobileOpen || !panelRef) return;
    const focusables = panelRef.querySelectorAll<HTMLElement>(
      'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0], last = focusables[focusables.length - 1];
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (focusables.length === 0) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); (last || first).focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); (first || last).focus();
      }
    };
    panelRef.addEventListener("keydown", onKeyDown as any);
    (first || panelRef).focus();
    return () => panelRef.removeEventListener("keydown", onKeyDown as any);
  }, [isMobileOpen, panelRef]);

  // Edge-swipe gestures
  useEffect(() => {
    let startX = 0, startY = 0, tracking = false;
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      startX = t.clientX; startY = t.clientY;
      if (!isMobileOpen && startX < 24) tracking = true;
      if (isMobileOpen && (t.target as HTMLElement)?.closest?.("aside[data-nr-drawer]")) tracking = true;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!tracking) return;
      const t = e.touches[0];
      const dx = t.clientX - startX;
      const dy = Math.abs(t.clientY - startY);
      if (dy > 30) { tracking = false; return; }
      if (!isMobileOpen && dx > 40) { openMobile(); tracking = false; }
      if (isMobileOpen && dx < -40) { closeMobile(); tracking = false; }
    };
    const onTouchEnd = () => { tracking = false; };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart as any);
      window.removeEventListener("touchmove", onTouchMove as any);
      window.removeEventListener("touchend", onTouchEnd as any);
    };
  }, [isMobileOpen, openMobile, closeMobile]);
  return (
    <div
      className={`md:hidden fixed inset-0 z-50 ${isMobileOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isMobileOpen}
      role="presentation"
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${isMobileOpen ? "opacity-100" : "opacity-0"}`}
        onClick={closeMobile}
        aria-hidden="true"
      />
      {/* Panel */}
      <aside
        className={`absolute left-0 top-0 h-full w-[84vw] max-w-[320px] bg-white shadow-xl outline-none transition-transform ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-modal="true"
        role="dialog"
        aria-label="Newsroom menu"
        data-nr-drawer
        tabIndex={-1}
        ref={setPanelRef as any}
      >
        <div className="h-14 flex items-center justify-between px-3 border-b">
          <span className="font-semibold">NewsRoom</span>
          <button
            onClick={closeMobile}
            className="inline-flex items-center justify-center w-11 h-11 p-3 rounded-md border bg-white hover:bg-gray-50"
            aria-label="Close Newsroom menu"
            title="Close"
            ref={setInitialButton as any}
          >
            {/* X */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="h-[calc(100%-56px)] overflow-y-auto">
          {children}
        </div>
      </aside>
    </div>
  );
}

function ResponsiveShell({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useShell();
  const railW = isCollapsed ? RAIL_W_COLLAPSED : RAIL_W;
  return (
    <div className="min-h-screen bg-gray-50">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-black text-white px-3 py-2 rounded"
      >
        Skip to content
      </a>
      {/* Mobile sticky bar */}
      <MobileTopBar />
      <div className="flex">
        {/* Desktop rail */}
        <aside
          className="hidden md:block sticky top-0 h-screen shrink-0 border-r bg-white/70 backdrop-blur"
          style={{ width: railW }}
        >
          <RailContents />
        </aside>
        {/* Mobile drawer (contains same nav) */}
        <MobileDrawer>
          <RailContents />
        </MobileDrawer>
        {/* Main content */}
        <div className="flex-1 min-w-0 md:ml-0">{children}</div>
      </div>
    </div>
  );
}
