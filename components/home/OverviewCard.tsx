import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Gradient, Wash } from '../ui';
import { badgeProgress, nextBadge } from '../../lib/badges';
import { localDateKey, Stats } from '../../lib/xp';
import { colors, fonts, gradient, type } from '../../lib/theme';

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/** This week's dates, Monday first, as local date keys. */
function thisWeek(now: Date): string[] {
  const mondayOffset = (now.getDay() + 6) % 7;
  return DAY_LETTERS.map((_, i) =>
    localDateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - mondayOffset + i)),
  );
}

type Props = {
  stats: Stats;
  now?: Date;
};

/**
 * Home's "Overview" (88384:2974): this week's capture days, Explorer XP and
 * the bar towards the next badge.
 */
export function OverviewCard({ stats, now = new Date() }: Props) {
  const week = thisWeek(now);
  const next = nextBadge(stats.xp);
  const progress = badgeProgress(stats.xp);

  return (
    <Wash style={styles.card}>
      <View style={styles.week}>
        {week.map((day, i) => {
          const active = stats.activeDays.has(day);
          const label = `${DAY_NAMES[i]}, ${active ? 'captured' : 'no capture'}`;
          return active ? (
            <LinearGradient
              key={day}
              colors={gradient.colors}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.day}
              accessible
              accessibilityLabel={label}
            >
              <Text style={[type.labelSm, styles.dayActiveText]}>{DAY_LETTERS[i]}</Text>
            </LinearGradient>
          ) : (
            <View key={day} style={[styles.day, styles.dayIdle]} accessible accessibilityLabel={label}>
              <Text style={type.labelSm}>{DAY_LETTERS[i]}</Text>
            </View>
          );
        })}
      </View>

      <View>
        <View style={styles.xpRow}>
          <Text style={type.labelSm}>Explorer XP</Text>
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
  week: {
    flexDirection: 'row',
    gap: 2,
  },
  day: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayIdle: {
    backgroundColor: colors.dayPill,
  },
  dayActiveText: {
    color: colors.textOnPrimary,
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
  unlock: {
    ...type.labelSm,
    fontFamily: fonts.body,
    paddingTop: 4,
  },
  unlockName: {
    fontFamily: fonts.bodyBold,
  },
});
