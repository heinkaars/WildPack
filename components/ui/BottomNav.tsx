import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radii, sizes, type } from '../../lib/theme';
import { Gradient } from './Gradient';
import { CameraLensIcon, CaptureStatIcon, HomeIcon } from './icons';

export type NavTab = 'home' | 'capture';

type Props = {
  active: NavTab;
  /** Leave out to hide the Home button (e.g. on the Home screen itself). Capture then stands alone in the cream style. */
  onHome?: () => void;
  onCapture: () => void;
  style?: StyleProp<ViewStyle>;
};

/** Figma "Bottom Navigation": a cream pill with a round Home button and a Capture pill. */
export function BottomNav({ active, onHome, onCapture, style }: Props) {
  const homeActive = active === 'home';
  const captureActive = active === 'capture';
  // Without a Home button (the Life list screen) Capture stands alone: cream like the streak pill,
  // the profile screen's gradient aperture icon, black label.
  const captureSolo = !onHome;

  return (
    <View style={[styles.bar, style]}>
      {onHome && (
        <Pressable
          onPress={onHome}
          accessibilityRole="button"
          accessibilityLabel="Home"
          accessibilityState={{ selected: homeActive }}
          style={({ pressed }) => [styles.item, pressed && styles.pressed]}
        >
          {homeActive ? (
            <Gradient style={[styles.fill, styles.home]}>
              <HomeIcon color={colors.textOnPrimary} />
            </Gradient>
          ) : (
            <View style={[styles.fill, styles.home, styles.idle]}>
              <HomeIcon color={colors.text} />
            </View>
          )}
        </Pressable>
      )}

      <Pressable
        onPress={onCapture}
        accessibilityRole="button"
        accessibilityLabel="Capture"
        accessibilityState={{ selected: captureActive }}
        style={({ pressed }) => [styles.item, pressed && styles.pressed]}
      >
        {captureSolo ? (
          <View style={[styles.fill, styles.capture, styles.solo]}>
            <CaptureStatIcon size={24} />
            <Text style={type.label}>Capture</Text>
          </View>
        ) : captureActive ? (
          <Gradient style={[styles.fill, styles.capture]}>
            <CameraLensIcon color={colors.textOnPrimary} />
            <Text style={[type.label, { color: colors.textOnPrimary }]}>Capture</Text>
          </Gradient>
        ) : (
          <View style={[styles.fill, styles.capture, styles.idle]}>
            <CameraLensIcon color={colors.text} />
            <Text style={type.label}>Capture</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 4,
    padding: 2,
    borderRadius: 58,
    backgroundColor: colors.cream,
  },
  item: {
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  fill: {
    height: sizes.navItem,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
  },
  home: {
    width: sizes.navItem,
  },
  capture: {
    width: 105,
    gap: 6,
  },
  idle: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.strokeStrong,
  },
  solo: {
    backgroundColor: colors.cream,
  },
  pressed: {
    opacity: 0.85,
  },
});
