import { StyleSheet, Text, View } from 'react-native';
import { Button, Docent, docentFromLook, Popup, PopupButtons } from '../ui';
import { useLifelist } from '../../lib/lifelist-store';
import { colors, type } from '../../lib/theme';

type Props = {
  visible: boolean;
  onCreateAccount: () => void;
  onNotNow: () => void;
  /** Passed to Popup: runs once the pop-up has fully closed. */
  onDismissed?: () => void;
};

/**
 * Shown when a guest taps the daily quiz: the quiz needs an account. Not drawn
 * in Figma: built from the pop-up parts, like AiConsentPopup.
 */
export function QuizAccountPopup({ visible, onCreateAccount, onNotNow, onDismissed }: Props) {
  const { profile } = useLifelist();
  return (
    <Popup visible={visible} onClose={onNotNow} onDismissed={onDismissed}>
      <Docent animal={docentFromLook(profile.look)} width={112} />
      <View style={styles.text}>
        <Text style={[type.headingM, styles.center]} accessibilityRole="header">
          Create an account to play
        </Text>
        <Text style={[type.bodySm, styles.center, styles.muted]}>
          I’d love to quiz you! Sign up for free to play the daily quiz and keep your XP.
        </Text>
      </View>
      <PopupButtons>
        <Button label="Not now" variant="outline" size="compact" onPress={onNotNow} style={styles.flex} />
        <Button label="Create account" size="compact" onPress={onCreateAccount} style={styles.flex} />
      </PopupButtons>
    </Popup>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  text: { alignSelf: 'stretch', gap: 8 },
  center: { textAlign: 'center' },
  muted: { color: colors.textMuted },
});
