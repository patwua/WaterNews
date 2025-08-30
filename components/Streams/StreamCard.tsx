import { useEffect, useRef, useState, type FC } from 'react';
import type { MediaSlice } from '@/lib/types/media';
import Link from 'next/link';
import Image from 'next/image';
import { cldImage, cldVideoPoster } from '@/lib/cloudinary';

const StreamCard: FC<{ item: MediaSlice }> = ({ item }) => {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

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
    if (active) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [active]);

  const goLink = `/${item.article.slug}`;
  const isVideo = item.type === 'video';
  const poster = item.poster || (isVideo ? cldVideoPoster(item.src) : undefined);

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
            <Image
              alt={item.article.title}
              src={cldImage(item.src, { w: 1440 })}
              fill
              className="object-contain"
              sizes="100vw"
              priority={false}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StreamCard;
