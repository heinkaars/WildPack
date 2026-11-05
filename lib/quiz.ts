import { LifelistEntry } from './types';

/** How many questions one daily quiz has. */
export const QUIZ_QUESTIONS = 3;

export type QuizQuestion = {
  speciesSlug: string;
  speciesName: string;
  question: string;
  /** Four answers, already shuffled. */
  options: string[];
  correctIndex: number;
  /** One sentence shown once the question is answered. */
  explanation: string;
};

function shuffled<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * The species for today's questions, one per question: those never quizzed
 * first, then the ones quizzed longest ago. A life list shorter than the quiz
 * goes round again, so a single species still makes a full quiz.
 *
 * `recentSlugs` is most recent first.
 */
export function pickQuizSpecies(entries: LifelistEntry[], recentSlugs: string[]): LifelistEntry[] {
  if (entries.length === 0) return [];

  const lastQuizzed = (entry: LifelistEntry) => {
    const index = recentSlugs.indexOf(entry.id);
    return index === -1 ? Infinity : index;
  };
  // Shuffled first, so species that tie come up in a different order each day.
  const order = shuffled(entries).sort((a, b) => lastQuizzed(b) - lastQuizzed(a));

  return Array.from({ length: QUIZ_QUESTIONS }, (_, i) => order[i % order.length]);
}

export function scoreQuiz(questions: QuizQuestion[], answers: number[]): number {
  return questions.filter((question, i) => answers[i] === question.correctIndex).length;
}
