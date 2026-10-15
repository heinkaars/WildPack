import { useEffect, useRef, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Docent, docentFromLook, Gradient, PinIcon, SparkIcon } from '../../components/ui';
import { OnboardingScreen } from '../../components/onboarding/OnboardingScreen';
import { useLifelist } from '../../lib/lifelist-store';
import { colors, radii, spacing, type } from '../../lib/theme';

const LOCATION_PERKS = [
  'Discover wildlife native to your region',
  'See sightings and hotspots nearby',
  'Earn location-based badges and challenges',
];

/**
 * True while the phone has never been asked for location — the only time the
 * pop-up should come up. Once the user has answered the system prompt either
 * way, it stays away.
 */
async function locationNeverAsked(): Promise<boolean> {
  try {
    // Loaded here rather than at the top: route files also run on the server
    // for the web build, and native modules don't belong there.
    const Location = await import('expo-location');
    const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();
    return status === 'undetermined' && canAskAgain;
  } catch {
    // No location support here (an old browser, say): carry on without asking.
    return false;
  }
}

/** Figma Get-Start 88384:3416, with the Turn on Location pop-up 88384:3433 over it. */
export default function FirstCaptureScreen() {
  const router = useRouter();
  const { profile } = useLifelist();
  const [askLocation, setAskLocation] = useState(false);
  // The check can take a moment (in development the module loads on demand),
  // so "Let's Capture" waits for it rather than slipping past the pop-up.
  const shouldAsk = useRef<Promise<boolean>>(Promise.resolve(false));
  // Set when "Let's Capture" brought the pop-up up: closing it goes on to the camera.
  const captureAfterAsking = useRef(false);

  useEffect(() => {
    let cancelled = false;
    shouldAsk.current = locationNeverAsked();
    shouldAsk.current.then((ask) => {
      if (!cancelled && ask) setAskLocation(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // The lifelist has to sit under the camera: closing capture, and finishing a
  // capture, both return to it.
  function goToCapture() {
    router.replace('/');
    router.push('/capture');
  }

  async function handleCapture() {
    if (await shouldAsk.current) {
      captureAfterAsking.current = true;
      setAskLocation(true);
      return;
    }
    goToCapture();
  }

  /** Both pop-up buttons end here: it is asked once, whatever the answer. */
  function finishAsking() {
    shouldAsk.current = Promise.resolve(false);
    setAskLocation(false);
    if (captureAfterAsking.current) goToCapture();
  }

  async function handleAllowLocation() {
    setAskLocation(false);
    try {
      const Location = await import('expo-location');
      // Waits for the user's answer, so the camera's own prompt doesn't pile on top.
      await Location.requestForegroundPermissionsAsync();
    } catch {
      // A refusal or a missing module both leave the app working without location.
    }
    finishAsking();
  }

  return (
    <OnboardingScreen
      wordmark={false}
      footer={
        <>
          <Button label="Let’s capture!" onPress={handleCapture} />
          <Button label="Maybe later" variant="outline" onPress={() => router.replace('/')} />
        </>
      }
    >
      <View style={styles.body}>
        <Docent animal={docentFromLook(profile.look)} width={195} />
        <View style={styles.guidance}>
          <Text style={[type.headingM, styles.center]} accessibilityRole="header">
            Let’s spot your first wildlife!
          </Text>
          <Text style={[type.bodySm, styles.muted, styles.center]}>
            Point your camera at any wildlife nearby. We’ll identify it and add it to your
            lifelist.
          </Text>
        </View>
      </View>

      <Modal
        visible={askLocation}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={finishAsking}
      >
        <View style={styles.overlay}>
          <View style={styles.popup} accessibilityViewIsModal>
            <Gradient style={styles.pinCircle}>
              <PinIcon />
            </Gradient>

            <View style={styles.popupText}>
              <Text style={[type.headingM, styles.center]} accessibilityRole="header">
                Where are you exploring?
              </Text>
              <Text style={[type.bodySm, styles.muted, styles.center]}>
                I use your location to personalize your WildPack adventure. It’s only used while the
                app is open, for a better experience.
              </Text>
            </View>

            <View style={styles.perks}>
              {LOCATION_PERKS.map((perk, i) => (
                <View key={perk} style={styles.perkGroup}>
                  {i > 0 && <View style={styles.divider} />}
                  <View style={styles.perk}>
                    <SparkIcon />
                    <Text style={type.captionSm}>{perk}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.popupButtons}>
              <Button
                label="Maybe later"
                variant="outline"
                size="compact"
                onPress={finishAsking}
                style={styles.flex}
              />
              <Button
                label="Share location"
                size="compact"
                onPress={handleAllowLocation}
                style={styles.flex}
              />
            </View>
          </View>
        </View>
      </Modal>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { textAlign: 'center' },
  muted: { color: colors.textMuted },

  // Figma: the portrait starts 96px under the top bar, the text 24px under it.
  body: { alignItems: 'center', paddingTop: 96, paddingHorizontal: spacing.screen, gap: 24 },
  guidance: { alignSelf: 'stretch', gap: 12 },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.screen,
  },
  popup: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: 30,
    alignItems: 'center',
    gap: 20,
  },
  pinCircle: {
    width: 124,
    height: 124,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popupText: { alignSelf: 'stretch', gap: spacing.sm },
  perks: {
    alignSelf: 'stretch',
    gap: 4,
    backgroundColor: colors.primaryFill,
    borderRadius: 16,
  },
  perkGroup: { gap: 4 },
  divider: { height: 1, backgroundColor: colors.fill },
  perk: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: 12,
    paddingVertical: spacing.sm,
  },
  popupButtons: { alignSelf: 'stretch', flexDirection: 'row', gap: 12 },
});
