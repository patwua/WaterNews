import Head from 'next/head';
import { useEffect, useRef } from 'react';
import useSWRInfinite from 'swr/infinite';
import type { MediaSlice } from '../lib/types/media';
import StreamCard from '../components/Streams/StreamCard';
import { postEvent, getStreamsSessionId } from '../lib/telemetry';

type Resp = { page: number; pageSize: number; count: number; items: MediaSlice[] };
const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function StreamsPage() {
  // URL sort param: latest | trending
  const params = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search);
  const sort = (params.get('sort') === 'trending' ? 'trending' : 'latest') as 'latest' | 'trending';
  const hours = (() => {
    const h = parseInt(String(params.get('hours') || ''), 10);
    return Number.isFinite(h) && h >= 1 && h <= 168 ? h : 48;
  })();

  const getKey = (pageIndex: number, previousPageData: Resp | null) => {
    if (previousPageData && previousPageData.items.length === 0) return null;
    const page = pageIndex + 1;
    const q = new URLSearchParams({ sort, page: String(page) });
    if (sort === 'trending') q.set('hours', String(hours));
    return `/api/media/streams?${q.toString()}`;
  };

  const { data, size, setSize, isValidating } = useSWRInfinite<Resp>(getKey, fetcher, {
    revalidateOnFocus: false,
  });

  const items = (data || []).flatMap((d) => d.items);
  const sentinel = useRef<HTMLDivElement>(null);
  const seen = useRef<Set<string>>(new Set());
  const activeItem = useRef<MediaSlice | null>(null);
  const activeSince = useRef<number>(0);
  const visible = useRef<boolean>(true);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setSize((p) => p + 1);
        });
      },
      { rootMargin: '200px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [setSize]);

  // Keyboard navigation: Up/Down by viewport height
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
      if (e.key === 'ArrowUp') window.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function onActive(item: MediaSlice) {
    if (seen.current.has(item.id)) return;
    seen.current.add(item.id);
    postEvent('streams_view', {
      itemId: item.id,
      mediaType: item.type,
      articleId: item.article.id,
      slug: item.article.slug,
      sort,
      ts: Date.now(),
    });
    // Focus swap: end previous, start new
    flushFocus('swap');
    activeItem.current = item;
    activeSince.current = Date.now();
    postEvent('streams_focus', {
      phase: 'start',
      itemId: item.id,
      slug: item.article.slug,
      sort,
      ts: Date.now(),
    });
  }

  // Heartbeat dwell: every 5s while visible and an item is active
  useEffect(() => {
    const id = window.setInterval(() => {
      if (!visible.current) return;
      if (!activeItem.current || !activeSince.current) return;
      postEvent('streams_dwell', {
        itemId: activeItem.current.id,
        slug: activeItem.current.article.slug,
        sinceMs: 5000,
        activeForMs: Date.now() - activeSince.current,
        sort,
        ts: Date.now(),
      });
    }, 5000);
    return () => clearInterval(id);
  }, [sort]);

  // Handle tab visibility
  useEffect(() => {
    const onVis = () => {
      const v = document.visibilityState !== 'hidden';
      if (!v) flushFocus('hidden');
      visible.current = v;
      if (v && activeItem.current && !activeSince.current) {
        activeSince.current = Date.now();
        postEvent('streams_focus', {
          phase: 'resume',
          itemId: activeItem.current.id,
          slug: activeItem.current.article.slug,
          sort,
          ts: Date.now(),
        });
      }
    };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('pagehide', () => flushFocus('pagehide'));
    window.addEventListener('beforeunload', () => flushFocus('unload'));
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pagehide', () => flushFocus('pagehide'));
      window.removeEventListener('beforeunload', () => flushFocus('unload'));
    };
  }, [sort]);

  function flushFocus(reason: 'swap' | 'hidden' | 'pagehide' | 'unload') {
    if (!activeItem.current || !activeSince.current) return;
    const dwell = Date.now() - activeSince.current;
    postEvent('streams_focus', {
      phase: 'end',
      reason,
      itemId: activeItem.current.id,
      slug: activeItem.current.article.slug,
      dwellMs: dwell,
      sort,
      ts: Date.now(),
    });
    activeSince.current = 0;
  }

  function onVideoProgress(ev: {
    item: MediaSlice;
    currentTime: number;
    duration: number;
    percent: number;
    quartile?: 25|50|75|95;
    state?: 'play' | 'pause' | 'end';
  }) {
    const base = {
      itemId: ev.item.id,
      slug: ev.item.article.slug,
      percent: Math.round(ev.percent),
      currentTime: Math.round(ev.currentTime),
      duration: Math.round(ev.duration || 0),
      sort,
      ts: Date.now(),
    };
    if (ev.state === 'play') postEvent('streams_video_play', base);
    else if (ev.state === 'pause') postEvent('streams_video_pause', base);
    else if (ev.state === 'end') postEvent('streams_video_complete', base);
    if (ev.quartile) {
      postEvent('streams_video_quartile', { ...base, quartile: ev.quartile });
    }
  }

  return (
    <>
      <Head>
        <title>Streams | WaterNews</title>
        <meta name="description" content="Quick-scroll media stream of WaterNews stories" />
      </Head>
      <div className="w-full bg-black text-white">
        <div className="max-w-[700px] mx-auto py-2 flex gap-2 px-3 text-sm">
          <SortButton label="Latest" active={sort === 'latest'} href="/streams?sort=latest" />
          <SortButton label="Trending" active={sort === 'trending'} href={`/streams?sort=trending&hours=${hours}`} />
          {sort === 'trending' && (
            <div className="ml-2 flex items-center gap-1">
              <span className="opacity-70">Window:</span>
              <a className={hours === 24 ? 'underline' : 'opacity-70 hover:underline'} href="/streams?sort=trending&hours=24">24h</a>
              <span className="opacity-50">·</span>
              <a className={hours === 48 ? 'underline' : 'opacity-70 hover:underline'} href="/streams?sort=trending&hours=48">48h</a>
              <span className="opacity-50">·</span>
              <a className={hours === 72 ? 'underline' : 'opacity-70 hover:underline'} href="/streams?sort=trending&hours=72">72h</a>
            </div>
          )}
          <div className="ml-auto opacity-70">Streams</div>
        </div>
        <main className="h-screen overflow-y-scroll snap-y snap-mandatory no-scrollbar">
          {items.map((it) => (
            <StreamCard key={it.id} item={it} onActive={onActive} onVideoProgress={onVideoProgress} />
          ))}
          <div ref={sentinel} className="h-[40vh] w-full flex items-center justify-center text-sm opacity-70">
            {isValidating ? 'Loading more…' : 'You’ve reached the end'}
          </div>
        </main>
      </div>
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}

function SortButton({ label, active, href }: { label: string; active: boolean; href: string }) {
  return (
    <a
      href={href}
      className={[
        'px-3 py-1 rounded-full border',
        active ? 'bg-white text-black border-white' : 'border-white/30 hover:bg-white/10',
      ].join(' ')}
    >
      {label}
    </a>
  );
}

