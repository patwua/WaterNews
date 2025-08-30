import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import type { MediaSlice } from '@/lib/types/media';
import StreamCard from '@/components/Streams/StreamCard';

export default function StreamsPage() {
  const [items, setItems] = useState<MediaSlice[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPage = async () => {
      if (loading || done) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/media/streams?sort=latest&page=${page}`);
        const data = await res.json();
        setItems((prev) => prev.concat(data.items));
        if (data.items.length === 0) setDone(true);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [page, done, loading]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setPage((p) => p + 1);
        });
      },
      { rootMargin: '200px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Keyboard navigation: Up/Down by viewport height
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
      if (e.key === 'ArrowUp') window.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <Head>
        <title>Streams | WaterNews</title>
        <meta name="description" content="Quick-scroll media stream of WaterNews stories" />
      </Head>
      <main className="w-full h-screen overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black text-white">
        {items.map((it) => (
          <StreamCard key={it.id} item={it} />
        ))}
        <div ref={sentinel} className="h-[40vh] w-full flex items-center justify-center text-sm opacity-70">
          {loading ? 'Loading more…' : done ? 'You’ve reached the end' : ''}
        </div>
      </main>
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
