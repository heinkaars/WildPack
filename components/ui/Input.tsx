import { forwardRef, ReactNode, useState } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { colors, fonts, radii, sizes } from '../../lib/theme';
import { Gradient } from './Gradient';
import { ChevronDown, SendIcon } from './icons';

type InputProps = Omit<TextInputProps, 'style' | 'editable'> & {
  /** Figma "Variant4": warning-tinted field and text. */
  error?: boolean;
  /** Figma "Disable": muted text, not editable. */
  disabled?: boolean;
  /** Shows the chevron used for picker-style fields. */
  dropdown?: boolean;
  /** Something at the right end of the field, such as the password eye. */
  trailing?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * The 56px pill text field. Focus gives it the Figma "Selected" outline,
 * so the four Figma states come from props + focus rather than a variant prop.
 */
export const Input = forwardRef<TextInput, InputProps>(function Input(
  { error, disabled, dropdown, trailing, style, onFocus, onBlur, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const textColor = error ? colors.warning : disabled ? colors.textDisabled : colors.text;
  const chevronColor = error ? colors.warning : disabled ? colors.textDisabled : colors.text;

  return (
    <View
      style={[
        styles.field,
        focused && !error && styles.focused,
        error && styles.error,
        style,
      ]}
    >
      <TextInput
        ref={ref}
        editable={!disabled}
        placeholderTextColor={error ? colors.warningStroke : colors.textMuted}
        selectionColor={colors.primary}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[styles.text, { color: textColor }]}
        {...rest}
      />
      {dropdown && <ChevronDown color={chevronColor} />}
      {trailing}
    </View>
  );
});

type ChatInputProps = Omit<TextInputProps, 'style'> & {
  onSend: () => void;
  sendDisabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Figma Input "ai chat": smaller text with a round gradient send button. */
export function ChatInput({ onSend, sendDisabled, style, ...rest }: ChatInputProps) {
  return (
    <View style={[styles.chat, style]}>
      <TextInput
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.primary}
        style={styles.chatText}
        returnKeyType="send"
        onSubmitEditing={sendDisabled ? undefined : onSend}
        {...rest}
      />
      <Pressable
        onPress={onSend}
        disabled={sendDisabled}
        accessibilityRole="button"
        accessibilityLabel="Send"
        style={({ pressed }) => [styles.send, sendDisabled && styles.sendDisabled, pressed && styles.pressed]}
      >
        <Gradient style={styles.sendFill}>
          <SendIcon />
        </Gradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    height: sizes.input,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: colors.fill,
  },
  focused: {
    borderColor: colors.stroke,
  },
  error: {
    backgroundColor: colors.warningFill,
    borderColor: colors.warningStroke,
  },
  text: {
    flex: 1,
    minWidth: 0,
    height: '100%',
    fontFamily: fonts.bodyBold,
    fontSize: 18,
    letterSpacing: -0.3,
    // RN web draws a focus ring on inputs; the pill border is our focus state.
    outlineStyle: 'none',
  } as any,
  chat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.fill,
  },
  chatText: {
    flex: 1,
    minWidth: 0,
    minHeight: 40,
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: colors.text,
    outlineStyle: 'none',
  } as any,
  send: {
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  sendFill: {
    padding: 8,
    borderRadius: radii.pill,
  },
  sendDisabled: {
    opacity: 0.3,
  },
  pressed: {
    opacity: 0.85,
  },
});
