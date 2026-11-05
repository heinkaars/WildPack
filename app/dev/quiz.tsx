import { useState } from 'react';
import { Asset } from 'expo-asset';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { QuizMessage, QuizView } from '../../components/quiz/QuizView';
import { QuizQuestion, scoreQuiz } from '../../lib/quiz';
import type { QuizReward } from '../../lib/quiz-store';
import { badgeUnlocked } from '../../lib/badges';
import { quizXp } from '../../lib/xp';

const RACCOON = Asset.fromModule(require('../../assets/dev/raccoon.jpg')).uri;
const SQUIRREL = Asset.fromModule(require('../../assets/lifelist/squirrel.jpg')).uri;

const QUESTIONS: QuizQuestion[] = [
  {
    speciesSlug: 'procyon-lotor',
    speciesName: 'Raccoon',
    question: 'What does a raccoon rely on most to find food in the dark?',
    options: ['Its sensitive front paws', 'Echolocation', 'A forked tongue', 'Heat-sensing pits'],
    correctIndex: 0,
    explanation: 'A raccoon’s front paws are packed with touch receptors, so it can identify food by feel.',
  },
  {
    speciesSlug: 'sciurus-vulgaris',
    speciesName: 'Red Squirrel',
    question: 'How does a red squirrel get through winter?',
    options: ['It hibernates for months', 'It flies south', 'It stays active and eats stored food', 'It sleeps underwater'],
    correctIndex: 2,
    explanation: 'Red squirrels do not hibernate; they stay active and rely on food they stored in autumn.',
  },
  {
    speciesSlug: 'procyon-lotor',
    speciesName: 'Raccoon',
    question: 'What best describes a raccoon’s diet?',
    options: ['Only meat', 'Only leaves', 'Only fish', 'Almost anything: it is an omnivore'],
    correctIndex: 3,
    explanation: 'Raccoons are omnivores that eat fruit, nuts, insects, eggs and small animals.',
  },
];

const PHOTOS: Record<string, string> = { 'procyon-lotor': RACCOON, 'sciurus-vulgaris': SQUIRREL };

type Screen = 'quiz' | 'badge' | 'loading' | 'error' | 'done' | 'empty';

/**
 * The quiz with sample questions, reachable without a server. Answers stay in
 * this screen and earn nothing. Dev builds only.
 * `/dev/quiz?screen=quiz|badge|loading|error|done|empty` (default quiz).
 * `badge` makes the last answer unlock a badge.
 */
export default function QuizPreview() {
  const { screen = 'quiz' } = useLocalSearchParams<{ screen?: Screen }>();
  const router = useRouter();
  const [answers, setAnswers] = useState<number[]>([]);

  if (!__DEV__) return <Redirect href="/" />;

  const close = () => router.replace('/dev/home');
  const docent = 'lion';

  if (screen === 'loading') return <QuizMessage docent={docent} title="Looking through your Pack…" busy onClose={close} />;
  if (screen === 'error') {
    return (
      <QuizMessage
        docent={docent}
        mood="sad"
        title="No quiz just yet"
        body="Could not write today’s quiz right now. Try again in a moment."
        onRetry={() => {}}
        onClose={close}
      />
    );
  }
  if (screen === 'done') {
    return <QuizMessage docent={docent} title="Quiz done for today" body="2 of 3 right first try, +40 XP. New quiz tomorrow." onClose={close} />;
  }
  if (screen === 'empty') {
    return <QuizMessage docent={docent} title="Nothing to ask yet" body="Capture your first animal and its quiz questions will follow." onClose={close} />;
  }

  let reward: QuizReward | null = null;
  if (answers.length === QUESTIONS.length) {
    const score = scoreQuiz(QUESTIONS, answers);
    const xpEarned = quizXp(score);
    const xpBefore = screen === 'badge' ? 149 : 400;
    reward = { score, xpEarned, xpTotal: xpBefore + xpEarned, badge: badgeUnlocked(xpBefore, xpBefore + xpEarned) };
  }

  return (
    <QuizView
      questions={QUESTIONS}
      answers={answers}
      reward={reward}
      docent={docent}
      photoFor={(slug) => PHOTOS[slug]}
      onAnswer={(choice) => setAnswers((prev) => [...prev, choice])}
      onClose={close}
    />
  );
}
