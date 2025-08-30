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
