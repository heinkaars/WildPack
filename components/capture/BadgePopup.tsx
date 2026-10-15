import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { BadgeTile, Button, Gradient, Popup, Wash } from '../ui';
import { Badge, badgeProgress, nextBadge } from '../../lib/badges';
import { useRewardFeedback } from '../../lib/use-reward';
import { colors, fonts, type } from '../../lib/theme';
import { ConfettiBurst } from './ConfettiBurst';

const TILE = 96;

type Props = {
  badge: Badge;
  /** Explorer XP in total, after the capture that unlocked the badge. */
  xp: number;
  /** False once "Keep Exploring" is tapped, so the pop-up closes before anything opens. */
  visible: boolean;
  onContinue: () => void;
  /** The pop-up has finished closing; safe to open the next screen. */
  onDismissed: () => void;
};

/** Plays the bigger badge haptics and double chime once, when the pop-up appears. */
function BadgeFeedback() {
  useRewardFeedback('badge');
  return null;
}

/**
 * The badge stamps down: it starts large and tilted, lands with a bounce, then
 * gives a little wiggle. Still for people who have reduced motion on.
 */
function StampedBadge({ badge }: { badge: Badge }) {
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(reduceMotion ? 1 : 0);
  const turn = useSharedValue(reduceMotion ? 0 : -25);

  useEffect(() => {
    if (reduceMotion) return;
    scale.value = withDelay(120, withSpring(1, { damping: 9, stiffness: 160, mass: 0.8 }));
    turn.value = withDelay(
      120,
      withSequence(
        withSpring(0, { damping: 10, stiffness: 160 }),
        withTiming(8, { duration: 110, easing: Easing.out(Easing.quad) }),
        withTiming(-6, { duration: 140, easing: Easing.inOut(Easing.quad) }),
        withSpring(0, { damping: 8 }),
      ),
    );
  }, [reduceMotion]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${turn.value}deg` }],
  }));

  return (
    <Animated.View style={[styles.tileShadow, style]}>
      <BadgeTile badge={badge.id} earned size={TILE} style={styles.tile} />
    </Animated.View>
  );
}

/**
 * Shown after the species pop-up when a capture crossed a badge's XP: the new
 * badge stamps down in confetti, then the way to the next one.
 */
export function BadgePopup({ badge, xp, visible, onContinue, onDismissed }: Props) {
  const next = nextBadge(xp);
  const progress = badgeProgress(xp);

  return (
    <Popup visible={visible} pop onDismissed={onDismissed}>
      <BadgeFeedback />

      <View style={styles.header}>
        <View style={styles.badge}>
          <ConfettiBurst style={styles.confetti} />
          <StampedBadge badge={badge} />
        </View>

        <View style={styles.titles}>
          <Text style={[type.labelSm, styles.kicker]}>NEW BADGE UNLOCKED</Text>
          <Text style={[type.headingM, styles.center]} accessibilityRole="header">
            {badge.name}
          </Text>
          <Text style={[type.bodySm, styles.center, styles.muted]}>
            You reached {badge.xp} Explorer XP. Keep it up!
          </Text>
        </View>
      </View>

      <Animated.View entering={FadeInDown.delay(450).springify().damping(15)} style={styles.stretch}>
        <Wash style={styles.next}>
          <View style={styles.xpRow}>
            <Text style={type.labelSm}>Explorer XP</Text>
            <Text style={type.bodyBold}>{xp} XP</Text>
          </View>
          <View
            style={styles.track}
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }}
          >
            <Gradient style={[styles.fill, { width: `${Math.max(progress, 0.04) * 100}%` }]} />
          </View>
          <Text style={styles.unlock}>
            {next ? (
              <>
                {next.xp - xp} XP more to unlock <Text style={styles.unlockName}>{next.name}</Text>
              </>
            ) : (
              'Every badge unlocked. Legendary!'
            )}
          </Text>
        </Wash>
      </Animated.View>

      <Button label="Keep Exploring" onPress={onContinue} style={styles.stretch} />
    </Popup>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: 'center' },
  muted: { color: colors.textMuted },
  stretch: { alignSelf: 'stretch' },

  header: { alignItems: 'center', gap: 16 },
  badge: { width: TILE, height: TILE, alignItems: 'center', justifyContent: 'center' },
  // The confetti is drawn on Figma's 159.785 × 91.2 box; centred on the tile.
  confetti: { position: 'absolute', left: (TILE - 159.785) / 2, top: (TILE - 91.2) / 2 - 8 },
  tileShadow: {
    borderRadius: 16,
    shadowColor: colors.text,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  tile: { borderRadius: 16 },

  titles: { alignItems: 'center', gap: 4 },
  kicker: { color: colors.primary, fontFamily: fonts.bodyBold, letterSpacing: 0.6 },

  next: { padding: 12, gap: 4, borderRadius: 12 },
  xpRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  track: {
    marginTop: 4,
    height: 12,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: colors.progressTrack,
  },
  fill: { height: 12, borderRadius: 20 },
  unlock: { ...type.labelSm, fontFamily: fonts.body, paddingTop: 4 },
  unlockName: { fontFamily: fonts.bodyBold },
});
