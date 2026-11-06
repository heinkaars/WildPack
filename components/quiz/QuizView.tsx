import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BackButton,
  BoltIcon,
  Button,
  CheckCircleIcon,
  CloseIcon,
  Docent,
  Popup,
  ScreenStatusBar,
  StarIcon,
  Wash,
} from '../ui';
import type { DocentAnimal } from '../ui';
import { BadgePopup } from '../capture/BadgePopup';
import { ConfettiBurst } from '../capture/ConfettiBurst';
import { QuizQuestion } from '../../lib/quiz';
import type { QuizReward } from '../../lib/quiz-store';
import { useRewardFeedback } from '../../lib/use-reward';
import { colors, radii, sizes, spacing, type } from '../../lib/theme';

type Props = {
  questions: QuizQuestion[];
  /** The first tap on each question reached so far. Only this one scores. */
  answers: number[];
  /** Null until the last answer has been saved. */
  reward: QuizReward | null;
  docent: DocentAnimal;
  /** The species' photo on the life list, if it has one on this phone. */
  photoFor: (speciesSlug: string) => string | undefined;
  onAnswer: (choice: number) => void;
  onClose: () => void;
};

type Stage = 'questions' | 'result' | 'result-closing' | 'badge' | 'badge-closing';

const CONTENT_TOP = 16;
const CONTENT_BOTTOM = spacing.lg;
const CONTENT_GAP = 16;
const PHOTO_HEIGHT = 180;
/** Below this a photo is no use, so it steps aside altogether. */
const PHOTO_MIN_HEIGHT = 72;

