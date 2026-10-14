import type { BadgeId } from '../components/ui/BadgeTile';

export type Badge = {
  id: BadgeId;
  name: string;
  /** Explorer XP needed to unlock it. */
  xp: number;
};

/**
 * The 13 Figma badges, unlocked by Explorer XP (see `lib/xp.ts`). Only
 * "Safari Starter" is a Figma name; the rest are ours. A first capture (70 XP)
 * earns the first badge, and the steps widen as the list grows.
 */
export const BADGE_LADDER: Badge[] = [
  { id: 1, name: 'First Tracks', xp: 50 },
  { id: 2, name: 'Trail Finder', xp: 150 },
  { id: 3, name: 'Keen Eye', xp: 300 },
  { id: 4, name: 'Safari Starter', xp: 600 },
  { id: 5, name: 'Pride Scout', xp: 1000 },
  { id: 6, name: 'Stripe Seeker', xp: 1500 },
  { id: 7, name: 'Night Explorer', xp: 2200 },
  { id: 8, name: 'Snake Charmer', xp: 3000 },
  { id: 9, name: 'Gentle Giant', xp: 4000 },
  { id: 10, name: 'River Ranger', xp: 5200 },
  { id: 11, name: 'Pack Leader', xp: 6500 },
  { id: 12, name: 'Sky Reacher', xp: 8000 },
  { id: 13, name: 'Wild Legend', xp: 10000 },
];

export function isBadgeEarned(badge: Badge, xp: number): boolean {
  return xp >= badge.xp;
}

export function nextBadge(xp: number): Badge | null {
  return BADGE_LADDER.find((badge) => badge.xp > xp) ?? null;
}

/** The newest badge that `xpAfter` unlocks but `xpBefore` did not, if any. */
export function badgeUnlocked(xpBefore: number, xpAfter: number): Badge | null {
  const crossed = BADGE_LADDER.filter((badge) => badge.xp > xpBefore && badge.xp <= xpAfter);
  return crossed[crossed.length - 1] ?? null;
}

/**
 * How far along the bar is towards the next badge, from the last one earned
 * (0 to 1). Full once every badge is earned.
 */
export function badgeProgress(xp: number): number {
  const next = nextBadge(xp);
  if (!next) return 1;
  const previous = [...BADGE_LADDER].reverse().find((badge) => badge.xp <= xp)?.xp ?? 0;
  return (xp - previous) / (next.xp - previous);
}
