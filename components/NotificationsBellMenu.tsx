import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useNotificationsSocket } from "@/lib/useNotificationsSocket";

type FetchFn = (ts?: number) => Promise<any[]>;
type FetchAllFn = () => Promise<any[]>;

export default function NotificationsBellMenu({
  fetchSince = async () => [],
  fetchAll = async () => [],
  variant = "outline" as any,
}: { fetchSince?: FetchFn; fetchAll?: FetchAllFn; variant?: "solid" | "outline" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { connected, unread, setUnread } = useNotificationsSocket();
  const [sinceItems, setSinceItems] = useState<any[]>([]);
  const lastVisitKey = "wn:lastVisit";

  useEffect(() => {
    const last = Number((typeof window !== "undefined" && localStorage.getItem(lastVisitKey)) || 0);
    fetchSince(last || undefined)
      .then((rows) => {
        setSinceItems(rows || []);
        setUnread((rows || []).length);
      })
      .catch(() => {
        setSinceItems([]);
        setUnread(0);
      });
  }, []);

  const onToggle = () => {
    const next = !open;
    setOpen(next);
    if (next && typeof window !== "undefined") localStorage.setItem(lastVisitKey, String(Date.now()));
  };

  // Close when clicking outside
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label="Open notifications"
        aria-expanded={open}
        onClick={onToggle}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        {/* Modern outline bell */}
        <svg width="22" height="22" viewBox="0 0 24 24" className="text-slate-700 dark:text-slate-200" aria-hidden="true">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17H9m8-1V11a5 5 0 10-10 0v5l-2 2h14l-2-2zm-6 4a2 2 0 004 0"
          />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center text-[10px] min-w-[18px] h-[18px] px-1 rounded-full bg-blue-600 text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div role="menu" className="absolute right-0 mt-2 w-96 max-w-[92vw] rounded-2xl bg-white shadow-lg ring-1 ring-black/5 overflow-hidden">
          <header className="flex justify-between px-4 py-2 text-xs font-semibold tracking-wide text-neutral-600 border-b">
            <span>Since last visit ({sinceItems.length})</span>
            <span className="font-normal text-[10px] text-neutral-500">
              {connected ? "Live" : "Offline"}
            </span>
          </header>
          <ul className="max-h-80 overflow-auto divide-y">
            {sinceItems.length === 0 ? (
              <li className="p-4 text-sm text-neutral-600">You’re all caught up.</li>
            ) : (
              sinceItems.map((n, i) => (
                <li key={i} className="p-4 hover:bg-neutral-50 focus-within:bg-neutral-50">
                  <a href={n.href} className="block outline-none focus:ring-2 focus:ring-blue-500 rounded">
                    <div className="text-sm font-medium">{n.title}</div>
                    <div className="text-xs text-neutral-600">{n.summary}</div>
                  </a>
                </li>
              ))
            )}
            <li className="px-3 py-2 text-sm flex justify-between gap-2">
              <Link
                href="/notifications"
                className="text-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 rounded"
              >
                Open all
              </Link>
              <button
                onClick={() => setUnread(0)}
                className="text-neutral-600 hover:underline"
                aria-label="Mark all as read"
              >
                Mark all as read
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

