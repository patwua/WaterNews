import React from "react";
import type { SVGProps, ReactNode } from "react";
import { pickLogo } from "@/lib/brand-tokens";

// Per-glyph viewBox so our logo (SVG file) renders crisply.
const GLYPHS: Record<string, { viewBox: string; node: ReactNode }> = {
  // 24x24 line icons (stroke tuned to match WaterNews logo weight)
  home: { viewBox: "0 0 24 24", node: (
    <>
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" />
    </>
  )},
  search: { viewBox: "0 0 24 24", node: (
    <>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </>
  )},
  bell: { viewBox: "0 0 24 24", node: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 6-3 8-3 8h18s-3-2-3-8" />
      <path d="M13.5 20a2.5 2.5 0 0 1-3 0" />
    </>
  )},
  user: { viewBox: "0 0 24 24", node: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </>
  )},
  settings: { viewBox: "0 0 24 24", node: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V22a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H2a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1A2 2 0 1 1 6.1 4l.1.1a1.7 1.7 0 0 0 1.8.3A1.7 1.7 0 0 0 9 2.9V2a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1A2 2 0 0 1 22 6.1l-.1.1a1.7 1.7 0 0 0-.3 1.8 1.7 1.7 0 0 0 1.5 1H23a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.5 1z" />
    </>
  )},
  menu: { viewBox: "0 0 24 24", node: (
    <>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </>
  )},
  close: { viewBox: "0 0 24 24", node: (
    <>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </>
  )},
  bookmark: { viewBox: "0 0 24 24", node: <path d="M6 4h12a1 1 0 0 1 1 1v16l-7-4-7 4V5a1 1 0 0 1 1-1z" /> },
  message:  { viewBox: "0 0 24 24", node: <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" /> },
  share: { viewBox: "0 0 24 24", node: (
    <>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.59 11.51l6.83-3.02M8.59 12.49l6.83 3.02" />
    </>
  )},
};

type GlyphName = keyof typeof GLYPHS;

interface IconProps extends SVGProps<SVGSVGElement> {
  name: GlyphName | "logo";
  size?: number;
  className?: string;
}

export default function Icon({ name, size = 24, className = "", ...props }: IconProps) {
  if (name === "logo") {
    const src = pickLogo({ variant: "mark", tone: "light" });
    return (
      <img
        src={src}
        alt="WaterNewsGY logo"
        className={className}
        width={size}
        height={size}
        {...(props as any)}
      />
    );
  }
  const glyph = GLYPHS[name as GlyphName];
  if (!glyph) return null;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={glyph.viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {glyph.node}
    </svg>
  );
}
