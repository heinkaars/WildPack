import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';
import * as db from './db';
import { savePhoto } from './photos';
import { onSynced, sync } from './sync';
import { migrateLegacyData } from './migrate-legacy';
import { completeAccountSwitch } from './account-switch';
import { useAuth } from './auth';
import { slugify } from './slug';
import { uuid } from './uuid';
import { badgeUnlocked } from './badges';
import { computeStats, Stats } from './xp';
import { CelebrationPayload, LifelistEntry, Profile, Sighting, SpeciesGuess } from './types';
import { DEFAULT_LOOK } from '../components/Avatar';

// A friendly stand-in until the user picks a name on A4. The suffix is drawn
// once per launch and then persisted with the profile row, so the name a user
// sees on their lifelist never changes underneath them. Only ever given to an
// account being created — an existing account already has a name worth waiting
// for, and inventing one for it is how a real name gets overwritten.
const DEFAULT_PROFILE: Profile = {
  name: `Explorer_${Math.floor(10 + Math.random() * 90)}`,
  look: DEFAULT_LOOK,
};

// Shown while an existing account's real profile is still on its way down from
// the server. Deliberately not random and never saved: it stands in for a name
// rather than pretending to be one.
const PLACEHOLDER_PROFILE: Profile = { name: 'Explorer', look: DEFAULT_LOOK };

/** The latest streak day, i.e. what the profile stores as its last activity. */
function lastActiveDay(stats: Stats): string | null {
  let latest: string | null = null;
  for (const day of stats.activeDays) if (latest === null || day > latest) latest = day;
  return latest;
}

type LifelistState = {
  ready: boolean;
  profile: Profile;
  /**
   * False while `profile` is only a stand-in, i.e. this account has a profile
   * on the server that has not arrived yet. Nothing provisional may be written
   * back, or a placeholder would replace the name the user chose.
   */
  profileLoaded: boolean;
  entries: LifelistEntry[];
  streak: number;
  lastActivityDate: string | null;
  /** Explorer XP, capture count and the live streak, worked out from the local data. */
  stats: Stats;
};

const EMPTY_STATS: Stats = { xp: 0, captures: 0, streak: 0, activeDays: new Set(), quizScores: {} };

type LifelistContextValue = Omit<LifelistState, 'lastActivityDate'> & {
  /** Re-reads the local database, e.g. after a chat question changed the XP. */
  refresh: () => Promise<void>;
  /** Re-reads the local database after a finished daily quiz and saves the streak it may have moved. */
  recordQuiz: () => Promise<void>;
  getEntry: (id: string) => LifelistEntry | undefined;
  /** Takes the photo's base64 so the sighting keeps a durable local copy. */
  addSighting: (guess: SpeciesGuess, photoBase64: string, location: string | null) => Promise<CelebrationPayload>;
  updateProfile: (profile: Partial<Profile>) => Promise<void>;
  /** The date or place on a species page, corrected by the user. */
  /** Every capture of a species, oldest first. */
  getSightings: (speciesId: string) => Promise<Sighting[]>;
  /** Changes the date or place of one capture. */
  editSighting: (sightingId: string, change: { seenAt: string } | { location: string | null }) => Promise<void>;
  /** Makes this capture's photo the one the life list shows for its species. */
  setCoverPhoto: (speciesId: string, sightingId: string) => Promise<void>;
};

const LifelistContext = createContext<LifelistContextValue | null>(null);

