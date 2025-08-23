import React from "react";
import { LOGO_FULL, LOGO_MINI, BRAND_NAME } from "@/lib/brand";

/**
 * BrandLogo — use everywhere for consistent logo rendering.
 * - variant: "full" (wordmark) | "mini" (square mark)
 * - onDark: when true, we invert via CSS to get a white mark without extra assets
 */
export default function BrandLogo({
  variant = "full",
  onDark = false,
  className = "",
  size = 32,
}: {
  variant?: "full" | "mini";
  onDark?: boolean;
  className?: string;
  size?: number; // height in px; width auto
}) {
  const src = variant === "mini" ? LOGO_MINI : LOGO_FULL;
  const invert = onDark ? "invert" : "";
  const alt = `${BRAND_NAME} logo`;
  return (
    <img
      src={src}
      alt={alt}
      height={size}
      style={{ height: size, width: "auto" }}
      className={`${invert} ${className}`}
      loading="lazy"
    />
  );
}
