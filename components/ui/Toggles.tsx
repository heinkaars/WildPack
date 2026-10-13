import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, radii } from '../../lib/theme';
import { Gradient } from './Gradient';

// Figma Component page: checkbox 70233:1205, radio 70233:1214, switch 70233:1220.
// The controls are small (16px), so each gets hitSlop to reach a 44pt tap target.

type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const HIT_SLOP = 14;

export function Checkbox({ checked, onChange, disabled, accessibilityLabel, style }: ToggleProps) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      disabled={disabled}
      hitSlop={HIT_SLOP}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled: !!disabled }}
      accessibilityLabel={accessibilityLabel}
      style={[styles.box, disabled && styles.disabled, style]}
    >
      {checked ? (
        <Gradient style={[StyleSheet.absoluteFill, styles.boxFill]}>
          <Svg width={8} height={5.75654} viewBox="0 0 8 5.75654" fill="none">
            <Path
              d="M7.81411 0.18583C7.56659 -0.0620213 7.16466 -0.0618651 6.9168 0.18583L2.8783 4.22449L1.08335 2.42957C0.835501 2.18172 0.433739 2.18172 0.185888 2.42957C-0.0619628 2.67742 -0.0619628 3.07918 0.185888 3.32703L2.42947 5.57061C2.55332 5.69446 2.71571 5.75654 2.87812 5.75654C3.04053 5.75654 3.20309 5.69462 3.32693 5.57061L7.81411 1.08328C8.06196 0.835599 8.06196 0.433665 7.81411 0.18583Z"
              fill={colors.textOnPrimary}
            />
          </Svg>
        </Gradient>
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.boxEmpty]} />
      )}
    </Pressable>
  );
}

/** A single radio dot; group several and keep the selected value in the parent. */
export function Radio({ checked, onChange, disabled, accessibilityLabel, style }: ToggleProps) {
  return (
    <Pressable
      onPress={() => onChange(true)}
      disabled={disabled}
      hitSlop={HIT_SLOP}
      accessibilityRole="radio"
      accessibilityState={{ checked, disabled: !!disabled }}
      accessibilityLabel={accessibilityLabel}
      style={[styles.radio, disabled && styles.disabled, style]}
    >
      {checked ? (
        <Gradient style={[StyleSheet.absoluteFill, styles.radioFill]}>
          <View style={styles.radioDot} />
        </Gradient>
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.radioEmpty]} />
      )}
    </Pressable>
  );
}

export function Switch({ checked, onChange, disabled, accessibilityLabel, style }: ToggleProps) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      disabled={disabled}
      hitSlop={{ top: HIT_SLOP / 2, bottom: HIT_SLOP / 2 }}
      accessibilityRole="switch"
      accessibilityState={{ checked, disabled: !!disabled }}
      accessibilityLabel={accessibilityLabel}
      style={[styles.switch, disabled && styles.disabled, style]}
    >
      {checked ? <Gradient style={styles.track} /> : <View style={[styles.track, styles.trackOff]} />}
      <View style={[styles.knob, checked ? styles.knobOn : styles.knobOff]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: { width: 16, height: 16 },
  boxFill: { borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  boxEmpty: { borderRadius: 4, borderWidth: 1, borderColor: colors.text },

  radio: { width: 16, height: 16 },
  radioFill: { borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: radii.pill, backgroundColor: colors.surface },
  radioEmpty: { borderRadius: radii.pill, borderWidth: 1, borderColor: colors.text },

  // Figma frame is 60×30 with the track ending 5px short of the right edge.
  switch: { width: 60, height: 30 },
  track: { position: 'absolute', left: 0, top: 0, bottom: 0, right: 5, borderRadius: 30 },
  trackOff: { backgroundColor: colors.switchTrack },
  knob: {
    position: 'absolute',
    top: 3,
    width: 24,
    height: 24,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
  },
  knobOff: {
    left: 3,
    shadowColor: 'rgb(17, 33, 55)',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  knobOn: { left: 28 },

  disabled: { opacity: 0.3 },
});
