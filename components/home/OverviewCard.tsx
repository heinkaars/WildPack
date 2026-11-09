import { StyleSheet, Text, View } from 'react-native';
import { Gradient, Wash } from '../ui';
import { badgeProgress, nextBadge } from '../../lib/badges';
import { Stats } from '../../lib/xp';
import { colors, fonts, type } from '../../lib/theme';

type Props = {
  stats: Stats;
};

/**
 * Home's "Overview" (88384:2974): Explorer XP and the bar towards the next
 * badge.
 */
export function OverviewCard({ stats }: Props) {
  const next = nextBadge(stats.xp);
  const progress = badgeProgress(stats.xp);

  return (
    <Wash style={styles.card}>
      <View>
        <View style={styles.xpRow}>
          <Text style={[type.labelSm, styles.xpLabel]}>Explorer XP</Text>
          <Text style={type.bodyBold} accessibilityLiveRegion="polite">
            {stats.xp} XP
          </Text>
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
              {next.xp - stats.xp} XP more to unlock <Text style={styles.unlockName}>{next.name}</Text>
            </>
          ) : (
            'Every badge unlocked. Legendary!'
          )}
        </Text>
      </View>
    </Wash>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    gap: 8,
    borderRadius: 20,
  },
  xpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  track: {
    marginTop: 4,
    height: 12,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: colors.progressTrack,
  },
  fill: {
    height: 12,
    borderRadius: 20,
  },
  xpLabel: {
    fontSize: 16,
    lineHeight: 24,
  },
  unlock: {
    ...type.labelSm,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.body,
    paddingTop: 4,
  },
  unlockName: {
    fontFamily: fonts.bodyBold,
  },
});
