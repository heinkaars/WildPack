import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, type } from '../lib/theme';
import { Button } from './ui/Button';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  style?: ViewStyle;
};

/**
 * Prototype-era button API, now drawn with the Figma Button. Screens move to
 * components/ui/Button as they are rebuilt; delete this once nothing imports it.
 */
export function PrimaryButton({ label, onPress, variant = 'primary', disabled, style }: Props) {
  if (variant === 'ghost') {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [styles.ghost, disabled && styles.disabled, pressed && !disabled && styles.pressed, style]}
      >
        <Text style={[type.button, styles.ghostLabel]}>{label}</Text>
      </Pressable>
    );
  }
  return (
    <Button
      label={label}
      onPress={onPress}
      variant={variant === 'secondary' ? 'outline' : 'primary'}
      disabled={disabled}
      style={style}
    />
  );
}

const styles = StyleSheet.create({
  ghost: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostLabel: {
    color: colors.text,
  },
  disabled: {
    opacity: 0.3,
  },
  pressed: {
    opacity: 0.85,
  },
});
