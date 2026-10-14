import { useEffect, useRef, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackButton, Button, ConfidencePill } from '../../components/ui';
import { CelebrationPopup } from '../../components/capture/CelebrationPopup';
import { OtherMatches } from '../../components/capture/OtherMatches';
import { useCaptureSession } from '../../lib/capture-session';
import { useLifelist } from '../../lib/lifelist-store';
import { currentPlace, placeWithin } from '../../lib/location';
import { SpeciesGuess } from '../../lib/types';
import { colors, spacing, type } from '../../lib/theme';
import { FAILURES, FailurePopup } from './identify';

/** Figma Captured-species 88384:3477, with "See other matches" open in 88384:3596. */
export default function ResultScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { photoUri, photoBase64, outcome, celebration, setCelebration, reset } = useCaptureSession();
  const { addSighting } = useLifelist();

  const scroll = useRef<ScrollView>(null);
  const [picked, setPicked] = useState<SpeciesGuess | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  // Set by "Add To Life List": the pop-up closes first, then the species page opens.
  const [finishing, setFinishing] = useState(false);

  // Where the photo was taken, looked up while the user reads the result so
  // Confirm rarely has to wait. Null when the profile's Location switch is off.
  const place = useRef<Promise<string | null>>(Promise.resolve(null));
  useEffect(() => {
    place.current = currentPlace();
  }, []);

  const retake = () => router.replace('/capture');

  if (!photoUri || !photoBase64 || !outcome) {
    return (
      <View style={styles.safe}>
        <FailurePopup
          failure={FAILURES.missing}
          canRetry={false}
          onRetry={retake}
          onRetake={retake}
          onClose={() => router.dismissTo('/')}
        />
      </View>
    );
  }

  const selected = picked ?? outcome.best;
  const isBest = selected.scientificName === outcome.best.scientificName;
  const others = [outcome.best, ...outcome.alternates].filter(
    (guess) => guess.scientificName !== selected.scientificName,
  );

  async function handleConfirm() {
    if (confirming) return;
    setConfirming(true);
    setSaveFailed(false);
    try {
      const location = await placeWithin(place.current);
      setCelebration(await addSighting(selected, photoBase64!, location));
    } catch {
      setSaveFailed(true);
    } finally {
      setConfirming(false);
    }
  }

  /**
   * The species page opens over the life list, so going back lands there. It
   * waits for the reward pop-up to finish closing before navigating.
   */
  function handlePopupClosed() {
    if (!celebration) return;
    const speciesId = celebration.entry.id;
    reset();
    router.dismissTo('/');
    router.push(`/species/${speciesId}`);
  }

  return (
    <View style={styles.safe}>
      <StatusBar style="dark" />
      <ScrollView ref={scroll} contentContainerStyle={styles.scroll} bounces={false}>
        <Image source={{ uri: photoUri }} style={styles.photo} />

        <View style={styles.card}>
          <View style={styles.titleRow}>
            <View style={styles.titles}>
              <Text style={type.headingM} numberOfLines={2} accessibilityRole="header">
                {selected.commonName}
              </Text>
              <Text style={[type.captionLg, styles.scientific]} numberOfLines={1}>
                {selected.scientificName}
              </Text>
            </View>
            <ConfidencePill confidence={selected.confidence} best={isBest} />
          </View>

          <Text style={[type.bodySm, styles.muted]}>{selected.description}</Text>

          <OtherMatches
            others={others}
            picked={isBest ? null : selected}
            onPick={setPicked}
            onOpen={() => scroll.current?.scrollToEnd()}
          />
        </View>
      </ScrollView>

      <BackButton onPress={retake} style={[styles.back, { top: insets.top + 12 }]} />

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.screen) }]}>
        {saveFailed && (
          <Text style={[type.bodySm, styles.error]}>
            That didn&apos;t save. Your photo is still here, so try again.
          </Text>
        )}
        <Button label="Confirm" onPress={handleConfirm} loading={confirming} />
        <Button label="Not Quite, Try Again" variant="outline" onPress={retake} />
      </View>

      {celebration && (
        <CelebrationPopup
          payload={celebration}
          visible={!finishing}
          onContinue={() => setFinishing(true)}
          onDismissed={handlePopupClosed}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  muted: { color: colors.textMuted },
  scroll: { paddingBottom: spacing.lg },

  // Figma: a 375pt photo, rounded 30, running up under the status bar.
  photo: { width: '100%', height: 375, borderRadius: 30, backgroundColor: colors.fill },
  back: { position: 'absolute', left: spacing.screen },

  card: { paddingHorizontal: spacing.screen, paddingTop: 20, gap: 20 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
  titles: { flex: 1 },
  scientific: { color: 'rgba(255, 153, 0, 0.9)' },

  footer: { paddingHorizontal: spacing.screen, paddingTop: spacing.sm, gap: 12 },
  error: { color: colors.warning, textAlign: 'center' },
});
