import { ReactNode, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInputProps,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BackButton, EyeIcon, EyeOffIcon, Input, ScreenStatusBar } from './ui';
import { colors, spacing, type } from '../lib/theme';

/**
 * The frame every auth screen shares (Figma SignIn 88384:3985, SignUP 88384:4021):
 * the warm wash at the top, a round back button, a title, room for fields that
 * the keyboard cannot cover, and one place for the error to appear.
 */
export function AuthScreen({
  title,
  subtitle,
  error,
  wordmark,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  error?: string | null;
  /** Shows "WildPack" beside the back button, as on Create Account. */
  wordmark?: boolean;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <AuthBackground />
      <ScreenStatusBar />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBar}>
            {router.canGoBack() && <BackButton onPress={() => router.back()} />}
            {wordmark && (
              <View style={styles.wordmarkSlot} pointerEvents="none">
                <Text style={styles.wordmark}>WildPack</Text>
              </View>
            )}
          </View>

          <View style={styles.header}>
            <Text style={type.headingL}>{title}</Text>
            {subtitle ? <Text style={type.bodyLg}>{subtitle}</Text> : null}
          </View>

          {error ? <MessageBox tone="error">{error}</MessageBox> : null}

          <View style={styles.fields}>{children}</View>

          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

/**
 * Figma "BG": an orange wash with a hint of lime in the lower left, fading to
 * white by the middle of the screen. The CSS angles (237° and 197.6°) are
 * turned into start/end points on the wash's box.
 */
function AuthBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={styles.wash}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.61)']}
          locations={[0.415, 0.979]}
          start={{ x: 0.919, y: 0.228 }}
          end={{ x: 0.081, y: 0.772 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={['rgba(174, 255, 0, 0)', 'rgba(174, 255, 0, 0.245)']}
          locations={[0.36, 1]}
          start={{ x: 0.651, y: 0.023 }}
          end={{ x: 0.349, y: 0.977 }}
          style={StyleSheet.absoluteFill}
        />
      </View>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.96)', colors.background]}
        locations={[0.25, 0.45, 0.7]}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

/** A pill field with the eye that shows or hides what was typed. */
export function PasswordInput(props: Omit<TextInputProps, 'secureTextEntry' | 'editable' | 'style'> & {
  error?: boolean;
  disabled?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <Input
      {...props}
      secureTextEntry={!visible}
      autoCapitalize="none"
      trailing={
        <Pressable
          onPress={() => setVisible((v) => !v)}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </Pressable>
      }
    />
  );
}

/** Small help or problem text that sits under a field. */
export function FieldNote({ children, tone = 'muted' }: { children: ReactNode; tone?: 'muted' | 'error' }) {
  return <Text style={[styles.note, tone === 'error' && styles.noteError]}>{children}</Text>;
}

/**
 * Figma "Info message container" (soft orange) — and, for problems, the same
 * box in the warning tint, since the screens have no designed error state.
 */
export function MessageBox({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'error' }) {
  return (
    <View
      style={[styles.message, tone === 'error' && styles.messageError]}
      accessibilityLiveRegion="polite"
    >
      <Text style={[type.bodyLg, tone === 'error' && styles.messageErrorText]}>{children}</Text>
    </View>
  );
}

/** The main button with its link 10px underneath, centred (Figma "Sign in button container"). */
export function ActionGroup({ children }: { children: ReactNode }) {
  return <View style={styles.actions}>{children}</View>;
}

/** A quiet 14px link, for "Forgot Password?" and the like. */
export function TextLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={8} accessibilityRole="link">
      <Text style={styles.link}>{label}</Text>
    </Pressable>
  );
}

/** "Already have an account? Sign in" — plain lead-in, orange underlined action. */
export function PromptLink({ prompt, action, onPress }: { prompt: string; action: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={8} accessibilityRole="link" accessibilityLabel={`${prompt} ${action}`}>
      <Text style={styles.link}>
        {prompt} <Text style={styles.linkAction}>{action}</Text>
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scroll: {
    paddingHorizontal: spacing.screen,
    paddingTop: 12,
    paddingBottom: spacing.xl,
  },

  wash: {
    position: 'absolute',
    top: 0,
    left: -24,
    right: -24,
    height: 407,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 153, 0, 0.3)',
  },

  topBar: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
  },
  wordmarkSlot: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: { ...type.headingL, color: colors.wordmark },

  header: { marginTop: 60, gap: spacing.sm },

  fields: { marginTop: spacing.xl, gap: 12 },

  footer: { marginTop: 40, gap: spacing.xl },

  actions: { gap: 10, alignItems: 'center', alignSelf: 'stretch' },

  note: { ...type.labelSm, color: colors.textMuted, marginTop: -4, paddingHorizontal: spacing.md },
  noteError: { color: colors.warning },

  message: {
    padding: spacing.md,
    borderRadius: 10,
    backgroundColor: colors.primaryFill,
  },
  messageError: {
    marginTop: spacing.lg,
    backgroundColor: colors.warningFill,
    borderWidth: 1,
    borderColor: colors.warningStroke,
  },
  messageErrorText: { color: colors.warning, fontFamily: type.bodyBold.fontFamily },

  link: { ...type.bodySm, lineHeight: 22, letterSpacing: -0.2, color: colors.textSecondary },
  linkAction: {
    fontFamily: type.label.fontFamily,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
});
