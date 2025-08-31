// Optional helpers. If NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set,
// these return the original URL so the app still works.
const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export function cldImage(url: string, opts?: { w?: number; h?: number; q?: number; f?: string }) {
  if (!CLOUD) return url;
  const { w = 1080, h, q = 70, f = 'auto' } = opts || {};
  const t = [`f_${f}`, `q_${q}`, `w_${w}`].concat(h ? [`h_${h}`, 'c_fill'] : []).join(',');
  if (url.includes('/upload/')) return url.replace('/upload/', `/upload/${t}/`);
  return `https://res.cloudinary.com/${CLOUD}/image/upload/${t}/${url}.jpg`;
}

export function cldVideoPoster(publicIdOrUrl: string, w = 1080) {
  if (!CLOUD) return undefined;
  const t = `f_auto,q_70,w_${w}`;
  if (publicIdOrUrl.includes('/upload/')) {
    return publicIdOrUrl
      .replace('/video/upload/', `/video/upload/${t}/`)
      .replace('.mp4', '.jpg');
  }
  return `https://res.cloudinary.com/${CLOUD}/video/upload/${t}/${publicIdOrUrl}.jpg`;
}

// Build a Cloudinary "fetch" URL with a bold headline overlay for Streams stills.
// If CLOUD is missing, return original url and UI will use CSS overlay fallback.
export function cldStreamOverlayFetch(
  srcUrl: string,
  title: string,
  opts?: { w?: number; h?: number; pad?: number }
) {
  if (!CLOUD) return srcUrl;
  const w = opts?.w ?? 1440;
  const h = opts?.h ?? 2560; // tall for mobile object-contain
  const pad = Math.max(12, Math.min(80, opts?.pad ?? 36));
  // Encode text for l_text; keep it short (2 lines max ideally)
  const safe = (title || '').replace(/\n/g, ' ').slice(0, 120);
  const enc = encodeURIComponent(safe).replace(/%2C/g, '%252C'); // commas must be double-encoded for l_text
  // Use Inter/Arial-like font; bold ~700 weight at ~64 size
  // Create a semi-opaque black bar via text background (bg parameter on text layer is not supported universally),
  // so we use stroke for legibility + slight shadow (e_shadow:50) and place at south with Y offset.
  const textLayer = `l_text:Arial_700_64:${enc},co_rgb:ffffff,stroke:2,co_rgb:000000,g_south,y_${pad}`;
  const base = `c_fit,w_${w},h_${h},q_auto,f_auto`;
  const encodedSrc = encodeURIComponent(srcUrl);
  return `https://res.cloudinary.com/${CLOUD}/image/fetch/${base}/${textLayer}/${encodedSrc}`;
}
