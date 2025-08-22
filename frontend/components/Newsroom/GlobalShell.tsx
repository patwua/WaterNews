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
        // users/summary will set lastSeenAt and return handle/followers
        const r = await fetch('/api/users/summary');
        if (!mounted) return;
        if (r.ok) {
          setLoggedIn(true);
          setSummary(await r.json());
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
      <div className="min-h-screen grid grid-cols-12">
        {/* Sidebar (top→bottom; above footer; water/sky theme) */}
        <aside className="col-span-12 lg:col-span-3 xl:col-span-2 border-r bg-sky-50 border-sky-200 text-slate-900">
          <div className="p-4 space-y-4">
            <div className="text-xs uppercase tracking-widest text-sky-700">NewsRoom</div>
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={summary?.image || '/apple-touch-icon.png'}
                alt=""
                className="w-12 h-12 rounded-full object-cover border border-sky-200"
              />
              <div className="min-w-0">
                <div className="font-medium truncate">{summary?.name || 'Your Name'}</div>
                <div className="text-xs text-sky-700 truncate">@{summary?.handle || 'handle'}</div>
                <div className="text-xs text-slate-600">
                  {typeof summary?.followers === 'number' ? `${summary.followers} followers` : '—'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {summary?.lastSeenAt ? `Last seen ${timeAgo(summary.lastSeenAt)}` : ''}
                </div>
              </div>
            </div>
            {/* Nav */}
            <nav className="space-y-1">
              <NavItem href="/newsroom/dashboard" label="Dashboard" active={active==='dashboard'} />
              <NavItem href="/newsroom/notice-board" label="Notice Board" active={active==='notice'} badge={badges?.noticesUnread} />
              <NavItem href="/newsroom" label="Publisher" active={active==='publisher'} badge={badges?.drafts || 0} />
              <NavItem href="/newsroom/collab" label="Collaboration" active={active==='collab'} badge={badges?.collabOpportunities} />
              <NavItem href="/newsroom/media" label="Media" active={active==='media'} />
              <NavItem href="/newsroom/assistant" label="AI Assistant" active={active==='assistant'} />
              <NavItem href="/newsroom/profile" label="Profile & Settings" active={active==='profile'} />
              <button onClick={()=>signOut({ callbackUrl: '/' })} className="w-full text-left px-3 py-2 rounded hover:bg-sky-100 text-red-700">Logout</button>
            </nav>
          </div>
        </aside>
        {/* Main content (Header + pages render inside) */}
        <div className="col-span-12 lg:col-span-9 xl:col-span-10 min-h-screen flex flex-col">
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

function timeAgo(iso?: string) {
  try {
    const d = new Date(iso || '');
    const s = Math.max(1, Math.floor((Date.now() - d.getTime())/1000));
    const m = Math.floor(s/60), h=Math.floor(m/60), d2=Math.floor(h/24);
    if (d2>0) return `${d2}d ago`; if (h>0) return `${h}h ago`; if (m>0) return `${m}m ago`; return `${s}s ago`;
  } catch { return ''; }
}
