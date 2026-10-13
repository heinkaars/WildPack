import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radii, sizes, type } from '../../lib/theme';
import { Gradient } from './Gradient';
import { CameraLensIcon, HomeIcon } from './icons';

export type NavTab = 'home' | 'capture';

type Props = {
  active: NavTab;
  onHome: () => void;
  onCapture: () => void;
  style?: StyleProp<ViewStyle>;
};

/** Figma "Bottom Navigation": a cream pill with a round Home button and a Capture pill. */
export function BottomNav({ active, onHome, onCapture, style }: Props) {
  const homeActive = active === 'home';
  const captureActive = active === 'capture';

  return (
    <View style={[styles.bar, style]}>
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

      <Pressable
        onPress={onCapture}
        accessibilityRole="button"
        accessibilityLabel="Capture"
        accessibilityState={{ selected: captureActive }}
        style={({ pressed }) => [styles.item, pressed && styles.pressed]}
      >
        {captureActive ? (
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
  pressed: {
    opacity: 0.85,
  },
});
