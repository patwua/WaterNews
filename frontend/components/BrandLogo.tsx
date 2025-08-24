import React from "react";
import { BRAND_NAME } from "@/lib/brand";
import { pickLogo } from "@/lib/brand-tokens";

/**
 * BrandLogo — use everywhere for consistent logo rendering.
 * - variant: "full" (wordmark) | "mark" (square mark)
 * - tone: "light" (default) or "dark" for inverted assets
 */
export default function BrandLogo({
  variant = "full",
  tone = "light",
  className = "",
  width,
  height,
}: {
  variant?: "full" | "mark";
  tone?: "light" | "dark";
  className?: string;
  width?: number;
  height?: number;
}) {
  const src = pickLogo({ variant, tone });
  const defaultDims =
    variant === "mark" ? { width: 32, height: 32 } : { width: 120, height: 32 };
  const w = width ?? defaultDims.width;
  const h = height ?? defaultDims.height;
  const alt = `${BRAND_NAME} logo`;
  return (
    <img src={src} alt={alt} width={w} height={h} className={className} loading="lazy" />
  );
}
