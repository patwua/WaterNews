import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ShellContext } from './ShellContext';
import { signOut } from 'next-auth/react';

// Global shell that shows the NewsRoom sidebar for LOGGED-IN users on every page.
// Sidebar uses a water/sky tint; bio is data-only; nav mirrors NewsRoom sections.
export default function GlobalShell({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [badges, setBadges] = useState<any>(null);
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  // Determine which nav item is active from pathname
  const active = useMemo(()=> {
    if (!pathname.startsWith('/newsroom')) return '';
    if (pathname.startsWith('/newsroom/dashboard')) return 'dashboard';
    if (pathname.startsWith('/newsroom/notice-board')) return 'notice';
    if (pathname.startsWith('/newsroom/collab')) return 'collab';
    if (pathname.startsWith('/newsroom/media')) return 'media';
    if (pathname.startsWith('/newsroom/assistant')) return 'assistant';
    if (pathname.startsWith('/newsroom/profile')) return 'profile';
    return 'publisher';
  }, [pathname]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // users/summary returns { me, counts }
        const r = await fetch('/api/users/summary');
        if (!mounted) return;
        if (r.ok) {
          const d = await r.json();
          setLoggedIn(true);
          setSummary(d?.me || d);
          const b = await fetch('/api/newsroom/badges').then(x=>x.ok? x.json(): null).catch(()=>null);
          setBadges(b);
        } else {
          setLoggedIn(false);
        }
      } catch {
        if (mounted) setLoggedIn(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // If unknown (first paint), render basic layout to avoid CLS
  if (loggedIn === null) {
    return (
      <ShellContext.Provider value={{ hasShell: false }}>
        <div className="min-h-screen flex flex-col">{children}</div>
      </ShellContext.Provider>
    );
  }

  if (!loggedIn) {
    // Visitors: no NewsRoom sidebar
    return (
      <ShellContext.Provider value={{ hasShell: false }}>
        <div className="min-h-screen flex flex-col">{children}</div>
      </ShellContext.Provider>
    );
  }

  // Logged-in: persistent left sidebar across the site
  return (
    <ShellContext.Provider value={{ hasShell: true }}>
      <div className="h-screen flex overflow-hidden">
        {/* Sidebar with independent scroll and resizable width */}
        <aside
          className="flex-shrink-0 w-64 max-w-md min-w-[12rem] resize-x overflow-hidden border-r border-sky-200 text-slate-900 bg-gradient-to-b from-[#e8f4fd] to-[#f7fbff] flex flex-col"
        >
          {/* User bio at top (sticky) */}
          <div className="p-4 space-y-4 shrink-0">
            <div className="text-xs uppercase tracking-widest text-sky-700">NewsRoom</div>
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={summary?.avatarUrl || summary?.image || '/apple-touch-icon.png'}
                alt=""
                className="w-12 h-12 rounded-full object-cover border border-sky-200"
              />
              <div className="min-w-0">
                <div className="font-medium truncate">{summary?.displayName || summary?.name || 'Your Name'}</div>
                <div className="text-xs text-sky-700 truncate">@{summary?.handle || 'handle'}</div>
                <div className="text-xs text-slate-600">
                  {typeof summary?.followers === 'number' ? `${summary.followers} followers` : '—'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {summary?.lastLoginAt ? `Last login ${timeAgo(summary.lastLoginAt)}` : ''}
                </div>
              </div>
            </div>
          </div>
          {/* Nav menu scrolls independently */}
          <nav className="flex-1 overflow-y-auto px-4 space-y-1">
            <NavItem href="/newsroom/dashboard" label="Dashboard" active={active==='dashboard'} />
            <NavItem href="/newsroom/notice-board" label="Notice Board" active={active==='notice'} badge={badges?.noticeUnread} />
            <NavGroup label="Publisher" items={[
              { href: '/newsroom', label: 'Articles', badge: badges?.drafts },
              { href: '/newsroom/drafts', label: 'Drafts' },
            ]} />
            <NavItem href="/newsroom/collab" label="Collaboration" active={active==='collab'} />
            <NavItem href="/newsroom/media" label="Media" active={active==='media'} />
            <NavItem href="/newsroom/assistant" label="AI Assistant" active={active==='assistant'} />
            <NavItem href="/newsroom/profile" label="Profile & Settings" active={active==='profile'} />
            <button
              onClick={()=>signOut({ callbackUrl: '/' })}
              className="w-full text-left px-3 py-2 rounded hover:bg-sky-100 text-red-700"
            >
              Logout
            </button>
          </nav>
          {/* Live updates section */}
          <LiveUpdates />
          {/* Change log */}
          <ChangeLog />
        </aside>
        {/* Main content has its own scroll */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {children}
        </div>
      </div>
    </ShellContext.Provider>
  );
}

function NavItem({ href, label, active, badge }: { href: string; label: string; active?: boolean; badge?: number }) {
  return (
    <Link href={href} className={`flex items-center justify-between px-3 py-2 rounded ${active ? 'bg-sky-700 text-white' : 'hover:bg-sky-100'}`}>
      <span>{label}</span>
      {badge ? <span className={`text-[11px] px-2 py-0.5 rounded-full ${active ? 'bg-white text-sky-800' : 'bg-sky-700 text-white'}`}>{badge}</span> : null}
    </Link>
  );
}

function NavGroup({ label, items }: { label: string; items: { href: string; label: string; badge?: number }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-sky-100"
      >
        <span>{label}</span>
        <span className="text-sm">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="pl-4 space-y-1">
          {items.map((item) => (
            <div key={item.href}>
              <NavItem href={item.href} label={item.label} badge={item.badge} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LiveUpdates() {
  const [updates, setUpdates] = useState<string[]>([]);
  useEffect(() => {
    let mounted = true;
    const fetchUpdates = async () => {
      try {
        const r = await fetch('/api/newsroom/live');
        if (!mounted) return;
        if (r.ok) {
          const d = await r.json();
          setUpdates(d?.updates || []);
        }
      } catch {/* ignore */}
    };
    fetchUpdates();
    const id = setInterval(fetchUpdates, 10000);
    return () => { mounted = false; clearInterval(id); };
  }, []);
  return (
    <div className="border-t border-sky-200 p-3 max-h-32 overflow-y-auto text-xs">
      <div className="font-semibold mb-1">Live Updates</div>
      {updates.length === 0 ? (
        <div className="text-slate-500">No updates</div>
      ) : (
        <ul className="space-y-1">
          {updates.map((u, i) => (
            <li key={i}>{u}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ChangeLog() {
  return (
    <div className="border-t border-sky-200 p-3 text-[11px] text-slate-600">
      <div className="font-semibold mb-1">Updates</div>
      <ul className="space-y-1 list-disc list-inside">
        <li>Sidebar now resizable</li>
        <li>Menu supports sub-items</li>
      </ul>
    </div>
  );
}

function timeAgo(iso?: string) {
  try {
    const d = new Date(iso || '');
    const s = Math.max(1, Math.floor((Date.now() - d.getTime())/1000));
    const m = Math.floor(s/60), h=Math.floor(m/60), d2=Math.floor(h/24);
    if (d2>0) return `${d2}d ago`; if (h>0) return `${h}h ago`; if (m>0) return `${m}m ago`; return `${s}s ago`;
  } catch { return ''; }
}
