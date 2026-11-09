/**
 * Explorer XP. Figma shows the numbers ("+70 XP", "500 XP") but defines no
 * rule, so this is ours. XP comes from five things:
 *
 * - a species new to the life list: 50
 * - seeing a species again: 10
 * - every streak day (a day with a capture or a finished daily quiz): 20, plus
 *   10 for every day of the streak before it, up to 60 — so keeping a streak
 *   going pays more each day. Whichever comes first that day earns it.
 * - asking a question in a species chat: 5, for the first 3 per species
 * - finishing the daily quiz: 20, plus 10 for each right answer
 *
 * A first capture is therefore 50 + 20 = 70, as drawn.
 *
 * Everything follows from the user's own records (sightings, chat questions and
 * quiz scores), so the total can be recomputed at any time without storing XP.
 */
export const XP_NEW_SPECIES = 50;
export const XP_REPEAT_SIGHTING = 10;
export const XP_DAY_BASE = 10;
export const XP_PER_STREAK_DAY = 10;
export const XP_STREAK_DAYS_COUNTED = 5;
export const XP_QUESTION = 5;
export const XP_QUESTIONS_PER_SPECIES = 3;
export const XP_QUIZ_DONE = 20;
export const XP_QUIZ_CORRECT = 10;

/** What one finished daily quiz is worth. */
export function quizXp(score: number): number {
  return XP_QUIZ_DONE + XP_QUIZ_CORRECT * score;
}

/** What the XP total is computed from. */
export type Activity = {
  /** Every sighting, oldest first. */
  sightings: { speciesSlug: string; seenAt: string }[];
  /** Questions the user asked in each species chat. */
  questionsBySpecies: Record<string, number>;
  /** Finished daily quizzes: the local date and how many answers were right. */
  quizzes: { date: string; score: number }[];
};

export type Stats = {
  xp: number;
  /** Number of sightings, repeats included ("Capture 13"). */
  captures: number;
  /** Consecutive streak days, ending today or yesterday; 0 once broken. */
  streak: number;
  /** Local dates (YYYY-MM-DD) with a capture or a finished daily quiz: the streak days. */
  activeDays: Set<string>;
  /** Right answers on each local date (YYYY-MM-DD) with a finished quiz. */
  quizScores: Record<string, number>;
};

/** A local calendar date, so "today" means the user's today, not UTC's. */
export function localDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function previousDay(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  return localDateKey(new Date(y, m - 1, d - 1));
}

export function computeStats(activity: Activity, now: Date = new Date()): Stats {
  let xp = 0;
  const seen = new Set<string>();
  const activeDays = new Set<string>();

  for (const sighting of activity.sightings) {
    xp += seen.has(sighting.speciesSlug) ? XP_REPEAT_SIGHTING : XP_NEW_SPECIES;
    seen.add(sighting.speciesSlug);
    activeDays.add(localDateKey(new Date(sighting.seenAt)));
  }

  for (const count of Object.values(activity.questionsBySpecies)) {
    xp += Math.min(count, XP_QUESTIONS_PER_SPECIES) * XP_QUESTION;
  }

  const quizScores: Record<string, number> = {};
  for (const quiz of activity.quizzes) {
    xp += quizXp(quiz.score);
    quizScores[quiz.date] = quiz.score;
    activeDays.add(quiz.date);
  }

  // Streak length on each streak day, built up in date order (date keys sort
  // as dates). Each day pays its bonus once, however it was reached.
  const runOn = new Map<string, number>();
  for (const day of [...activeDays].sort()) {
    const run = (runOn.get(previousDay(day)) ?? 0) + 1;
    runOn.set(day, run);
    xp += dayXp(run);
  }

  const today = localDateKey(now);
  const yesterday = previousDay(today);
  const streak = runOn.get(today) ?? runOn.get(yesterday) ?? 0;

  return { xp, captures: activity.sightings.length, streak, activeDays, quizScores };
}

/** The bonus for a day that is day `run` of a streak. */
function dayXp(run: number): number {
  return XP_DAY_BASE + XP_PER_STREAK_DAY * Math.min(run, XP_STREAK_DAYS_COUNTED);
}