/** The daily quiz, one question at a time. Ours: Figma has no quiz yet. Takes props so `/dev/quiz` can show it. */
export function QuizView({ questions, answers, reward, docent, photoFor, onAnswer, onClose }: Props) {
  const insets = useSafeAreaInsets();
  // Reopening a part-finished quiz starts at the first question not yet answered.
  const [index, setIndex] = useState(() => Math.min(answers.length, questions.length - 1));
  const [stage, setStage] = useState<Stage>('questions');
  // Taps after the first, while hunting for the right answer. They earn nothing,
  // so they stay here and are forgotten on the next question.
  const [retries, setRetries] = useState<number[]>([]);

  const question = questions[index];
  const chosen: number | undefined = answers[index];
  const tapped = chosen === undefined ? [] : [chosen, ...retries];
  const solved = tapped.includes(question.correctIndex);
  const last = index === questions.length - 1;
  const photo = photoFor(question.speciesSlug);

  const tap = (option: number) => {
    if (chosen === undefined) onAnswer(option);
    else setRetries([...retries, option]);
  };
  const next = () => {
    if (last) {
      setStage('result');
    } else {
      setIndex(index + 1);
      setRetries([]);
    }
  };

  // The photo takes the room left over, up to its full height, so the screen
  // fits the phone without scrolling.
  const [viewportHeight, setViewportHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [belowHeight, setBelowHeight] = useState(0);
  const room = viewportHeight - CONTENT_TOP - CONTENT_BOTTOM - headerHeight - belowHeight - CONTENT_GAP * 2;
  const photoHeight = room >= PHOTO_MIN_HEIGHT ? Math.min(room, PHOTO_HEIGHT) : 0;
  const measured = viewportHeight > 0 && headerHeight > 0 && belowHeight > 0;

  const animatedPhotoHeight = useRef(new Animated.Value(0)).current;
  const photoPlaced = useRef(false);
  useEffect(() => {
    if (!measured) return;
    if (!photoPlaced.current) {
      photoPlaced.current = true;
      animatedPhotoHeight.setValue(photoHeight);
      return;
    }
    Animated.timing(animatedPhotoHeight, { toValue: photoHeight, duration: 200, useNativeDriver: false }).start();
  }, [measured, photoHeight, animatedPhotoHeight]);

  return (
    <View style={styles.screen}>
      <ScreenStatusBar backgroundColor={colors.background} />

      {/* Scrolls only as a last resort, for very large system text. */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}
        onLayout={(event) => setViewportHeight(event.nativeEvent.layout.height)}
      >
        <View style={styles.header} onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}>
          <BackButton onPress={onClose} />
          <View style={styles.progress}>
            <Text style={[type.labelSm, styles.progressText]} accessibilityLiveRegion="polite">
              Question {index + 1} of {questions.length}
            </Text>
            <View style={styles.segments}>
              {questions.map((item, i) => (
                <View key={i} style={[styles.segment, i <= index && styles.segmentOn]} />
              ))}
            </View>
          </View>
        </View>

        {photo ? (
          <Animated.View
            style={[styles.photo, { height: animatedPhotoHeight, marginBottom: photoHeight === 0 ? -CONTENT_GAP : 0 }]}
          >
            <Image source={{ uri: photo }} style={styles.photoImage} accessibilityIgnoresInvertColors />
          </Animated.View>
        ) : null}

        <View style={styles.below} onLayout={(event) => setBelowHeight(event.nativeEvent.layout.height)}>
          <View style={styles.prompt}>
            <Text style={[type.labelSm, styles.species, styles.muted]}>{question.speciesName}</Text>
            <Text style={[type.button, styles.question]} accessibilityRole="header">
              {question.question}
            </Text>
          </View>

          <View style={styles.options}>
            {question.options.map((option, i) => {
              const wasTapped = tapped.includes(i);
              const isCorrect = wasTapped && i === question.correctIndex;
              const isWrongPick = wasTapped && !isCorrect;
              const locked = solved || wasTapped;
              return (
                <Pressable
                  key={option}
                  onPress={() => tap(i)}
                  disabled={locked}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: locked, selected: wasTapped }}
                  accessibilityLabel={isCorrect ? `${option}, right answer` : isWrongPick ? `${option}, wrong` : option}
                  style={({ pressed }) => [
                    styles.option,
                    isCorrect && styles.optionCorrect,
                    isWrongPick && styles.optionWrong,
                    solved && !wasTapped && styles.optionFaded,
                    pressed && styles.optionPressed,
                  ]}
                >
                  <Text style={[type.levelSemiBold, styles.optionText]}>{option}</Text>
                  {isCorrect && <CheckCircleIcon color={colors.success} size={20} />}
                  {isWrongPick && <CloseIcon color={colors.warning} size={20} strokeWidth={2} />}
                </Pressable>
              );
            })}
          </View>

          {/* Only once found: the explanation usually gives the answer away. */}
          {solved && (
            <Wash style={styles.explanation}>
              <Text style={[type.label, styles.feedback]} accessibilityLiveRegion="polite">
                {chosen === question.correctIndex ? 'That’s right!' : 'You found it!'}
              </Text>
              <Text style={[type.bodySm, styles.explanationText]}>{question.explanation}</Text>
            </Wash>
          )}
        </View>
      </ScrollView>

      {/* Always the same height, so a wrong tap moves nothing on the screen. */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.screen) }]}>
        {solved ? (
          <Button label={last ? 'See results' : 'Next question'} loading={last && !reward} onPress={next} />
        ) : tapped.length > 0 ? (
          <Wash style={styles.tryAgain}>
            <Text style={[type.label, styles.feedback]} accessibilityLiveRegion="polite">
              Not quite, try another
            </Text>
          </Wash>
        ) : (
          <View style={styles.footerSlot} />
        )}
      </View>

      {reward && stage !== 'questions' && (
        <ResultPopup
          reward={reward}
          total={questions.length}
          docent={docent}
          visible={stage === 'result'}
          onContinue={() => setStage('result-closing')}
          onDismissed={() => (reward.badge ? setStage('badge') : onClose())}
        />
      )}

      {reward?.badge && (stage === 'badge' || stage === 'badge-closing') && (
        <BadgePopup
          badge={reward.badge}
          xp={reward.xpTotal}
          visible={stage === 'badge'}
          onContinue={() => setStage('badge-closing')}
          onDismissed={onClose}
        />
      )}
    </View>
  );
}

function RewardFeedback() {
  useRewardFeedback();
  return null;
}

function resultTitle(score: number, total: number): string {
  if (score === total) return 'Perfect score!';
  return score === 0 ? 'Good try!' : 'Nice work!';
}

