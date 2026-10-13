import Svg, { Path } from 'react-native-svg';
import { colors } from '../../lib/theme';

// Paths are the Figma exports (Component page 1:220), drawn on a 24×24 grid.

type IconProps = { color?: string; size?: number };

export function ChevronLeft({ color = colors.text, size = 24 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 18L9 12L15 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
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
