import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../lib/theme';
import { ChevronLeft } from './icons';

/** Figma "Leading/Back Button": a 44px translucent circle with a thin chevron. */
export function BackButton({ onPress, style }: { onPress: () => void; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Back"
      style={({ pressed }) => [styles.circle, pressed && styles.pressed, style]}
    >
      <ChevronLeft strokeWidth={1.5} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backButtonFill,
  },
  pressed: {
    opacity: 0.7,
  },
});
