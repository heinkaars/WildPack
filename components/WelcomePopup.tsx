import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Docent, docentFromLook, Popup } from './ui';
import { useLifelist } from '../lib/lifelist-store';
import { colors, type } from '../lib/theme';
import { clearWelcome, useWelcome, Welcome } from '../lib/welcome';

const VISIBLE_MS = 4000;

/**
 * Greets the user after they sign in or create an account: their docent, a
 * heading and the email they used. Same plain card as the streak and badge
 * explanations, with the cross to close; it also closes by itself. Not drawn in Figma:
 * built from the pop-up parts, like AiConsentPopup.
 */
export function WelcomePopup() {
  const welcome = useWelcome();
  const { profile, profileLoaded } = useLifelist();

  // Wait for the account's real profile, so the name and docent are theirs and
  // not the stand-in shown while it downloads.
  const visible = welcome !== null && profileLoaded;

  // Keeps the words on screen while the pop-up fades out.
  const last = useRef<Welcome | null>(null);
  if (welcome) last.current = welcome;
  const shown = welcome ?? last.current;

  // The countdown belongs to whoever is displaying the message, so it only
  // starts once the pop-up is really up.
  useEffect(() => {
    if (!visible) return undefined;
    const timer = setTimeout(clearWelcome, VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [visible]);

  const name = profile.name.trim();
  const created = shown?.kind === 'created';
  const heading = created ? 'Welcome' : 'Welcome back';

  return (
    <Popup visible={visible} onClose={clearWelcome}>
      <View style={styles.info}>
        <Docent animal={docentFromLook(profile.look)} width={112} />
        <Text style={[type.headingM, styles.center]} accessibilityRole="header">
          {name ? `${heading}, ${name}!` : `${heading}!`}
        </Text>
        <Text style={[type.bodyLg, styles.center, styles.muted]}>
          {created ? 'You created an account with' : 'You signed in with'} {shown?.email}
        </Text>
      </View>
    </Popup>
  );
}

const styles = StyleSheet.create({
  info: { alignItems: 'center', gap: 12 },
  center: { textAlign: 'center' },
  muted: { color: colors.textSecondary },
});
