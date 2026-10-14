import type { Badge } from './badges';

export type Profile = {
  name: string;
  look: string;
};

/** One capture of a species, as the species page shows it. */
export type Sighting = {
  id: string;
  /** Empty while the photo is still on its way down from the server. */
  photoUri: string;
  location: string | null;
  seenAt: string;
};

export type LifelistEntry = {
  id: string;
  commonName: string;
  scientificName: string;
  description: string;
  categoryId: string;
  photoUri: string;
  /** The capture `photoUri` belongs to (the species' cover photo). */
  coverSightingId?: string | null;
  firstSeenAt: string;
  lastSeenAt: string;
  sightingCount: number;
  location: string | null;
};

/** A single candidate species returned by identification. */
export type SpeciesGuess = {
  commonName: string;
  scientificName: string;
  description: string;
  categoryId: string;
  confidence: number;
};

/** The best guess plus the runners-up shown behind "See other matches". */
export type IdentifyOutcome = {
  best: SpeciesGuess;
  alternates: SpeciesGuess[];
};

export type CelebrationPayload = {
  entry: LifelistEntry;
  isNewSpecies: boolean;
  streak: number;
  /** Explorer XP this capture earned (`lib/xp.ts`). */
  xpEarned: number;
  /** The badge this capture unlocked, if it crossed one. */
  badge: Badge | null;
  speciesNumber: number;
};

export type AmaMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  /** An answer that declined an off-topic question (shown red in the chat). */
  offTopic?: boolean;
};
