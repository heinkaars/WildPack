import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radii, sizes, type } from '../../lib/theme';
import { Gradient } from './Gradient';
import { ChevronLeft, ChevronRight } from './icons';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';

type Props = {
  label: string;
  onPress: () => void;
  /** primary = gradient (Figma "Default"), secondary = white, outline = 1px dark border. */
  variant?: ButtonVariant;
  /** Figma "Disable": the same button at 30% opacity. */
  disabled?: boolean;
  chevronLeft?: boolean;
  chevronRight?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  chevronLeft,
  chevronRight,
  style,
}: Props) {
  const fg = variant === 'primary' ? colors.textOnPrimary : colors.text;
  const content = (
    <>
      {chevronLeft && <ChevronLeft color={fg} />}
      <Text style={[type.button, styles.label, { color: fg }]} numberOfLines={1}>
        {label}
      </Text>
      {chevronRight && <ChevronRight color={fg} />}
    </>
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.shell,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {variant === 'primary' ? (
        <Gradient style={styles.body}>{content}</Gradient>
      ) : (
        <View style={[styles.body, variant === 'secondary' ? styles.secondary : styles.outline]}>{content}</View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shell: {
    height: sizes.button,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 24,
    borderRadius: radii.pill,
  },
  secondary: {
    backgroundColor: colors.surface,
  },
  outline: {
    borderWidth: 1,
    borderColor: colors.text,
  },
  label: {
    textAlign: 'center',
    flexShrink: 1,
  },
  disabled: {
    opacity: 0.3,
  },
  pressed: {
    opacity: 0.85,
  },
});
