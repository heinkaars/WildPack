import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Docent, docentFromLook, Popup, PopupButtons } from './ui';
import { giveAiConsent, openPrivacyPolicy } from '../lib/ai-consent';
import { useLifelist } from '../lib/lifelist-store';
import { colors, type } from '../lib/theme';

type Props = {
  visible: boolean;
  /** What is about to be sent, as it reads in "We send your … to OpenAI". */
  what: 'photo' | 'question';
  /** Called after the OK has been stored. */
  onAgree: () => void;
  onDecline: () => void;
};

/**
 * Asks once before WildPack's first photo or chat question goes to OpenAI
 * (see lib/ai-consent.ts). Not drawn in Figma: built from the pop-up parts.
 */
export function AiConsentPopup({ visible, what, onAgree, onDecline }: Props) {
  const { profile } = useLifelist();
  const [saving, setSaving] = useState(false);

  async function agree() {
    setSaving(true);
    try {
      await giveAiConsent();
    } catch {
      // Not stored: we still have the OK for this one, and will ask again next time.
    }
    setSaving(false);
    onAgree();
  }

  const body =
    what === 'photo'
      ? 'To identify the animal, WildPack sends your photo and any questions you ask later to OpenAI.'
      : 'To answer, WildPack sends your question, the chat so far and any photos you identify to OpenAI.';

  return (
    <Popup visible={visible} onClose={saving ? undefined : onDecline}>
      <Docent animal={docentFromLook(profile.look)} width={112} />
      <View style={styles.text}>
        <Text style={[type.headingM, styles.center]} accessibilityRole="header">
          Before I take a look
        </Text>
        <Text style={[type.bodySm, styles.center, styles.muted]}>
          {body} They’re not used for AI training, and your name and email are never shared.
        </Text>
        <Text
          style={[type.bodySm, styles.center, styles.link]}
          accessibilityRole="link"
          onPress={openPrivacyPolicy}
        >
          Read the privacy policy
        </Text>
      </View>
      <PopupButtons>
        <Button label="Not now" variant="outline" size="compact" onPress={onDecline} disabled={saving} style={styles.flex} />
        <Button label="I agree" size="compact" onPress={agree} disabled={saving} style={styles.flex} />
      </PopupButtons>
    </Popup>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  text: { alignSelf: 'stretch', gap: 8 },
  center: { textAlign: 'center' },
  muted: { color: colors.textMuted },
  link: { color: colors.primary, textDecorationLine: 'underline' },
});
