import { Linking } from 'react-native';
import { getMeta, setMeta } from './db';

/**
 * Apple's guideline 5.1.2(i): before personal data goes to a third-party AI,
 * the app has to say so and get the user's OK. Photos (identify) and chat
 * questions (Ask) go to OpenAI, so each asks once, at the moment it would send.
 *
 * Kept in the local meta table, which is cleared when a different account takes
 * over this phone. That account is then asked again, which is what we want: it
 * is a different person's consent.
 */
const CONSENT_KEY = 'ai_consent';

/** Where the hosted privacy policy lives (`public/privacy.html`, served by EAS Hosting). */
export const PRIVACY_POLICY_URL = 'https://wildpack.expo.app/privacy.html';

export async function hasAiConsent(): Promise<boolean> {
  try {
    return (await getMeta(CONSENT_KEY)) === '1';
  } catch {
    return false;
  }
}

export async function giveAiConsent(): Promise<void> {
  await setMeta(CONSENT_KEY, '1');
}

export function openPrivacyPolicy(): void {
  Linking.openURL(PRIVACY_POLICY_URL).catch(() => {});
}
