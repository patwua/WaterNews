export const colors = {
  /** Core brand blue */
  primary: '#1583c2',
  /** Lighter border/hover shade */
  primaryLight: '#cfe6f7',
  /** Lightest background shade */
  primaryLighter: '#eff7fd',
  /** Soft gradient start */
  primarySoftFrom: '#e8f4fd',
  /** Soft gradient end */
  primarySoftTo: '#f7fbff',
  /** Tag background */
  primaryTagBg: '#e6f2fb',
  /** Tag text */
  primaryTagText: '#0f6cad',
  /** Darker blues for gradients */
  brandBlue: '#0f6cad',
  brandBlueDark: '#0b5d95',
  brandBlueDarker: '#0a4f7f',
  /** Accent gold used in logo */
  gold: '#F2A300',
};

export const fonts = {
  sans: "'Inter', sans-serif",
  serif: "'Merriweather', serif",
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
};

// Logo and icon asset tokens
export const LOGO_FULL = "/brand/logo-full.svg";
export const LOGO_FULL_DARK = "/brand/logo-full-dark.svg";
export const LOGO_MARK = "/brand/logo-mark.svg";
export const LOGO_MARK_DARK = "/brand/logo-mark-dark.svg";

export const OG_DEFAULT = "/brand/og-default.png";
export const FAVICON_16 = "/brand/favicon-16x16.png";
export const FAVICON_32 = "/brand/favicon-32x32.png";
export const APPLE_TOUCH = "/brand/apple-touch-icon.png";
export const MASK_ICON = "/brand/mask-icon.svg";
export const CHROME_192 = "/brand/android-chrome-192x192.png";
export const CHROME_512 = "/brand/android-chrome-512x512.png";

// Legacy paths kept for backward compatibility
export const LEGACY_LOGO_FULL = "/logo-waternews.svg";
export const LEGACY_LOGO_MARK = "/logo-mini.svg";

export const logos = {
  full: LOGO_FULL,
  fullDark: LOGO_FULL_DARK,
  mark: LOGO_MARK,
  markDark: LOGO_MARK_DARK,
};

export function pickLogo({
  variant = "full",
  tone = "light",
}: {
  variant: "full" | "mark";
  tone: "light" | "dark";
}) {
  if (variant === "mark") {
    return tone === "dark" ? LOGO_MARK_DARK : LOGO_MARK;
  }
  return tone === "dark" ? LOGO_FULL_DARK : LOGO_FULL;
}

export default {
  colors,
  fonts,
  spacing,
  logos,
};
