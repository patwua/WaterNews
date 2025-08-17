import Link from "next/link";
import { useEffect, useState } from "react";

type FetchFn = (ts?: number) => Promise<any[]>;
type FetchAllFn = () => Promise<any[]>;

export default function NotificationsBellMenu({
  fetchSince = async () => [],
  fetchAll = async () => [],
}: { fetchSince?: FetchFn; fetchAll?: FetchAllFn }) {
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
        aria-label="Notifications"
        aria-expanded={open}
        onClick={onToggle}
        className="relative rounded-full p-2 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6"><path d="M12 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 005 15h14a1 1 0 00.707-1.707L18 11.586V8a6 6 0 00-6-6zM8 16a4 4 0 008 0H8z"/></svg>
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
