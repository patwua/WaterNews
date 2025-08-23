// Central place for brand assets and absolute URLs.
export const BRAND_NAME = "WaterNewsGY";

// Canonical SVGs in /public (transparent background).
// Keep just these two live and invert on dark when needed.
export const LOGO_FULL = "/logo-waternews.svg"; // wordmark
export const LOGO_MINI = "/logo-mini.svg"; // square mark (use for favicons/avatars/schema)

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
