/**
 * Explorer XP. Figma shows the numbers ("+70 XP", "500 XP") but defines no
 * rule, so this is ours. XP comes from four things:
 *
 * - a species new to the life list: 50
 * - seeing a species again: 10
 * - the first capture of each day: 20, plus 10 for every day of the streak
 *   before it, up to 60 — so keeping a streak going pays more each day
 * - asking a question in a species chat: 5, for the first 3 per species
 *
 * A first capture is therefore 50 + 20 = 70, as drawn.
 *
 * Everything follows from the life list itself (sightings and chat questions),
 * so the total can be recomputed at any time without storing XP anywhere.
 */
export const XP_NEW_SPECIES = 50;
export const XP_REPEAT_SIGHTING = 10;
export const XP_DAY_BASE = 10;
export const XP_PER_STREAK_DAY = 10;
export const XP_STREAK_DAYS_COUNTED = 5;
export const XP_QUESTION = 5;
export const XP_QUESTIONS_PER_SPECIES = 3;

/** What the XP total is computed from. */
export type Activity = {
  /** Every sighting, oldest first. */
  sightings: { speciesSlug: string; seenAt: string }[];
  /** Questions the user asked in each species chat. */
  questionsBySpecies: Record<string, number>;
};

export type Stats = {
  xp: number;
  /** Number of sightings, repeats included ("Capture 13"). */
  captures: number;
  /** Consecutive days with a capture, ending today or yesterday; 0 once broken. */
  streak: number;
  /** Local dates (YYYY-MM-DD) with at least one capture. */
  activeDays: Set<string>;
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
  // Streak length on each active day, built up in date order.
  const runOn = new Map<string, number>();

  for (const sighting of activity.sightings) {
    xp += seen.has(sighting.speciesSlug) ? XP_REPEAT_SIGHTING : XP_NEW_SPECIES;
    seen.add(sighting.speciesSlug);

    const day = localDateKey(new Date(sighting.seenAt));
    if (!activeDays.has(day)) {
      activeDays.add(day);
      const run = (runOn.get(previousDay(day)) ?? 0) + 1;
      runOn.set(day, run);
      xp += dayXp(run);
    }
  }

  for (const count of Object.values(activity.questionsBySpecies)) {
    xp += Math.min(count, XP_QUESTIONS_PER_SPECIES) * XP_QUESTION;
  }

  const today = localDateKey(now);
  const yesterday = previousDay(today);
  const streak = runOn.get(today) ?? runOn.get(yesterday) ?? 0;

  return { xp, captures: activity.sightings.length, streak, activeDays };
}

/** The bonus for the first capture on a day that is day `run` of a streak. */
function dayXp(run: number): number {
  return XP_DAY_BASE + XP_PER_STREAK_DAY * Math.min(run, XP_STREAK_DAYS_COUNTED);
}
