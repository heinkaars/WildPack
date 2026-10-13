import type { TextStyle } from 'react-native';

/**
 * WildPack design tokens, taken from the Figma handoff
 * (file qqd2yAkDOA9I0mXQnpozUm — Documentation 88386:2, Component 1:220).
 */

const dark = '#21262E';

export const palette = {
  orange: '#FF9900',
  warning: '#F94F40',
  dark,
  white: '#FFFFFF',
  cream: '#FFEBCC',
  progressTrack: '#C2A264',
  badgeIcon: '#FF4C00',
  docentSelected: '#5D492A',
};

export const colors = {
  primary: palette.orange,
  warning: palette.warning,
  background: palette.white,
  surface: palette.white,
  cream: palette.cream,
  progressTrack: palette.progressTrack,

  text: dark,
  textSecondary: 'rgba(33, 38, 46, 0.8)',
  textMuted: 'rgba(33, 38, 46, 0.6)',
  textDisabled: 'rgba(33, 38, 46, 0.5)',
  textOnPrimary: palette.white,

  // Translucent "dark/N" primitives — dark ink at N% over whatever is behind.
  fill: 'rgba(33, 38, 46, 0.06)',
  fillStrong: 'rgba(33, 38, 46, 0.1)',
  stroke: 'rgba(33, 38, 46, 0.6)',
  strokeStrong: 'rgba(33, 38, 46, 0.8)',
  warningFill: 'rgba(249, 79, 64, 0.1)',
  warningStroke: 'rgba(249, 79, 64, 0.5)',

  // Legacy names from the prototype theme, mapped onto the new palette so
  // screens not yet rebuilt keep working. Remove once every screen uses the
  // names above.
  forest: palette.orange,
  forestDark: palette.warning,
  leaf: palette.orange,
  amber: palette.orange,
  ink: dark,
  inkMuted: 'rgba(33, 38, 46, 0.6)',
  border: 'rgba(33, 38, 46, 0.1)',
  danger: palette.warning,
};

/** The brand gradient: 180deg, #FF9900 → #F94F40. Pass to <Gradient> / LinearGradient. */
export const gradient = {
  colors: [palette.orange, palette.warning] as const,
  start: { x: 0, y: 0 },
  end: { x: 0, y: 1 },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  /** Horizontal padding for every screen. */
  screen: 20,
};

export const radii = {
  sm: 8,
  md: 14,
  lg: 22,
  pill: 999,
};

export const sizes = {
  button: 56,
  input: 56,
  navItem: 48,
  icon: 24,
  badge: 48,
};

/**
 * Font family names as registered in app/_layout.tsx. On Android a custom
 * font's weight must come from the family name, not fontWeight, so each
 * weight is its own family.
 */
export const fonts = {
  heading: 'Baloo2_700Bold',
  headingSemiBold: 'Baloo2_600SemiBold',
  headingExtraBold: 'Baloo2_800ExtraBold',
  body: 'Nunito_400Regular',
  bodySemiBold: 'Nunito_600SemiBold',
  bodyBold: 'Nunito_700Bold',
  bodyExtraBold: 'Nunito_800ExtraBold',
};

export const type = {
  display: { fontFamily: fonts.headingExtraBold, fontSize: 36, lineHeight: 44, color: dark },
  h1: { fontFamily: fonts.heading, fontSize: 28, lineHeight: 36, color: dark },
  h2: { fontFamily: fonts.heading, fontSize: 24, lineHeight: 32, color: dark },
  h3: { fontFamily: fonts.heading, fontSize: 20, lineHeight: 28, color: dark },
  /** Figma "Level/Button-text": Nunito Bold 18/27, -0.3 tracking. */
  button: { fontFamily: fonts.bodyBold, fontSize: 18, lineHeight: 27, letterSpacing: -0.3, color: dark },
  bodyLarge: { fontFamily: fonts.bodyBold, fontSize: 18, lineHeight: 27, letterSpacing: -0.3, color: dark },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24, color: dark },
  bodyBold: { fontFamily: fonts.bodyBold, fontSize: 16, lineHeight: 24, color: dark },
  /** Figma "Paragraph - 5/Bold": Nunito Bold 14/22, -0.2 tracking. */
  label: { fontFamily: fonts.bodyBold, fontSize: 14, lineHeight: 22, letterSpacing: -0.2, color: dark },
  small: { fontFamily: fonts.bodySemiBold, fontSize: 14, lineHeight: 21, color: dark },
  caption: { fontFamily: fonts.bodySemiBold, fontSize: 12, lineHeight: 18, color: dark },
} satisfies Record<string, TextStyle>;
