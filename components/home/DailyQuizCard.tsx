import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BoltIcon, CheckCircleIcon, ChevronRight, Gradient } from '../ui';
import { QUIZ_QUESTIONS } from '../../lib/quiz';
import { quizXp } from '../../lib/xp';
import { colors, radii, type } from '../../lib/theme';

type Props = {
  /** Right answers in today's finished quiz; undefined until it is finished. */
  score: number | undefined;
  onOpen: () => void;
  /** Development only: throws away today's result and starts a new quiz. */
  onReplay?: () => void;
};

/** Home's way into today's quiz, and its result once it is done. */
export function DailyQuizCard({ score, onOpen, onReplay }: Props) {
  if (score !== undefined) {
    return (
      <View style={styles.card} accessible={!onReplay}>
        <View style={styles.icon}>
          <Gradient style={styles.check}>
            <CheckCircleIcon size={15} />
          </Gradient>
        </View>
        <View style={styles.text}>
          <Text style={[type.levelSemiBold, styles.title]}>
            Quiz done: {score} of {QUIZ_QUESTIONS} right
          </Text>
          <Text style={[type.labelSm, styles.subtitle, styles.muted]}>+{quizXp(score)} XP earned. New quiz tomorrow.</Text>
        </View>
        {onReplay && (
          <Pressable
            onPress={onReplay}
            hitSlop={8}
            accessibilityRole="button"
            style={({ pressed }) => [styles.replay, pressed && styles.pressed]}
          >
            <Text style={type.labelSm}>Replay (test)</Text>
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onOpen}
      accessibilityRole="button"
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.icon}>
        <BoltIcon />
      </View>
      <View style={styles.text}>
        <Text style={[type.levelSemiBold, styles.title]}>Daily quiz</Text>
        <Text style={[type.labelSm, styles.subtitle, styles.muted]}>
          Test your Pack, earn up to {quizXp(QUIZ_QUESTIONS)} XP
        </Text>
      </View>
      <ChevronRight size={16} color={colors.chevron} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: colors.primaryFill,
  },
  icon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // The same badge as a selected docent card.
  check: {
    width: 28,
    height: 28,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  muted: {
    color: colors.textMuted,
  },
  replay: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.strokeStrong,
  },
  pressed: {
    opacity: 0.8,
  },
});
