import { StyleSheet, Text, View } from 'react-native';
import { Button, Popup, StarIcon } from '../ui';
import { XP_STREAK_DAYS_COUNTED } from '../../lib/xp';
import { colors, type } from '../../lib/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
  streak: number;
  /** Whether today already counts: a capture or a finished daily quiz. */
  activeToday: boolean;
};

/**
 * What the streak pill on Home means. Opens from a tap on the pill, in the
 * same pop-up card as the badge explanations.
 */
export function StreakPopup({ visible, onClose, streak, activeToday }: Props) {
  const title = streak > 0 ? `${streak}-day streak` : 'No streak yet';
  const status =
    streak === 0
      ? 'Capture an animal or finish the daily quiz today to start one.'
      : activeToday
        ? 'Today counts. Come back tomorrow to keep it going.'
        : 'Capture an animal or finish the daily quiz today to keep it going.';

  return (
    <Popup visible={visible} onClose={onClose}>
      <View style={styles.info}>
        <StarIcon size={56} />
        <Text style={[type.headingM, styles.center]}>{title}</Text>
        <Text style={[type.bodyLg, styles.center]}>{status}</Text>
        <Text style={[type.bodyLg, styles.center, styles.muted]}>
          Your streak counts the days in a row you've captured an animal or finished the daily quiz. Miss a full day and
          it starts over. Each streak day earns bonus XP, and the bonus grows every day up to day{' '}
          {XP_STREAK_DAYS_COUNTED}.
        </Text>
        <Button label="Got it" onPress={onClose} style={styles.button} />
      </View>
    </Popup>
  );
}

const styles = StyleSheet.create({
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