function ResultPopup({
  reward,
  total,
  docent,
  visible,
  onContinue,
  onDismissed,
}: {
  reward: QuizReward;
  total: number;
  docent: DocentAnimal;
  visible: boolean;
  onContinue: () => void;
  onDismissed: () => void;
}) {
  return (
    <Popup visible={visible} pop onDismissed={onDismissed}>
      <RewardFeedback />
      <View style={styles.resultHeader}>
        <View style={styles.resultDocent}>
          <Docent animal={docent} width={74} />
          {reward.score > 0 && <ConfettiBurst style={styles.confetti} />}
        </View>
        <Text style={[type.headingM, styles.center]} accessibilityRole="header">
          {resultTitle(reward.score, total)}
        </Text>
      </View>

      <Wash style={styles.resultStats}>
        <View style={styles.resultStat}>
          <StarIcon />
          <Text style={[type.bodySm, styles.resultText]}>
            {reward.score} of {total} right on the first try
          </Text>
        </View>
        <View style={styles.resultStat}>
          <BoltIcon />
          <Text style={[type.bodySm, styles.resultText]}>+{reward.xpEarned} XP earned</Text>
        </View>
      </Wash>

      <Button label="Back to life list" onPress={onContinue} style={styles.resultButton} />
    </Popup>
  );
}

/** Everything the quiz screen shows when there are no questions to answer. */
export function QuizMessage({
  docent,
  mood,
  title,
  body,
  busy,
  onRetry,
  onClose,
}: {
  docent: DocentAnimal;
  mood?: 'sad';
  title: string;
  body?: string;
  busy?: boolean;
  onRetry?: () => void;
  onClose: () => void;
}) {
  return (
    <View style={styles.screen}>
      <ScreenStatusBar backgroundColor={colors.background} />
      <BackButton onPress={onClose} style={styles.messageBack} />
      <View style={styles.message}>
        <Docent animal={docent} mood={mood} width={97} />
        <Text style={[type.headingM, styles.center]} accessibilityRole="header" accessibilityLiveRegion="polite">
          {title}
        </Text>
        {body && <Text style={[type.bodyLg, styles.messageBody, styles.center, styles.muted]}>{body}</Text>}
        {busy && <ActivityIndicator color={colors.primary} />}
        {onRetry && <Button label="Try again" onPress={onRetry} style={styles.resultButton} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.screen, paddingTop: CONTENT_TOP, paddingBottom: CONTENT_BOTTOM, gap: CONTENT_GAP },
  center: { textAlign: 'center' },
  muted: { color: colors.textMuted },

  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  progress: { flex: 1, gap: 4 },
  progressText: { fontSize: 16, lineHeight: 24 },
  segments: { flexDirection: 'row', gap: 4 },
  segment: { flex: 1, height: 6, borderRadius: radii.pill, backgroundColor: colors.fillStrong },
  segmentOn: { backgroundColor: colors.primary },

  photo: { width: '100%', borderRadius: 16, overflow: 'hidden', backgroundColor: colors.fill },
  photoImage: { width: '100%', height: '100%' },
  below: { gap: CONTENT_GAP },
  prompt: { gap: 2 },
  species: { fontSize: 16, lineHeight: 24 },
  question: { fontSize: 20, lineHeight: 28 },

  options: { gap: 8 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.fillStrong,
    backgroundColor: colors.surface,
  },
  optionText: { flex: 1, fontSize: 18, lineHeight: 26 },
  optionPressed: { backgroundColor: colors.primaryFill },
  optionCorrect: { borderColor: colors.success, backgroundColor: colors.successFill },
  optionWrong: { borderColor: colors.warningStroke, backgroundColor: colors.warningFill },
  optionFaded: { opacity: 0.5 },

  explanation: { padding: 12, gap: 2, borderRadius: 16 },
  feedback: { fontSize: 18, lineHeight: 26 },
  explanationText: { fontSize: 18, lineHeight: 26 },
  footer: { paddingHorizontal: spacing.screen, paddingTop: spacing.sm },
  footerSlot: { height: sizes.button },
  tryAgain: { height: sizes.button, alignItems: 'center', justifyContent: 'center', borderRadius: 16 },

  resultHeader: { alignItems: 'center', gap: 12 },
  resultDocent: { width: 74, height: 82, alignItems: 'center', justifyContent: 'flex-end' },
  confetti: { position: 'absolute', left: -43.2, top: -4.6 },
  resultStats: { alignSelf: 'stretch', gap: 4, padding: 8, borderRadius: 12 },
  resultStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  resultText: { fontSize: 18, lineHeight: 26 },
  resultButton: { alignSelf: 'stretch' },

  messageBody: { fontSize: 18, lineHeight: 26 },
  messageBack: { marginLeft: spacing.screen, marginTop: CONTENT_TOP, alignSelf: 'flex-start' },
  message: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, paddingHorizontal: spacing.screen, paddingBottom: 80 },
});
