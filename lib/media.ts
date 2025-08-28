// Utilities for consistent media delivery
export function withCloudinaryAuto(url?: string | null) {
  if (!url) return url as any;
  // If it's a Cloudinary delivery URL, inject f_auto,q_auto so browsers get WebP/AVIF automatically
  // Example: https://res.cloudinary.com/<cloud>/image/upload/v123/abc.jpg
  if (/^https?:\/\/res\.cloudinary\.com\//.test(url) && !/\/upload\/.*f_auto/.test(url)) {
    return url.replace(/\/upload\/(?!.*f_auto)/, "/upload/f_auto,q_auto/");
  }
  return url;
}
