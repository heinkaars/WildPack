import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
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

export function ChevronUp({ color = colors.text, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 15L12 9L18 15" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/** Pop-up close cross (Figma "Close Button Icon"). */
export function CloseIcon({ color = colors.text, size = 24, strokeWidth = 1.5 }: IconProps & { strokeWidth?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/** Camera flash bolt, drawn inside the 32px camera button (Capture-Camera-ON 88384:3813). */
export function FlashIcon({ color = colors.textOnPrimary, size = 32 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M10.3877 16.3204L18.3538 6.58408C18.7047 6.15523 19.39 6.52454 19.2247 7.05342L17.143 13.7147H22.353C22.7802 13.7147 23.0135 14.213 22.7401 14.5411L13.9747 25.0595C13.6092 25.4981 12.9111 25.0865 13.1181 24.5544L16.0002 17.1433H10.7777C10.3526 17.1433 10.1186 16.6494 10.3877 16.3204Z"
        fill={color}
      />
    </Svg>
  );
}

/** Camera swap arrows (Capture-Camera-ON 88384:3837). */
export function CameraSwapIcon({ color = colors.textOnPrimary, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16.9767 19.5C19.4017 17.8876 21 15.1305 21 12C21 7.02944 16.9706 3 12 3C11.3126 3 10.6432 3.07706 10 3.22302M20.5 19.5H16.9767V16M7 4.51555C4.58803 6.13007 3 8.87958 3 12C3 16.9706 7.02944 21 12 21C12.6874 21 13.3568 20.9229 14 20.777M3.5 4.51555H7V8"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** The shutter: a white disc inside a 4px ring, drawn 82px over a 78px button (88384:3821). */
export function ShutterIcon({ size = 82 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 82 82" fill="none">
      <Circle cx={41} cy={41} r={33.9351} fill={colors.textOnPrimary} />
      <Circle cx={41} cy={41} r={39} stroke={colors.textOnPrimary} strokeWidth={4} />
    </Svg>
  );
}

/** The small "×" after the selected lens factor (88384:3830). */
export function LensTimesIcon({ color = '#F8CB58' }: { color?: string }) {
  return (
    <Svg width={7.27} height={7.28} viewBox="0 0 7.27131 7.28245" fill="none">
      <Path d="M0.712081 0.713102L0 1.4262L5.84731 7.28245L7.27131 5.85626L1.42408 0L0.712081 0.713102Z" fill={color} />
      <Path d="M6.55923 0.713095L5.84723 0L0 5.85625L1.42399 7.28244L7.27122 1.42619L6.55923 0.713095Z" fill={color} />
    </Svg>
  );
}

/**
 * Photo-library glyph for the gallery button when there is no capture yet to
 * show there. Not a Figma export (Figma shows a photo in that slot); drawn to
 * match the camera icons' 1.5 stroke.
 */
export function GalleryIcon({ color = colors.textOnPrimary, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 16L7.5 11.5C8.3 10.7 9.7 10.7 10.5 11.5L16 17M14 15L15.5 13.5C16.3 12.7 17.7 12.7 18.5 13.5L21 16M6 21H18C19.6569 21 21 19.6569 21 18V6C21 4.34315 19.6569 3 18 3H6C4.34315 3 3 4.34315 3 6V18C3 19.6569 4.34315 21 6 21ZM16.5 8.5C16.5 9.32843 15.8284 10 15 10C14.1716 10 13.5 9.32843 13.5 8.5C13.5 7.67157 14.1716 7 15 7C15.8284 7 16.5 7.67157 16.5 8.5Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Squirrel — "Species #N" on the capture reward card (88384:3580), Figma orange/100. */
export function SpeciesIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 19.9957" fill="none">
      <Path
        d="M7.6546 19.9957H16.4418V18.8241H14.3556C14.9464 18.1665 15.2702 17.3269 15.2702 16.4418C15.2702 16.0877 15.2173 15.7457 15.1194 15.4231C15.2194 14.9907 15.2702 14.546 15.2702 14.0985C15.2702 13.8516 15.2528 13.5905 15.2257 13.3707C16.1362 13.8459 17.1531 14.0985 18.1992 14.0985H18.785V13.3988C18.785 12.0958 18.0409 10.909 16.7946 10.2242C16.4243 10.0208 16.106 9.74314 15.8572 9.41204H20L19.9957 8.82193C19.9773 6.27049 18.8786 3.09605 16.256 2.49087C15.9647 1.7112 15.3662 1.21068 14.6844 1.21068C13.7722 1.21068 13.0429 2.09244 12.9395 3.26567C12.1835 3.93279 11.7553 4.87692 11.7553 5.89717C11.7553 7.08832 10.8617 8.07401 9.70979 8.22085C10.2748 7.36861 10.5837 6.36238 10.5837 5.31136C10.5837 2.3964 8.18656 0 5.2723 0C2.36516 0 0 2.38265 0 5.31136C0 6.45768 0.371405 7.56482 1.0536 8.47396C0.363008 9.64297 0 10.9709 0 12.3411C0 16.5511 3.44512 19.9957 7.6546 19.9957ZM12.9269 5.89717C12.9269 4.51512 14.0285 3.92443 14.0985 3.84636V3.55373C14.0985 2.83865 14.4455 2.3823 14.6843 2.3823C14.8693 2.3823 15.1222 2.66134 15.225 3.12831L15.3131 3.52854L15.7193 3.58298C18.0983 3.90186 18.6555 6.93664 18.7851 8.24042H14.0563L14.3335 9.02201C14.6706 9.97259 15.3443 10.7642 16.2305 11.2511C16.9232 11.6316 17.3926 12.2216 17.5527 12.8873C16.4665 12.7534 15.447 12.2838 14.6308 11.5319L14.6306 11.5317C14.1143 11.8999 14.2133 11.8293 13.6971 12.1976C13.7531 12.3256 13.7649 12.3563 13.7918 12.4267C13.9623 12.8721 14.0619 13.3378 14.0901 13.8168C13.4688 13.2636 12.6507 12.9269 11.7554 12.9269C9.81727 12.9269 8.24049 14.5037 8.24049 16.4418H9.41212C9.41212 15.1268 10.5008 14.0614 11.8242 14.0995C13.0869 14.1359 14.1037 15.1885 14.0986 16.4518C14.0933 17.7608 13.0441 18.8241 11.7554 18.8241C11.1571 18.8241 10.0091 18.8241 9.41216 18.8241C6.80647 18.8241 4.68661 16.7042 4.68661 14.0985C4.68661 11.5144 6.80647 9.41204 9.41216 9.41204C12.84 9.41204 12.925 5.90108 12.9269 5.89717ZM5.07707 5.15905C3.79723 5.61141 2.64982 6.41343 1.77595 7.45406C1.3831 6.81358 1.17162 6.07373 1.17162 5.31136C1.17162 3.02869 3.01119 1.17162 5.2723 1.17162C7.55498 1.17162 9.41204 3.02869 9.41204 5.31136C9.41204 6.50798 8.89774 7.63012 7.99617 8.41105C5.42594 9.04251 3.51487 11.353 3.51487 14.0985C3.51487 15.7472 4.19945 17.2968 5.4261 18.4294C2.94585 17.5187 1.17162 15.1332 1.17162 12.3411C1.17162 9.54088 2.96042 7.14983 5.46754 6.26369L5.07707 5.15905Z"
        fill={colors.wordmark}
      />
      <Path d="M14.8539 5.72754L15.6823 4.8992L16.8537 6.07064L16.0254 6.89897L14.8539 5.72754Z" fill={colors.wordmark} />
    </Svg>
  );
}

/** Gradient star — the streak row on the capture reward card (88384:3586). */
export function StarIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Defs>
        <LinearGradient id="star" x1="10.668" y1="0.5" x2="10.668" y2="20" gradientUnits="userSpaceOnUse">
          <Stop stopColor={gradient.colors[0]} />
          <Stop offset="1" stopColor={gradient.colors[1]} />
        </LinearGradient>
      </Defs>
      <Path
        d="M11.4344 1.90807L13.1502 5.36806C13.3842 5.8497 14.0081 6.31168 14.5346 6.40014L17.6445 6.9211C19.6333 7.25531 20.1013 8.71008 18.6681 10.1452L16.2504 12.5829C15.8409 12.9957 15.6168 13.7919 15.7434 14.3621L16.4357 17.3797C16.9816 19.7682 15.7239 20.6922 13.628 19.4439L10.713 17.7041C10.1866 17.3895 9.31895 17.3895 8.7827 17.7041L5.86781 19.4439C3.78153 20.6922 2.51418 19.7584 3.06012 17.3797L3.75229 14.3621C3.87902 13.7919 3.6548 12.9957 3.24534 12.5829L0.827618 10.1452C-0.595725 8.71008 -0.137524 7.25531 1.85125 6.9211L4.96116 6.40014C5.47785 6.31168 6.10178 5.8497 6.33575 5.36806L8.05154 1.90807C8.98745 0.0306424 10.5083 0.0306424 11.4344 1.90807Z"
        fill="url(#star)"
      />
    </Svg>
  );
}

/** Gradient bolt — the XP row on the capture reward card (88384:3592), on a 20 box. */
export function BoltIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="-1.8828 0 20 20" fill="none">
      <Defs>
        <LinearGradient id="bolt" x1="8.8815" y1="0" x2="8.8815" y2="20" gradientUnits="userSpaceOnUse">
          <Stop stopColor={gradient.colors[0]} />
          <Stop offset="1" stopColor={gradient.colors[1]} />
        </LinearGradient>
      </Defs>
      <Path
        d="M4.97897 20C4.57339 20 4.32433 19.6176 4.41073 19.2719L6.11155 12.4688H0.585967C0.352022 12.4688 0.140498 12.3296 0.0478812 12.1148C-0.044736 11.9 -0.000673531 11.6506 0.159991 11.4805L10.8292 0.183664C11.0122 -0.0100863 11.3029 -0.0559847 11.5366 0.0720231C11.7703 0.199992 11.8883 0.469562 11.8237 0.728078L10.1229 7.53128H15.6485C15.8824 7.53128 16.0939 7.67042 16.1866 7.88527C16.2792 8.10011 16.2351 8.34945 16.0744 8.51952L5.40519 19.8164C5.29151 19.9368 5.13628 20 4.97897 20Z"
        fill="url(#bolt)"
      />
    </Svg>
  );
}