export function LifelistProvider({ children }: { children: React.ReactNode }) {
  const { ready: authReady, userId, justCreated } = useAuth();
  const [state, setState] = useState<LifelistState>({
    ready: false,
    profile: PLACEHOLDER_PROFILE,
    profileLoaded: false,
    entries: [],
    streak: 0,
    lastActivityDate: null,
    stats: EMPTY_STATS,
  });

  // Everything the screens show comes from the local database, so this is the
  // only thing that stands between launch and a rendered lifelist.
  const refresh = useCallback(async () => {
    const [entries, profile, activity] = await Promise.all([
      db.readLifelist(),
      db.readProfile(),
      db.readActivity(),
    ]);
    setState({
      ready: true,
      entries,
      profile: profile ? { name: profile.name, look: profile.look } : PLACEHOLDER_PROFILE,
      profileLoaded: profile !== null,
      streak: profile?.streak ?? 0,
      lastActivityDate: profile?.lastActivityDate ?? null,
      stats: computeStats(activity),
    });
  }, []);

  useEffect(() => {
    if (!authReady || !userId) return;
    let cancelled = false;

    (async () => {
      await db.claimForUser(userId);
      // Claiming just emptied the tables. If this is a sign-in, the previous
      // account's sightings were read aside first and are replayed here,
      // queued for upload against the account that now owns them.
      await completeAccountSwitch(userId);
      await migrateLegacyData();

      // Only an account created moments ago gets a generated name. For any
      // other account the row is left absent on purpose: its real name is on
      // the server, and the next pull fills it in. Writing a stand-in here
      // would make the placeholder look like a saved name, and the first
      // capture afterwards would push it over the name the user chose.
      if (justCreated && !(await db.readProfile())) {
        const starter = { ...DEFAULT_PROFILE, streak: 0, lastActivityDate: null };
        await db.writeProfile(starter);

        // The server creates its own profile row with a placeholder name, and
        // the next pull would overwrite ours with it, so claim the row now.
        await db.enqueue('profile.update', starter);
      }

      if (cancelled) return;
      await refresh();
      // Render first, reconcile with the server afterwards.
      sync(userId);
    })();

    return () => {
      cancelled = true;
    };
  }, [authReady, userId, justCreated, refresh]);

  useEffect(() => onSynced(refresh), [refresh]);

  // Catch up on anything that happened elsewhere while the app was backgrounded.
  useEffect(() => {
    if (!userId) return;
    const subscription = AppState.addEventListener('change', (next) => {
      if (next === 'active') sync(userId);
    });
    return () => subscription.remove();
  }, [userId]);

  const stateRef = useRef(state);
  stateRef.current = state;

  const value = useMemo<LifelistContextValue>(() => {
    const { lastActivityDate: _ignored, ...visible } = state;

    // The profile keeps a copy of the streak for the server. It is worked out
    // from the same records as the one on screen, so the two always agree.
    // While the real profile is still in flight it is left alone: the name
    // here would be the stand-in, and pushing it would replace the user's own
    // name with a placeholder — permanently, since the server keeps whatever
    // it was last told. The streak catches up on the next streak day.
    const saveStreak = async (stats: Stats) => {
      const current = stateRef.current;
      const lastActivityDate = lastActiveDay(stats);
      setState((prev) => ({ ...prev, streak: stats.streak, lastActivityDate }));
      if (!current.profileLoaded) return;
      if (current.streak === stats.streak && current.lastActivityDate === lastActivityDate) return;
      const profileRow = { ...current.profile, streak: stats.streak, lastActivityDate };
      await db.writeProfile(profileRow);
      await db.enqueue('profile.update', profileRow);
    };

    return {
      ...visible,

      refresh,

      recordQuiz: async () => {
        const [entries, activity] = await Promise.all([db.readLifelist(), db.readActivity()]);
        const stats = computeStats(activity);
        setState((prev) => ({ ...prev, entries, stats }));
        await saveStreak(stats);
      },

      getEntry: (id) => state.entries.find((entry) => entry.id === id),

      // A deliberate choice by the user, so it is real even if the server's
      // copy has not arrived — it is now the newer one and wins the next sync.
      updateProfile: async (partial) => {
        const profile = { ...stateRef.current.profile, ...partial };
        setState((prev) => ({ ...prev, profile, profileLoaded: true }));

        const row = {
          ...profile,
          streak: stateRef.current.streak,
          lastActivityDate: stateRef.current.lastActivityDate,
        };
        await db.writeProfile(row);
        await db.enqueue('profile.update', row);

        if (userId) sync(userId);
      },

      getSightings: (speciesId) => db.readSightings(speciesId),

      setCoverPhoto: async (speciesId, sightingId) => {
        await db.setCoverPhoto(speciesId, sightingId);
        const entries = await db.readLifelist();
        setState((prev) => ({ ...prev, entries }));
      },

      editSighting: async (sightingId, change) => {
        const row = await db.editSighting(sightingId, change);
        if (!row) return;
        // The insert job is an upsert by id, so it carries the correction too.
        await db.enqueue('sighting.insert', row);

        const [entries, activity] = await Promise.all([db.readLifelist(), db.readActivity()]);
        setState((prev) => ({ ...prev, entries, stats: computeStats(activity) }));

        if (userId) sync(userId);
      },

      addSighting: async (guess, photoBase64, location) => {
        const current = stateRef.current;
        const speciesSlug = slugify(guess.scientificName || guess.commonName);
        const sightingId = uuid();
        const now = new Date();
        const seenAt = now.toISOString();

        const isNewSpecies = !current.entries.some((entry) => entry.id === speciesSlug);

        // Write the photo to app storage before anything else so the tile has
        // something to render even if the upload never succeeds.
        let photoLocalUri: string | null = null;
        try {
          photoLocalUri = savePhoto(sightingId, photoBase64);
        } catch (error) {
          // The sighting is still worth keeping without its photo, but a
          // silent failure here is what an empty lifelist tile looks like.
          console.warn('Could not save the captured photo', error);
          photoLocalUri = null;
        }

        const species = {
          slug: speciesSlug,
          commonName: guess.commonName,
          scientificName: guess.scientificName,
          description: guess.description,
          categoryId: guess.categoryId,
        };

        await db.upsertSpecies(species);
        await db.insertSighting({
          id: sightingId,
          speciesSlug,
          photoLocalUri,
          photoPath: null,
          location,
          seenAt,
        });

        // Queued in dependency order: the species row must exist on the server
        // before the sighting that points at it.
        await db.enqueue('species.upsert', species);
        await db.enqueue('sighting.insert', { id: sightingId, speciesSlug, location, seenAt });
        if (photoLocalUri) await db.enqueue('photo.upload', { sightingId });

        const [entries, activity] = await Promise.all([db.readLifelist(), db.readActivity()]);
        const stats = computeStats(activity);
        setState((prev) => ({ ...prev, entries, stats }));
        await saveStreak(stats);

        if (userId) sync(userId);

        const entry = entries.find((candidate) => candidate.id === speciesSlug) as LifelistEntry;

        return {
          entry,
          isNewSpecies,
          streak: stats.streak,
          xpEarned: stats.xp - current.stats.xp,
          xpTotal: stats.xp,
          badge: badgeUnlocked(current.stats.xp, stats.xp),
          speciesNumber: entries.length,
        };
      },
    };
  }, [state, userId, refresh]);

  return <LifelistContext.Provider value={value}>{children}</LifelistContext.Provider>;
}

export function useLifelist(): LifelistContextValue {
  const ctx = useContext(LifelistContext);
  if (!ctx) throw new Error('useLifelist must be used within a LifelistProvider');
  return ctx;
}
