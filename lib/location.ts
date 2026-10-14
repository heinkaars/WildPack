import { getMeta, setMeta } from './db';

/**
 * The profile's "Location" switch: when on, new sightings remember where they
 * were taken. Kept on this phone only — it is a device permission as much as a
 * preference — and, until the user flips it, it simply follows whether the
 * phone has granted location (the onboarding pop-up asks once).
 */
const SHARING_KEY = 'location_sharing';

/** How long a capture waits for a place name before saving without one. */
const PLACE_TIMEOUT_MS = 2500;

// Loaded on demand rather than at the top: route files also run on the server
// for the web build, and native modules don't belong there.
async function locationModule() {
  try {
    return await import('expo-location');
  } catch {
    return null;
  }
}

async function permissionGranted(): Promise<boolean> {
  const Location = await locationModule();
  if (!Location) return false;
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
}

/** Whether the switch shows as on: the user's choice, and the phone still allowing it. */
export async function isLocationSharingOn(): Promise<boolean> {
  const choice = await getMeta(SHARING_KEY);
  if (choice === '0') return false;
  return permissionGranted();
}

export type SharingResult = 'on' | 'off' | 'denied' | 'blocked';

/**
 * Turning it on asks the phone for permission if it hasn't been given yet.
 * 'denied' = the user said no just now; 'blocked' = the phone won't ask again,
 * so only the Settings app can change it.
 */
export async function setLocationSharing(on: boolean): Promise<SharingResult> {
  if (!on) {
    await setMeta(SHARING_KEY, '0');
    return 'off';
  }

  const Location = await locationModule();
  if (!Location) return 'blocked';

  try {
    let permission = await Location.getForegroundPermissionsAsync();
    if (permission.status !== 'granted' && permission.canAskAgain) {
      permission = await Location.requestForegroundPermissionsAsync();
    }
    if (permission.status !== 'granted') {
      return permission.canAskAgain ? 'denied' : 'blocked';
    }
  } catch {
    return 'blocked';
  }

  await setMeta(SHARING_KEY, '1');
  return 'on';
}

/**
 * A readable place for a new sighting ("Utrecht, Utrecht"), the coordinates
 * when the phone can't name it, or null when sharing is off. Never throws.
 * Start it early (when the result shows) and collect it with `placeWithin`.
 */
export function currentPlace(): Promise<string | null> {
  return (async () => {
    if (!(await isLocationSharingOn())) return null;
    const Location = await locationModule();
    if (!Location) return null;

    try {
      const position =
        (await Location.getLastKnownPositionAsync({ maxAge: 5 * 60_000 })) ??
        (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));
      const { latitude, longitude } = position.coords;
      const coordinates = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

      try {
        const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
        const parts = [place?.city ?? place?.subregion, place?.region ?? place?.country].filter(Boolean);
        const unique = parts.filter((part, i) => parts.indexOf(part) === i);
        return unique.length > 0 ? unique.join(', ') : coordinates;
      } catch {
        // Naming the place needs the network (and isn't offered on web).
        return coordinates;
      }
    } catch {
      return null;
    }
  })();
}

/** The place if it has arrived by now or within a moment; a capture never waits longer. */
export function placeWithin(lookup: Promise<string | null>): Promise<string | null> {
  const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), PLACE_TIMEOUT_MS));
  return Promise.race([lookup, timeout]);
}
