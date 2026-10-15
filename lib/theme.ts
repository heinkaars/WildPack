import type { TextStyle } from 'react-native';

/**
 * WildPack design tokens, taken from the Figma handoff
 * (file Foqg4MWr8YslYW5bKKS1Y2 — Documentation 88386:2, Component 1:220).
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
  green: '#22C55E',
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
  /** "soft orange/10" — the info message box on auth screens. */
  primaryFill: 'rgba(255, 153, 0, 0.1)',
  /** "soft orange/20" — the selected docent card (Choose your Docent 88384:3901). */
  primaryFillStrong: 'rgba(255, 153, 0, 0.2)',
  /** The WildPack wordmark (Figma "orange/100"). */
  wordmark: palette.badgeIcon,
  /** iOS "fill/tertiary" behind the round back button. */
  backButtonFill: 'rgba(120, 120, 128, 0.16)',
  warningFill: 'rgba(249, 79, 64, 0.1)',
  warningStroke: 'rgba(249, 79, 64, 0.5)',
  /** Handoff "badge locked/attention tint". */
  warningTint: 'rgba(249, 79, 64, 0.2)',
  /** Figma "brand" green: the confidence pill on species-ID cards. */
  success: palette.green,
  successFill: 'rgba(34, 197, 94, 0.1)',
  successStroke: 'rgba(34, 197, 94, 0.2)',
  /** The lit lens factor in the camera's lens switcher. */
  lensActive: '#F8CB58',
  /** Pop-up backdrop (Figma "Overlay", black 70%). */
  overlay: 'rgba(0, 0, 0, 0.7)',
  /** Switch track when off (Figma "black/10", a warm brown at 10%). */
  switchTrack: 'rgba(110, 66, 0, 0.1)',
  /** "white/40": the week's day pills on Home when no capture that day. */
  dayPill: 'rgba(255, 255, 255, 0.4)',
  /** Base of the orange wash (soft orange 30%) under Home's overview card and life-list cards. */
  wash: 'rgba(255, 153, 0, 0.3)',
  /** Profile's Delete account row (Tailwind red-500 in Figma), its icon tile and chevron. */
  destructive: '#EF4444',
  destructiveFill: 'rgba(239, 68, 68, 0.08)',
  destructiveMuted: 'rgba(239, 68, 68, 0.4)',
  /** Chevrons on the profile's rows (dark 25%). */
  chevron: 'rgba(33, 38, 46, 0.25)',
  /** Solid stand-in for the Ask chat sheet's glass (species-Details-Ask 88384:3719). */
  sheet: '#F5F5F5',
  /** The glass itself: Figma's "rgba(245,245,245,0.6)" layer over a blur of the species page. */
  sheetGlass: 'rgba(245, 245, 245, 0.6)',
  /** iOS grabber at the top of a sheet. */
  grabber: '#CCCCCC',
  /** The user's chat bubbles (handoff "badge unlocked" tint #FBE6C2). */
  chatUser: '#FBE6C2',
  /** Off-topic answer: red wash fading into the white bubble. */
  chatOffTopic: 'rgba(255, 0, 4, 0.2)',
  /** The resting dots of the chat's typing indicator (Figma Gray/400). */
  typingDot: '#98A2B3',

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

/**
 * Plain absolute-fill style for spreading (`{ ...absoluteFill, ... }`).
 * RN 0.86 dropped StyleSheet.absoluteFillObject, and on web StyleSheet.absoluteFill
 * is a precompiled style that can't be spread.
 */
export const absoluteFill = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
} as const;

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
  button: 60,
  input: 56,
  navItem: 48,
  icon: 24,
  badge: 48,
};

/**
 * Font family names as registered in app/_layout.tsx. On Android a custom
 * font's weight must come from the family name, not fontWeight, so each
 * weight is its own family.
 *
 * Figma's "Baloo" is the original single-weight Baloo, which Google replaced
 * with Baloo 2; Baloo 2 ExtraBold is the matching weight.
 */
export const fonts = {
  title: 'FredokaOne_400Regular',
  heading: 'Baloo2_800ExtraBold',
  body: 'Nunito_400Regular',
  bodyMedium: 'Nunito_500Medium',
  bodySemiBold: 'Nunito_600SemiBold',
  bodySemiBoldItalic: 'Nunito_600SemiBold_Italic',
  bodyBold: 'Nunito_700Bold',
  bodyBlack: 'Nunito_900Black',
};

/**
 * Text styles, named after the Figma styles (Style Guide → Typography 56514:398)
 * plus the extra roles listed in the handoff doc (88386:9).
 */
export const type = {
  /** Heading/XL — Fredoka One 48/56. */
  headingXL: { fontFamily: fonts.title, fontSize: 48, lineHeight: 56, letterSpacing: -1, color: dark },
  /** Heading/L — Fredoka One 32/42. */
  headingL: { fontFamily: fonts.title, fontSize: 32, lineHeight: 42, letterSpacing: -0.5, color: dark },
  /** Heading/M — Baloo 24/1.2, section titles. */
  headingM: { fontFamily: fonts.heading, fontSize: 24, lineHeight: 29, letterSpacing: -0.4, color: dark },
  /** Level/Button-text — Nunito Bold 18/27. */
  button: { fontFamily: fonts.bodyBold, fontSize: 18, lineHeight: 27, letterSpacing: -0.3, color: dark },
  /** Level/SemiBold — Nunito SemiBold 16/24. */
  levelSemiBold: { fontFamily: fonts.bodySemiBold, fontSize: 16, lineHeight: 24, letterSpacing: -0.3, color: dark },
  /** Level/Medium — Nunito Medium 14/22. */
  levelMedium: { fontFamily: fonts.bodyMedium, fontSize: 14, lineHeight: 22, letterSpacing: -0.3, color: dark },
  /** body/md-bold — Nunito Bold 16/24, XP values and emphasised numbers. */
  bodyBold: { fontFamily: fonts.bodyBold, fontSize: 16, lineHeight: 24, letterSpacing: -0.3, color: dark },
  /** Body text/Lg — Nunito Regular 16/24. */
  bodyLg: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24, letterSpacing: -0.3, color: dark },
  /** Body text/Sm — Nunito SemiBold 14/21, greetings and body copy. */
  bodySm: { fontFamily: fonts.bodySemiBold, fontSize: 14, lineHeight: 21, color: dark },
  /** body/lg-bold — Nunito Bold 14/22, small button and nav labels. */
  label: { fontFamily: fonts.bodyBold, fontSize: 14, lineHeight: 22, letterSpacing: -0.2, color: dark },
  /** body/black — Nunito Black 14/20, notification counts. */
  count: { fontFamily: fonts.bodyBlack, fontSize: 14, lineHeight: 20, color: dark },
  /** body/sm-semibold — Nunito SemiBold 12/20, labels and day pills. */
  labelSm: { fontFamily: fonts.bodySemiBold, fontSize: 12, lineHeight: 20, letterSpacing: -0.2, color: dark },
  /** Caption/Lg — Nunito SemiBold Italic 12/20. */
  captionLg: { fontFamily: fonts.bodySemiBoldItalic, fontSize: 12, lineHeight: 20, letterSpacing: -0.2, color: dark },
  /** Caption/sm — Nunito SemiBold 10/14, life-list card labels. */
  captionSm: { fontFamily: fonts.bodySemiBold, fontSize: 10, lineHeight: 14, color: dark },
} satisfies Record<string, TextStyle>;
