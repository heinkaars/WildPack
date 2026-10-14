import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BadgeTile, Button, Popup } from '../ui';
import { Badge, BADGE_LADDER, isBadgeEarned } from '../../lib/badges';
import { colors, spacing, type } from '../../lib/theme';

/**
 * Home's "Badges" row (88384:3005): all 13, earned ones in their pastel tiles.
 * Tapping one says what it is and how much XP it takes.
 */
export function BadgeShelf({ xp }: { xp: number }) {
  const [open, setOpen] = useState<Badge | null>(null);
  const [shown, setShown] = useState(false);

  return (
    <>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {BADGE_LADDER.map((badge) => {
          const earned = isBadgeEarned(badge, xp);
          return (
            <Pressable
              key={badge.id}
              onPress={() => {
                setOpen(badge);
                setShown(true);
              }}
              accessibilityRole="button"
              accessibilityLabel={`${badge.name}, ${earned ? 'earned' : `unlocks at ${badge.xp} XP`}`}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <BadgeTile badge={badge.id} earned={earned} />
            </Pressable>
          );
        })}
      </ScrollView>

      <Popup visible={shown} onClose={() => setShown(false)} onDismissed={() => setOpen(null)}>
        {open && (
          <View style={styles.info}>
            <BadgeTile badge={open.id} earned={isBadgeEarned(open, xp)} size={72} />
            <Text style={[type.headingM, styles.center]}>{open.name}</Text>
            <Text style={[type.bodyLg, styles.center, styles.muted]}>
              {isBadgeEarned(open, xp)
                ? `Earned at ${open.xp} XP.`
                : `Unlocks at ${open.xp} XP — ${open.xp - xp} XP to go. Capture species, keep your streak going and ask your docent questions to earn XP.`}
            </Text>
            <Button label="Got it" onPress={() => setShown(false)} style={styles.button} />
          </View>
        )}
      </Popup>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 4,
    paddingHorizontal: spacing.screen,
  },
  pressed: {
    opacity: 0.7,
  },
  info: {
    alignItems: 'center',
    gap: 12,
  },
  center: {
    textAlign: 'center',
  },
  muted: {
    color: colors.textSecondary,
  },
  button: {
    alignSelf: 'stretch',
    marginTop: 8,
  },
});
