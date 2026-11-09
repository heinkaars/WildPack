import { StyleSheet, Text, View } from 'react-native';
import { Button, Popup, StarIcon } from '../ui';
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
      ? 'Start one today!'
      : activeToday
        ? 'Come back tomorrow to keep it going!'
        : 'Capture or quiz today to keep it going!';

  return (
    <Popup visible={visible} onClose={onClose}>
      <View style={styles.info}>
        <StarIcon size={56} />
        <Text style={[type.headingM, styles.center]}>{title}</Text>
        <Text style={[type.bodyLg, styles.center]}>{status}</Text>
        <Text style={[type.bodyLg, styles.center, styles.muted]}>
          Capture an animal or finish the quiz each day. Miss a day and it starts over. Longer streaks earn more XP!
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
