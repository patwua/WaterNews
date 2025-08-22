import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useShell } from "./ShellContext";
import { withCloudinaryAuto } from "@/lib/media";

// Constants for layout
const RAIL_W = 280; // px expanded
const RAIL_W_COLLAPSED = 76; // px collapsed

export default function GlobalShell({ children }: { children: React.ReactNode }) {
  const { user } = useShell();
  const router = useRouter();

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
          onClick={() => router.push("/newsroom/dashboard")}
          title="Go to Newsroom dashboard"
        >
          <img
            src={photo || "/placeholders/headshot.svg"}
            alt="Your profile"
            className={`object-cover border ${isCollapsed ? "w-10 h-10 rounded-full" : "w-12 h-12 rounded-full"}`}
            loading="lazy"
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
        <SectionLink href="/newsroom/dashboard" label={isCollapsed ? "Home" : "Dashboard"} />
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
    <div className="md:hidden sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="h-14 px-3 flex items-center gap-3">
        <button
          onClick={() => router.push("/newsroom/dashboard")}
          className="flex items-center gap-2 min-w-0"
          title="Go to Newsroom dashboard"
        >
          <img
            src={photo || "/placeholders/headshot.svg"}
            alt="Your profile"
            className="w-8 h-8 rounded-full object-cover border"
            loading="lazy"
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
          className="ml-auto inline-flex items-center justify-center w-9 h-9 rounded-md border bg-white hover:bg-gray-50"
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
  const { isMobileOpen, closeMobile } = useShell();
  // Lock body scroll when open
  useEffect(() => {
    if (typeof document === "undefined") return;
    const body = document.body;
    if (isMobileOpen) body.classList.add("overflow-hidden");
    else body.classList.remove("overflow-hidden");
    return () => body.classList.remove("overflow-hidden");
  }, [isMobileOpen]);
  return (
    <div
      className={`md:hidden fixed inset-0 z-50 ${isMobileOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isMobileOpen}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${isMobileOpen ? "opacity-100" : "opacity-0"}`}
        onClick={closeMobile}
      />
      {/* Panel */}
      <aside
        className={`absolute left-0 top-0 h-full w-[84vw] max-w-[320px] bg-white shadow-xl transition-transform ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-14 flex items-center justify-between px-3 border-b">
          <span className="font-semibold">NewsRoom</span>
          <button
            onClick={closeMobile}
            className="inline-flex items-center justify-center w-9 h-9 rounded-md border bg-white hover:bg-gray-50"
            aria-label="Close Newsroom menu"
            title="Close"
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
