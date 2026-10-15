import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackButton, ScreenStatusBar } from '../ui';
import { absoluteFill, colors, spacing, type } from '../../lib/theme';

/**
 * The frame the onboarding screens after Welcome share (Figma 88384:3880 – 3433):
 * a round back button with the wordmark centred beside it, the screen's content,
 * and its buttons held at the bottom, above the keyboard when one is open.
 */
export function OnboardingScreen({
  wash = true,
  wordmark = true,
  children,
  footer,
}: {
  /** The warm "BG" wash. The name screen is plain white. */
  wash?: boolean;
  wordmark?: boolean;
  children: ReactNode;
  footer: ReactNode;
}) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      {wash && <OnboardingBackground />}
      <ScreenStatusBar />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.topBar}>
          {router.canGoBack() && <BackButton onPress={() => router.back()} />}
          {wordmark && (
            <View style={styles.wordmarkSlot} pointerEvents="none">
              <Text style={styles.wordmark}>WildPack</Text>
            </View>
          )}
        </View>

        <View style={styles.flex}>{children}</View>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.screen) }]}>
          {footer}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

/**
 * Figma "BG" on the onboarding screens: an orange wash with lime creeping in
 * from the lower left, fading to white from about halfway down. The CSS angles
 * (254.3° and 216.4° on a 392 × 844 box) are turned into start/end points.
 */
export function OnboardingBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={styles.wash}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.61)']}
          locations={[0.415, 0.979]}
          start={{ x: 1.243, y: 0.403 }}
          end={{ x: -0.243, y: 0.597 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={['rgba(174, 255, 0, 0)', 'rgba(174, 255, 0, 0.245)']}
          locations={[0.36, 1]}
          start={{ x: 1.19, y: 0.065 }}
          end={{ x: -0.19, y: 0.935 }}
          style={StyleSheet.absoluteFill}
        />
      </View>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.96)', colors.background]}
        locations={[0.476, 0.744, 0.84]}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },

  wash: {
    ...absoluteFill,
    backgroundColor: 'rgba(255, 153, 0, 0.3)',
  },

  topBar: {
    height: 44,
    marginTop: 12,
    marginHorizontal: spacing.screen,
    flexDirection: 'row',
    alignItems: 'center',
  },
  wordmarkSlot: {
    ...absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: { ...type.headingL, color: colors.wordmark },

  footer: { paddingHorizontal: spacing.screen, paddingTop: spacing.sm, gap: 12 },
});
