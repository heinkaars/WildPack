import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Button, Docent, docentFromLook, Popup, PopupButtons } from '../../components/ui';
import { useCaptureSession } from '../../lib/capture-session';
import { useLifelist } from '../../lib/lifelist-store';
import {
  IdentifyError,
  IdentifyErrorKind,
  LOW_CONFIDENCE_THRESHOLD,
  identifySpecies,
} from '../../lib/identify-service';
import { colors, fonts, type } from '../../lib/theme';

export type Failure = { title: string; body: string };

// 'unsure' is a successful call whose best guess is too weak to show — the
// case Figma draws. 'missing' means we arrived with no photo at all, which
// would otherwise spin forever just like a dead network.
type FailureKind = IdentifyErrorKind | 'unsure' | 'missing' | 'unknown';

export const FAILURES: Record<FailureKind, Failure> = {
  unsure: {
    title: 'Something went wrong',
    body: 'I have trouble identifying this. Nature can be sneaky sometimes.',
  },
  offline: {
    title: 'No connection',
    body: "I couldn't reach the internet. Check your signal — your photo is safe and ready to try again.",
  },
  timeout: {
    title: 'This is taking too long',
    body: "The identification didn't come back in time. Your photo is still here, so you can try again.",
  },
  server: {
    title: 'Something went wrong',
    body: 'Something broke on our end. Your photo is still here, so you can try again.',
  },
  auth: {
    title: "I couldn't confirm your account",
    body: 'Close WildPack and open it again to refresh your session. Your photo is safe and will still be here.',
  },
  rate: {
    title: 'That is a lot of photos at once',
    body: 'Give it a minute to catch up, then try again. Your photo is safe and ready to go.',
  },
  unknown: {
    title: 'Something went wrong',
    body: 'Something unexpected happened. Your photo is still here, so you can try again.',
  },
  missing: {
    title: "That photo didn't come through",
    body: 'I lost the picture on the way here. Take another one and I will identify it.',
  },
};

type FailurePopupProps = {
  failure: Failure;
  canRetry: boolean;
  onRetry: () => void;
  onRetake: () => void;
  onClose: () => void;
};

/** Figma Capture-Camera-ON error overlay 88384:3868: the sad docent and two buttons. */
export function FailurePopup({ failure, canRetry, onRetry, onRetake, onClose }: FailurePopupProps) {
  const { profile } = useLifelist();
  return (
    <Popup visible onClose={onClose}>
      <Docent animal={docentFromLook(profile.look)} mood="sad" width={112} />
      <View style={styles.popupText}>
        <Text style={[type.headingM, styles.failureTitle]} accessibilityRole="header">
          {failure.title}
        </Text>
        <Text style={[type.bodySm, styles.failureBody]}>{failure.body}</Text>
      </View>
      <PopupButtons>
        {canRetry ? (
          <>
            <Button label="Retake photo" variant="outline" size="compact" onPress={onRetake} style={styles.flex} />
            <Button label="Try Again" size="compact" onPress={onRetry} style={styles.flex} />
          </>
        ) : (
          <Button label="Take a photo" size="compact" onPress={onRetake} style={styles.flex} />
        )}
      </PopupButtons>
    </Popup>
  );
}

/** The captured photo, dimmed, while identification runs. Not drawn in Figma (handoff gap). */
export function IdentifyingView({ photoUri, busy = true }: { photoUri: string | null; busy?: boolean }) {
  return (
    <View style={styles.safe}>
      <StatusBar style="light" />
      {photoUri && <Image source={{ uri: photoUri }} style={styles.photo} />}
      <View style={styles.dim} />
      {busy && (
        <View style={styles.center} accessibilityLiveRegion="polite">
          <ActivityIndicator size="large" color={colors.textOnPrimary} />
          <Text style={styles.text}>Identifying…</Text>
        </View>
      )}
    </View>
  );
}

export default function IdentifyScreen() {
  const router = useRouter();
  const { photoUri, photoBase64, setOutcome } = useCaptureSession();
  const [failure, setFailure] = useState<Failure | null>(null);
  // Counts identification attempts. Bumping it re-runs the effect, which is
  // what "Try Again" does.
  const [attempt, setAttempt] = useState(0);
  // Which attempt has already been fired off. Without this, React's
  // development double-mount would send the photo to OpenAI twice.
  const started = useRef(-1);

  useEffect(() => {
    if (started.current === attempt) return;
    started.current = attempt;

    if (!photoBase64) {
      setFailure(FAILURES.missing);
      return;
    }

    (async () => {
      try {
        const outcome = await identifySpecies(photoBase64);
        // Below the threshold the model is effectively guessing blind (no
        // wildlife in frame, say), so it gets the "couldn't make it out" pop-up
        // rather than a result card.
        if (outcome.best.confidence < LOW_CONFIDENCE_THRESHOLD) {
          setFailure(FAILURES.unsure);
          return;
        }
        setOutcome(outcome);
        router.replace('/capture/result');
      } catch (error) {
        setFailure(error instanceof IdentifyError ? FAILURES[error.kind] : FAILURES.unknown);
      }
    })();
  }, [attempt, photoBase64]);

  function handleRetry() {
    setFailure(null);
    setAttempt((n) => n + 1);
  }

  return (
    <>
      <IdentifyingView photoUri={photoUri} busy={!failure} />
      {failure && (
        <FailurePopup
          failure={failure}
          canRetry={Boolean(photoBase64)}
          onRetry={handleRetry}
          onRetake={() => router.replace('/capture')}
          onClose={() => router.dismissTo('/')}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: '#000' },
  photo: { ...StyleSheet.absoluteFillObject },
  dim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.55)' },
  center: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', gap: 16 },
  text: { fontFamily: fonts.bodyBold, fontSize: 18, lineHeight: 27, letterSpacing: -0.3, color: colors.textOnPrimary },

  popupText: { alignSelf: 'stretch', gap: 8 },
  failureTitle: { color: colors.warning, textAlign: 'center' },
  failureBody: { color: colors.textMuted, textAlign: 'center' },
});
