/**
 * Writes the shared species catalog, server-side only.
 *
 * The catalog is shared by every user, and it used to be written by the client:
 * whoever first identified a Red Fox decided what the description said, for
 * everyone, permanently. That meant anyone could seed a slug like
 * `vulpes-vulpes` with anything they liked and every later user would read it,
 * because their own correct write was skipped as a duplicate.
 *
 * So the text no longer travels up from a device. It is written here, straight
 * from the model's own answer, before the outcome is handed back.
 *
 * This module needs the service role key, which bypasses row level security —
 * it is the only way to write a row nobody owns. Never import it from a screen.
 * The key has no EXPO_PUBLIC_ prefix, so Expo cannot inline it into the client
 * bundle even by accident.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { categoryById } from './categories';
import { slugify } from './slug';
import { SpeciesGuess } from './types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let client: SupabaseClient | null = null;

function catalog(): SupabaseClient | null {
  if (!supabaseUrl || !serviceRoleKey) return null;
  if (!client) {
    client = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  }
  return client;
}

/**
 * Genus, then up to three lower-case parts: "Vulpes vulpes", "Canis lupus
 * familiaris", "Platanus × acerifolia", "Larus sp.". Letters and spaces only, so
 * a scientific name cannot carry a sentence, a link or anything else a printed
 * note in a photo might talk the model into writing.
 */
const SCIENTIFIC_NAME = /^[A-Z][a-z]+(?: (?:×|[a-z]+(?:-[a-z]+)?\.?)){0,3}$/;
const MAX_COMMON_NAME = 80;
const MAX_DESCRIPTION = 600;
const LINK = /https?:\/\/|www\.|\.(?:com|net|org|io|ly)\b/i;

/**
 * The guess trimmed to size, or null when it does not look like a species.
 *
 * The first description written for a species is the one every user reads,
 * permanently, so the model's answer is checked rather than trusted: a photo
 * can contain text, and text can steer the model.
 */
export function vetGuess(guess: SpeciesGuess | null | undefined): SpeciesGuess | null {
  if (!guess || typeof guess !== 'object') return null;

  const scientificName = typeof guess.scientificName === 'string' ? guess.scientificName.trim() : '';
  const commonName = typeof guess.commonName === 'string' ? guess.commonName.trim() : '';
  const description = typeof guess.description === 'string' ? guess.description.trim() : '';

  if (!SCIENTIFIC_NAME.test(scientificName)) return null;
  if (commonName.length === 0 || commonName.length > MAX_COMMON_NAME) return null;
  if (LINK.test(commonName) || LINK.test(description)) return null;
  // The response schema already limits this to the list, but the row is
  // permanent and shared, so the list is enforced here too rather than trusted.
  if (typeof guess.categoryId !== 'string' || !categoryById(guess.categoryId)) return null;

  return {
    ...guess,
    scientificName,
    commonName,
    description: description.slice(0, MAX_DESCRIPTION),
  };
}

/**
 * Records every guess from one identification, so whichever the user picks
 * already exists by the time their sighting syncs.
 *
 * Never throws. A catalog write that fails must not cost the user their
 * identification — the row is written again by the next person to photograph
 * the same animal.
 */
export async function recordSpecies(guesses: SpeciesGuess[]): Promise<void> {
  const writer = catalog();

  if (!writer) {
    console.error(
      '[species] SUPABASE_SERVICE_ROLE_KEY is not set, so the shared catalog cannot be ' +
        'written. Sightings will fail to sync once the client insert policy is revoked. ' +
        'Add the key from the Supabase dashboard (Settings → API) to .env and restart.',
    );
    return;
  }

  const rows = guesses
    .map(vetGuess)
    .filter((guess): guess is SpeciesGuess => guess !== null)
    .map((guess) => ({
      // Must match the slug the client derives in lifelist-store, or the
      // sighting would point at a row that does not exist.
      slug: slugify(guess.scientificName),
      common_name: guess.commonName,
      scientific_name: guess.scientificName,
      description: guess.description,
      category_id: guess.categoryId,
    }))
    .filter((row) => row.slug.length > 0);

  if (rows.length === 0) return;

  // ignoreDuplicates keeps the first description ever written, which is the
  // rule the app already relies on.
  const { error } = await writer
    .from('species')
    .upsert(rows, { onConflict: 'slug', ignoreDuplicates: true });

  if (error) console.error('[species] catalog write failed', error.message);
}
