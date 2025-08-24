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

import { LOGO_FULL, LOGO_MINI } from './brand';

export const logos = {
  full: LOGO_FULL,
  mini: LOGO_MINI,
};

export default {
  colors,
  fonts,
  spacing,
  logos,
};
