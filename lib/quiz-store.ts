import { useCallback, useEffect, useState } from 'react';
import * as db from './db';
import { Badge, badgeUnlocked } from './badges';
import { useAuth } from './auth';
import { useLifelist } from './lifelist-store';
import { pickQuizSpecies, QuizQuestion, scoreQuiz } from './quiz';
import { fetchQuizQuestions } from './quiz-service';
import { sync } from './sync';
import { computeStats, localDateKey, quizXp } from './xp';

export type QuizReward = {
  score: number;
  xpEarned: number;
  xpTotal: number;
  /** The badge this quiz unlocked, if it crossed one. */
  badge: Badge | null;
};

export type DailyQuizState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  /** Nothing on the life list to ask about yet. */
  | { status: 'empty' }
  /** Finished earlier today, here or on another phone. */
  | { status: 'done'; score: number }
  | { status: 'ready'; questions: QuizQuestion[]; answers: number[]; reward: QuizReward | null };

const AVOID_QUESTIONS = 15;

/**
 * Today's quiz. The questions are written once and kept on this phone along with
 * each answer as it is given, so leaving halfway picks up where it stopped and
 * reopening cannot draw a fresh set to try again.
 */
export function useDailyQuiz() {
  const { userId } = useAuth();
  const { refresh } = useLifelist();
  // Fixed when the screen opens, so a quiz running past midnight still counts for the day it began.
  const [date] = useState(() => localDateKey(new Date()));
  const [state, setState] = useState<DailyQuizState>({ status: 'loading' });

  const load = useCallback(async () => {
    setState({ status: 'loading' });
    try {
      const stored = await db.readQuiz(date);
      if (stored?.score != null) {
        setState({ status: 'done', score: stored.score });
        return;
      }
      if (stored?.questions) {
        setState({ status: 'ready', questions: stored.questions, answers: stored.answers, reward: null });
        return;
      }

      const [entries, recent] = await Promise.all([db.readLifelist(), db.readRecentQuizQuestions()]);
      const species = pickQuizSpecies(entries, recent.map((question) => question.speciesSlug));
      if (species.length === 0) {
        setState({ status: 'empty' });
        return;
      }

      const slugs = new Set(species.map((entry) => entry.id));
      const avoid = recent
        .filter((question) => slugs.has(question.speciesSlug))
        .slice(0, AVOID_QUESTIONS)
        .map((question) => question.question);

      const questions = await fetchQuizQuestions(species, avoid);
      await db.saveQuizQuestions(date, questions);
      setState({ status: 'ready', questions, answers: [], reward: null });
    } catch (error) {
      setState({
        status: 'error',
        message: error instanceof Error ? error.message : 'Could not write today’s quiz. Try again in a moment.',
      });
    }
  }, [date]);

  useEffect(() => {
    load();
  }, [load]);

  const answer = useCallback(
    async (choice: number) => {
      if (state.status !== 'ready' || state.answers.length >= state.questions.length) return;
      const { questions } = state;
      const answers = [...state.answers, choice];
      setState({ ...state, answers });

      if (answers.length < questions.length) {
        await db.saveQuizAnswers(date, answers);
        return;
      }

      // Counted the moment the last answer is in, so leaving before the
      // results pop-up cannot lose the XP.
      const score = scoreQuiz(questions, answers);
      const completedAt = new Date().toISOString();
      const xpBefore = computeStats(await db.readActivity()).xp;

      await db.saveQuizResult({ date, score, completedAt, answers });
      await db.enqueue('quiz.insert', { date, score, completedAt });
      await refresh();
      if (userId) sync(userId);

      const earned = quizXp(score);
      const xpTotal = xpBefore + earned;
      setState({
        status: 'ready',
        questions,
        answers,
        reward: { score, xpEarned: earned, xpTotal, badge: badgeUnlocked(xpBefore, xpTotal) },
      });
    },
    [state, date, refresh, userId],
  );

  return { state, retry: load, answer };
}
