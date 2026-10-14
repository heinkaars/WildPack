import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { colors, gradient } from '../../lib/theme';

// Paths are the Figma exports (Component page 1:220), drawn on a 24×24 grid.

type IconProps = { color?: string; size?: number };

export function ChevronLeft({ color = colors.text, size = 24, strokeWidth = 2 }: IconProps & { strokeWidth?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 18L9 12L15 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ChevronRight({ color = colors.text, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18L15 12L9 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ChevronDown({ color = colors.text, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 9L12 15L18 9" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function HomeIcon({ color = colors.text, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 11.9896V14.5C3 17.7998 3 19.4497 4.02513 20.4749C5.05025 21.5 6.70017 21.5 10 21.5H14C17.2998 21.5 18.9497 21.5 19.9749 20.4749C21 19.4497 21 17.7998 21 14.5V11.9896C21 10.3083 21 9.46773 20.6441 8.74005C20.2882 8.01237 19.6247 7.49628 18.2976 6.46411L16.2976 4.90855C14.2331 3.30285 13.2009 2.5 12 2.5C10.7991 2.5 9.76689 3.30285 7.70242 4.90855L5.70241 6.46411C4.37533 7.49628 3.71179 8.01237 3.3559 8.74005C3 9.46773 3 10.3083 3 11.9896Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 15C14 13.8954 13.1046 13 12 13C10.8954 13 10 13.8954 10 15C10 16.1046 10.8954 17 12 17C13.1046 17 14 16.1046 14 15Z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CameraLensIcon({ color = colors.text, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21.4155 15.3411C18.5924 17.3495 14.8895 17.5726 11.877 16M2.58445 8.65889C5.41439 6.64566 9.12844 6.42638 12.1448 8.01149M15.3737 14.1243C18.2604 12.305 19.9319 8.97413 19.601 5.51222M8.58184 9.90371C5.72231 11.7291 4.06959 15.0436 4.39878 18.4878M15.5269 10.137C15.3939 6.72851 13.345 3.61684 10.1821 2.17222M8.47562 13.9256C8.63112 17.3096 10.6743 20.392 13.8177 21.8278M19.071 4.92893C22.9763 8.83418 22.9763 15.1658 19.071 19.071C15.1658 22.9763 8.83416 22.9763 4.92893 19.071C1.02369 15.1658 1.02369 8.83416 4.92893 4.92893C8.83418 1.02369 15.1658 1.02369 19.071 4.92893ZM14.8284 9.17157C16.3905 10.7337 16.3905 13.2663 14.8284 14.8284C13.2663 16.3905 10.7337 16.3905 9.17157 14.8284C7.60948 13.2663 7.60948 10.7337 9.17157 9.17157C10.7337 7.60948 13.2663 7.60948 14.8284 9.17157Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function SendIcon({ color = colors.textOnPrimary, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14.7326 4.19552C18.0326 3.10501 19.683 2.55936 20.5578 3.4338C21.4326 4.30861 20.8877 5.95966 19.7971 9.25997L17.8596 15.1223C16.6238 18.8621 16.0051 20.7318 14.8791 20.9602C14.6408 21.0085 14.395 21.013 14.1545 20.9729C13.0188 20.783 12.313 18.9356 10.9016 15.2414C10.6328 14.5377 10.498 14.1854 10.2571 13.9123C10.2016 13.8495 10.1421 13.79 10.0793 13.7346C9.80629 13.4937 9.45441 13.3597 8.7512 13.091C5.05658 11.6794 3.20926 10.973 3.01975 9.83712C2.97963 9.59657 2.98312 9.35097 3.03147 9.11251C3.25983 7.9865 5.13035 7.36893 8.87034 6.13302L14.7326 4.19552ZM16.0285 7.95919C15.7357 7.66631 15.2609 7.66634 14.968 7.95919L12.2707 10.6565C11.9778 10.9494 11.9778 11.4241 12.2707 11.717C12.5636 12.0097 13.0385 12.0098 13.3313 11.717L16.0285 9.01974C16.3213 8.72692 16.3212 8.25209 16.0285 7.95919Z"
        fill={color}
      />
    </Svg>
  );
}

/** Drawn on a 12.67 grid in Figma (selected docent card). */
export function CheckCircleIcon({ color = colors.textOnPrimary, size = 12.6667 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 12.6667 12.6667" fill="none">
      <Path
        d="M3.70833 6.33333L5.45833 8.08333L8.95833 4.58333M12.1667 6.33333C12.1667 9.55499 9.55499 12.1667 6.33333 12.1667C3.11167 12.1667 0.5 9.55499 0.5 6.33333C0.5 3.11167 3.11167 0.5 6.33333 0.5C9.55499 0.5 12.1667 3.11167 12.1667 6.33333Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Figma "eye" (auth password fields): tap to show the password. */
export function EyeIcon({ color = colors.text, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2.42012 12.7132C2.28394 12.4975 2.21584 12.3897 2.17772 12.2234C2.14909 12.0985 2.14909 11.9015 2.17772 11.7766C2.21584 11.6103 2.28394 11.5025 2.42012 11.2868C3.54553 9.50484 6.8954 5 12.0004 5C17.1054 5 20.4553 9.50484 21.5807 11.2868C21.7169 11.5025 21.785 11.6103 21.8231 11.7766C21.8517 11.9015 21.8517 12.0985 21.8231 12.2234C21.785 12.3897 21.7169 12.4975 21.5807 12.7132C20.4553 14.4952 17.1054 19 12.0004 19C6.8954 19 3.54553 14.4952 2.42012 12.7132Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12.0004 15C13.6573 15 15.0004 13.6569 15.0004 12C15.0004 10.3431 13.6573 9 12.0004 9C10.3435 9 9.0004 10.3431 9.0004 12C9.0004 13.6569 10.3435 15 12.0004 15Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** The eye struck through, shown while the password is visible. Same icon set as EyeIcon; not on the Figma screens. */
export function EyeOffIcon({ color = colors.text, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10.7429 5.09232C11.1494 5.03223 11.5686 5 12.0004 5C17.1054 5 20.4553 9.50484 21.5807 11.2868C21.7169 11.5025 21.785 11.6103 21.8231 11.7767C21.8518 11.9016 21.8517 12.0987 21.8231 12.2236C21.7849 12.3899 21.7164 12.4985 21.5792 12.7156C21.2793 13.1901 20.8222 13.8571 20.2165 14.5805M6.72432 6.71504C4.56225 8.1817 3.09445 10.2194 2.42111 11.2853C2.28428 11.5019 2.21587 11.6102 2.17774 11.7765C2.1491 11.9014 2.14909 12.0984 2.17771 12.2234C2.21583 12.3897 2.28393 12.4975 2.42013 12.7132C3.54554 14.4952 6.89541 19 12.0004 19C14.0588 19 15.8319 18.2676 17.2888 17.2766M3.00042 3L21.0004 21M9.8791 9.87868C9.3362 10.4216 9.00042 11.1716 9.00042 12C9.00042 13.6569 10.3436 15 12.0004 15C12.8288 15 13.5788 14.6642 14.1217 14.1213"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Figma location pin (Turn on Location pop-up), drawn on a 68 grid. */
export function PinIcon({ color = colors.textOnPrimary, size = 68 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 68 68" fill="none">
      <Path
        d="M34.0036 5.66699C44.0413 5.66718 53.5859 11.6146 57.5621 20.9092C64.9065 38.0781 49.8639 49.9771 38.5836 60.54C37.3552 61.6903 35.7127 62.3329 34.0036 62.333C32.2942 62.333 30.6513 61.6904 29.4225 60.54C18.17 49.9406 3.09032 38.0995 10.444 20.9092C14.4202 11.6144 23.9657 5.66699 34.0036 5.66699ZM33.9996 21.25C28.523 21.2502 24.0836 25.6903 24.0836 31.167C24.0838 36.6436 28.5231 41.0828 33.9996 41.083C39.4764 41.083 43.9165 36.6437 43.9166 31.167C43.9166 25.6902 39.4765 21.25 33.9996 21.25Z"
        fill={color}
      />
    </Svg>
  );
}

/** Figma asterisk bullet with the brand gradient stroke (location pop-up), on a 16 grid. */
export function SparkIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Defs>
        <LinearGradient id="spark" x1="8.5" y1="2.66667" x2="8.5" y2="13.3333" gradientUnits="userSpaceOnUse">
          <Stop stopColor={gradient.colors[0]} />
          <Stop offset="1" stopColor={gradient.colors[1]} />
        </LinearGradient>
      </Defs>
      <Path
        d="M8 2.66667V13.3333M12 4L4 12M13.3333 8H2.66667M12 12L4 4"
        stroke="url(#spark)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
