import Head from 'next/head';
import { useEffect, useRef } from 'react';
import useSWRInfinite from 'swr/infinite';
import type { MediaSlice } from '@/lib/types/media';
import StreamCard from '@/components/Streams/StreamCard';

type Resp = { page: number; pageSize: number; count: number; items: MediaSlice[] };
const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function StreamsPage() {
  // URL sort param: latest | trending
  const params = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search);
  const sort = (params.get('sort') === 'trending' ? 'trending' : 'latest') as 'latest' | 'trending';

  const getKey = (pageIndex: number, previousPageData: Resp | null) => {
    if (previousPageData && previousPageData.items.length === 0) return null;
    const page = pageIndex + 1;
    return `/api/media/streams?sort=${sort}&page=${page}`;
  };

  const { data, size, setSize, isValidating } = useSWRInfinite<Resp>(getKey, fetcher, {
    revalidateOnFocus: false,
  });

  const items = (data || []).flatMap((d) => d.items);
  const sentinel = useRef<HTMLDivElement>(null);
  const seen = useRef<Set<string>>(new Set());

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
    // Fire-and-forget telemetry; /api/telemetry/events already exists in your repo
    fetch('/api/telemetry/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'streams_view',
        itemId: item.id,
        mediaType: item.type,
        articleId: item.article.id,
        slug: item.article.slug,
        ts: Date.now(),
      }),
    }).catch(() => {});
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
          <SortButton label="Trending" active={sort === 'trending'} href="/streams?sort=trending" />
          <div className="ml-auto opacity-70">Streams</div>
        </div>
        <main className="h-screen overflow-y-scroll snap-y snap-mandatory no-scrollbar">
          {items.map((it) => (
            <StreamCard key={it.id} item={it} onActive={onActive} />
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

