import { useEffect, useRef, useState } from 'react';
import type { MediaSlice } from '../../lib/types/media';
import Link from 'next/link';
import Image from 'next/image';
import { cldImage, cldVideoPoster, cldStreamOverlayFetch } from '../../lib/cloudinary';

export default function StreamCard({
  item,
  onActive,
  onVideoProgress,
  enhanceStills = true,
}: {
  item: MediaSlice;
  onActive?: (item: MediaSlice) => void;
  onVideoProgress?: (e: {
    item: MediaSlice;
    currentTime: number;
    duration: number;
    percent: number; // 0..100
    quartile?: 25 | 50 | 75 | 95;
    state?: 'play' | 'pause' | 'end';
  }) => void;
  key?: any;
  enhanceStills?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const activated = useRef(false);
  const sentQuartiles = useRef<{[k: string]: boolean}>({});
  const lastTick = useRef<number>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setActive(entry.isIntersecting && entry.intersectionRatio > 0.7));
      },
      { threshold: [0, 0.5, 0.7, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const handlePlay = () => {
      if (!onVideoProgress) return;
      const d = v.duration || 0;
      onVideoProgress({ item, currentTime: v.currentTime, duration: d, percent: pct(v), state: 'play' });
    };
    const handlePause = () => {
      if (!onVideoProgress) return;
      const d = v.duration || 0;
      onVideoProgress({ item, currentTime: v.currentTime, duration: d, percent: pct(v), state: 'pause' });
    };
    const handleEnded = () => {
      if (!onVideoProgress) return;
      const d = v.duration || 0;
      onVideoProgress({ item, currentTime: d, duration: d, percent: 100, state: 'end', quartile: 95 });
    };
    const handleTime = () => {
      if (!onVideoProgress) return;
      const now = Date.now();
      if (now - lastTick.current < 1000) return; // throttle 1s
      lastTick.current = now;
      const d = v.duration || 0;
      const p = pct(v);
      // Fire quartiles once
      const q: Array<25|50|75|95> = [25,50,75,95];
      for (const qq of q) {
        if (p >= qq && !sentQuartiles.current[String(qq)]) {
          sentQuartiles.current[String(qq)] = true;
          onVideoProgress({ item, currentTime: v.currentTime, duration: d, percent: p, quartile: qq });
        }
      }
      onVideoProgress({ item, currentTime: v.currentTime, duration: d, percent: p });
    };
    if (active) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
    v.addEventListener('play', handlePlay);
    v.addEventListener('pause', handlePause);
    v.addEventListener('ended', handleEnded);
    v.addEventListener('timeupdate', handleTime);
    return () => {
      v.removeEventListener('play', handlePlay);
      v.removeEventListener('pause', handlePause);
      v.removeEventListener('ended', handleEnded);
      v.removeEventListener('timeupdate', handleTime);
    };
  }, [active]);

  // Notify page when this card becomes active (once per activation streak)
  useEffect(() => {
    if (active && !activated.current) {
      activated.current = true;
      onActive?.(item);
    }
    if (!active) {
      activated.current = false;
    }
  }, [active, item, onActive]);

  const goLink = `/${item.article.slug}`;
  const isVideo = item.type === 'video';
  const poster = item.poster || (isVideo ? cldVideoPoster(item.src) : undefined);
  const overlayUrl =
    !isVideo && enhanceStills
      ? cldStreamOverlayFetch(item.src, item.article.title, { w: 1440, h: 2560 })
      : cldImage(item.src, { w: 1440 });

  return (
    <div ref={ref} className="snap-start h-screen w-full flex items-center justify-center relative">
      <div className="w-full h-full max-w-[700px] mx-auto relative">
        <Link href={goLink} className="absolute top-3 left-3 right-3 z-20 flex justify-between items-center">
          <div className="px-3 py-1 rounded-full bg-black/50 text-white text-sm backdrop-blur">
            {item.article.title}
          </div>
          <div className="px-3 py-1 rounded-full bg-black/50 text-white text-sm backdrop-blur">Read story →</div>
        </Link>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
          <div className="px-3 py-1 rounded-full bg-black/40 text-white text-xs">Swipe / scroll for more</div>
        </div>

        <div className="w-full h-full relative bg-black">
          {isVideo ? (
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              src={item.src}
              poster={poster}
              muted
              loop
              playsInline
              preload="metadata"
              controls={false}
            />
          ) : (
            <>
              <Image
                alt={item.article.title}
                src={overlayUrl}
                fill
                className="object-contain"
                sizes="100vw"
                priority={false}
              />
              {/* CSS overlay fallback if CLOUD not present */}
              {!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && (
                <div className="absolute inset-x-0 bottom-0 p-4 pb-6 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="text-white text-xl font-semibold drop-shadow">
                    {item.article.title}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function pct(v: HTMLVideoElement) {
  const d = v.duration || 0;
  if (!d) return 0;
  return Math.max(0, Math.min(100, (v.currentTime / d) * 100));
}
