import Link from "next/link";
import { useEffect, useState } from "react";

type FetchFn = (ts?: number) => Promise<any[]>;
type FetchAllFn = () => Promise<any[]>;

export default function NotificationsBellMenu({
  fetchSince = async () => [],
  fetchAll = async () => [],
  variant = "outline",
}: { fetchSince?: FetchFn; fetchAll?: FetchAllFn; variant?: string }) {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [sinceItems, setSinceItems] = useState<any[]>([]);
  const lastVisitKey = "wn:lastVisit";

  useEffect(() => {
    const last = Number((typeof window !== "undefined" && localStorage.getItem(lastVisitKey)) || 0);
    fetchSince(last || undefined)
      .then(rows => { setSinceItems(rows || []); setUnread((rows || []).length); })
      .catch(() => { setSinceItems([]); setUnread(0); });
  }, []);

  const onToggle = () => {
    const next = !open; setOpen(next);
    if (next && typeof window !== "undefined") localStorage.setItem(lastVisitKey, String(Date.now()));
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Open notifications"
        aria-expanded={open}
        onClick={onToggle}
        className="w-9 h-9 inline-flex items-center justify-center hover:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14 20a2 2 0 1 1-4 0m8-8a6 6 0 1 0-12 0c0 1.886-.664 3.056-1.414 3.707-.44.377-.66.565-.651.827.009.262.244.466.715.873.902.784 2.214 1.593 4.35 1.593h6c2.136 0 3.448-.809 4.35-1.593.471-.407.706-.611.715-.873.009-.262-.211-.45-.651-.827C16.664 15.056 16 13.886 16 12Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center text-[10px] min-w-[18px] h-[18px] px-1 rounded-full bg-blue-600 text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div role="menu" className="absolute right-0 mt-2 w-96 max-w-[92vw] rounded-2xl bg-white shadow-lg ring-1 ring-black/5 overflow-hidden">
          <header className="px-4 py-2 text-xs font-semibold tracking-wide text-neutral-600 border-b">
            Since last visit ({sinceItems.length})
          </header>
          <ul className="max-h-80 overflow-auto divide-y">
            {sinceItems.length === 0 ? (
              <li className="p-4 text-sm text-neutral-600">You’re all caught up.</li>
            ) : sinceItems.map((n, i) => (
              <li key={i} className="p-4 hover:bg-neutral-50 focus-within:bg-neutral-50">
                <a href={n.href} className="block outline-none focus:ring-2 focus:ring-blue-500 rounded">
                  <div className="text-sm font-medium">{n.title}</div>
                  <div className="text-xs text-neutral-600">{n.summary}</div>
                </a>
              </li>
            ))}
            <li className="px-3 py-2 text-sm">
              <Link
                href="/notifications"
                className="text-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 rounded"
              >
                Open all
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
