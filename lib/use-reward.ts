import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAudioPlayer } from 'expo-audio';

const CHIME = require('../assets/sounds/chime.wav');

/**
 * The "you added a species" reward: a rising haptic pattern plus a chime.
 * Deliberately does NOT set playsInSilentMode — if the phone is on silent,
 * the chime stays silent and the haptics carry the moment on their own.
 *
 * `'badge'` is the bigger moment: the taps climb one step further, to a heavy
 * one, and the chime rings twice.
 */
export function useRewardFeedback(kind: 'species' | 'badge' = 'species') {
  const player = useAudioPlayer(CHIME);
  // A second player, so the badge's echo rings over the first chime instead of cutting it off.
  const echo = useAudioPlayer(CHIME);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    const badge = kind === 'badge';

    if (Platform.OS !== 'web') {
      // Taps building into the success notification, timed to the arpeggio.
      const taps = [Haptics.ImpactFeedbackStyle.Light, Haptics.ImpactFeedbackStyle.Medium];
      if (badge) taps.push(Haptics.ImpactFeedbackStyle.Heavy);
      taps.forEach((style, i) =>
        timers.push(setTimeout(() => Haptics.impactAsync(style).catch(() => {}), i * 90)),
      );
      timers.push(
        setTimeout(
          () =>
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}),
          taps.length * 90 + 20,
        ),
      );
    }

    const chime = (p: typeof player) => {
      try {
        p.seekTo(0);
        p.play();
      } catch {
        // A missing audio route shouldn't break the celebration.
      }
    };
    chime(player);
    if (badge) timers.push(setTimeout(() => chime(echo), 420));

    return () => timers.forEach(clearTimeout);
  }, []);
}
