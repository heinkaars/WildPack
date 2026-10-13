import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Docent, docentFromLook, Gradient, PinIcon, SparkIcon } from '../../components/ui';
import { OnboardingScreen } from '../../components/onboarding/OnboardingScreen';
import { useLifelist } from '../../lib/lifelist-store';
import { colors, radii, spacing, type } from '../../lib/theme';

const LOCATION_PERKS = [
  'Show wildlife native to your region',
  'Surface sightings and hotspots nearby',
  'Earn location-based badges & challenges',
];

/** Figma Get-Start 88384:3416, with the Turn on Location pop-up 88384:3433 over it. */
export default function FirstCaptureScreen() {
  const router = useRouter();
  const { profile } = useLifelist();
  const [askLocation, setAskLocation] = useState(false);

  // The pop-up comes up only while the phone has never been asked. Once the
  // user has answered the system prompt either way, it stays away.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Loaded here rather than at the top: route files also run on the
        // server for the web build, and native modules don't belong there.
        const Location = await import('expo-location');
        const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();
        if (!cancelled && status === 'undetermined' && canAskAgain) setAskLocation(true);
      } catch {
        // No location support here (an old browser, say): carry on without asking.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleAllowLocation() {
    setAskLocation(false);
    try {
      const Location = await import('expo-location');
      await Location.requestForegroundPermissionsAsync();
    } catch {
      // A refusal or a missing module both leave the app working without location.
    }
  }

  // The lifelist has to sit under the camera: closing capture, and finishing a
  // capture, both return to it.
  function handleCapture() {
    router.replace('/');
    router.push('/capture');
  }

  return (
    <OnboardingScreen
      wordmark={false}
      footer={
        <>
          <Button label="Let’s Capture" onPress={handleCapture} />
          <Button label="I’ll Do It Later" variant="outline" onPress={() => router.replace('/')} />
        </>
      }
    >
      <View style={styles.body}>
        <Docent animal={docentFromLook(profile.look)} width={195} />
        <View style={styles.guidance}>
          <Text style={[type.headingM, styles.center]} accessibilityRole="header">
            Let&apos;s find your first species
          </Text>
          <Text style={[type.bodySm, styles.muted, styles.center]}>
            Point your camera at any bird, insect, or plant nearby. We&apos;ll identify it and add
            it to your collection.
          </Text>
        </View>
      </View>

      <Modal
        visible={askLocation}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setAskLocation(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.popup} accessibilityViewIsModal>
            <Gradient style={styles.pinCircle}>
              <PinIcon />
            </Gradient>

            <View style={styles.popupText}>
              <Text style={[type.headingM, styles.center]} accessibilityRole="header">
                Where are you located?
              </Text>
              <Text style={[type.bodySm, styles.muted, styles.center]}>
                I need this to personalise your wildlife experience. Your location is only used
                while the app is in use only for your better experience of the wildpack journey.
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
                label="Skip for Now"
                variant="outline"
                size="compact"
                onPress={() => setAskLocation(false)}
                style={styles.flex}
              />
              <Button
                label="Allow Location"
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
