import { useRouter } from 'expo-router';
import { docentFromLook } from '../components/ui';
import { QuizMessage, QuizView } from '../components/quiz/QuizView';
import { useLifelist } from '../lib/lifelist-store';
import { QUIZ_QUESTIONS } from '../lib/quiz';
import { useDailyQuiz } from '../lib/quiz-store';
import { quizXp } from '../lib/xp';

/** Today's quiz, opened from the card on Home. */
export default function QuizScreen() {
  const router = useRouter();
  const { profile, getEntry } = useLifelist();
  const { state, retry, answer } = useDailyQuiz();
  const docent = docentFromLook(profile.look);
  const close = () => router.back();

  switch (state.status) {
    case 'loading':
      return <QuizMessage docent={docent} title="Looking through your Pack…" busy onClose={close} />;
    case 'error':
      return <QuizMessage docent={docent} mood="sad" title="No quiz just yet" body={state.message} onRetry={retry} onClose={close} />;
    case 'empty':
      return <QuizMessage docent={docent} title="Nothing to ask yet" body="Capture your first animal and its quiz questions will follow." onClose={close} />;
    case 'done':
      return (
        <QuizMessage
          docent={docent}
          title="Quiz done for today"
          body={`${state.score} of ${QUIZ_QUESTIONS} right first try, +${quizXp(state.score)} XP. New quiz tomorrow.`}
          onClose={close}
        />
      );
    case 'ready':
      return (
        <QuizView
          questions={state.questions}
          answers={state.answers}
          reward={state.reward}
          docent={docent}
          photoFor={(slug) => getEntry(slug)?.photoUri || undefined}
          onAnswer={answer}
          onClose={close}
        />
      );
  }
}
