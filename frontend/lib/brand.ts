// Central place for brand assets and absolute URLs.
export const BRAND_NAME = "WaterNewsGY";

// Build an absolute URL for structured data, og:image, etc.
export function absoluteUrl(path: string) {
  if (!path) return "";
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window === "undefined"
      ? `https://${process.env.VERCEL_URL || "waternews.onrender.com"}`
      : window.location.origin);
  const base = envUrl?.startsWith("http") ? envUrl : `https://${envUrl}`;
  return path.startsWith("http") ? path : `${base}${path}`;
}
