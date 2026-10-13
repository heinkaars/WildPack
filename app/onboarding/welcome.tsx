import { Image, ImageSourcePropType, StyleSheet, Text, useWindowDimensions, View, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { Button, ScreenStatusBar } from '../../components/ui';
import { WELCOME_BG_XML } from '../../components/onboarding/welcome-bg';
import { colors, fonts, spacing, type } from '../../lib/theme';

// Figma Onboarding 88384:3396 is drawn on a 390 × 844 frame. The artwork scales
// with the screen width and sits halfway between the header and the buttons, as
// in Figma; the swoosh behind it stretches to the full screen.
const FRAME_WIDTH = 390;

type Box = { left: number; top: number; width: number; height: number };

/**
 * The four docents as Figma places them in "Decons" (88384:3411, 524.5 × 314):
 * each image sits in a clipped box at a set position and crop. Later ones are
 * drawn on top, so the raccoon stands in front.
 */
const HERO = { left: -63, width: 524.504, height: 314 };
const CHARACTERS: {
  source: ImageSourcePropType;
  box: Box;
  /** The image inside its box, in percent of the box. */
  crop: Box;
  transform?: ViewStyle['transform'];
}[] = [
  {
    source: require('../../assets/onboarding/welcome-gecko.png'),
    box: { left: 241.77, top: 55.58, width: 274.068, height: 249.811 },
    crop: { left: 11.72, top: -21.75, width: 74.22, height: 145.77 },
    transform: [{ rotate: '3.7deg' }],
  },
  {
    source: require('../../assets/onboarding/welcome-lion.png'),
    box: { left: 57.64, top: 0, width: 385.27, height: 305.737 },
    crop: { left: -18.61, top: -2.9, width: 147.09, height: 101.22 },
  },
  {
    source: require('../../assets/onboarding/welcome-rhino.png'),
    box: { left: 0, top: 57.84, width: 277.497, height: 256.101 },
    crop: { left: -2.18, top: -8.88, width: 98.72, height: 106.97 },
    transform: [{ scaleX: -1 }],
  },
  {
    source: require('../../assets/onboarding/welcome-raccoon.png'),
    box: { left: 109.28, top: 144, width: 200.175, height: 157.206 },
    crop: { left: 22.21, top: -6.78, width: 57.36, height: 109.51 },
  },
];

const pct = (n: number) => `${n}%` as const;

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const s = width / FRAME_WIDTH;

  return (
    <View style={styles.screen}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <SvgXml
          xml={WELCOME_BG_XML}
          width={527.146 * s}
          height={height}
          style={{ position: 'absolute', top: 0, left: -38.307 * s }}
        />
      </View>
      <ScreenStatusBar />

      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeTo}>Welcome to</Text>
          <Text style={styles.wordmark}>WildPack</Text>
        </View>
        <Text style={styles.intro}>
          Build a lifelist by photographing wildlife, and learn facts and earn wins along the way.
        </Text>
      </View>

      <View style={styles.heroSlot} accessible accessibilityLabel="The four WildPack docents: a rhino, a lion, a raccoon and a gecko">
        <View style={{ height: HERO.height * s }}>
          <View
            style={{
              position: 'absolute',
              left: HERO.left * s,
              width: HERO.width * s,
              height: HERO.height * s,
            }}
          >
            {CHARACTERS.map(({ source, box, crop, transform }, i) => (
              <View
                key={i}
                style={{
                  position: 'absolute',
                  left: box.left * s,
                  top: box.top * s,
                  width: box.width * s,
                  height: box.height * s,
                  overflow: 'hidden',
                  transform,
                }}
              >
                <Image
                  source={source}
                  style={{
                    position: 'absolute',
                    left: pct(crop.left),
                    top: pct(crop.top),
                    width: pct(crop.width),
                    height: pct(crop.height),
                  }}
                />
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, spacing.screen) }]}>
        <Button label="I have an account" onPress={() => router.push('/auth/sign-in')} />
        <Button label="I’m first time here" variant="outline" onPress={() => router.push('/onboarding/look')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },

  // 57px under the status bar, as in Figma.
  header: {
    marginTop: 57,
    alignSelf: 'center',
    width: 320,
    alignItems: 'center',
    gap: 12,
  },
  welcomeTo: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 20,
    lineHeight: 30,
    letterSpacing: -0.3,
    color: colors.text,
    textAlign: 'center',
  },
  wordmark: { ...type.headingXL, color: colors.wordmark, textAlign: 'center' },
  intro: { ...type.bodyLg, textAlign: 'center' },

  heroSlot: { flex: 1, justifyContent: 'center' },

  actions: { paddingHorizontal: spacing.screen, gap: 10 },
});
