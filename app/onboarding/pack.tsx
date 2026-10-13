import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Docent, docentFromLook } from '../../components/ui';
import { OnboardingScreen } from '../../components/onboarding/OnboardingScreen';
import { useLifelist } from '../../lib/lifelist-store';
import { colors, fonts } from '../../lib/theme';

/** Figma 88384:3969: the chosen docent welcomes the user by name. */
export default function WelcomeToPackScreen() {
  const router = useRouter();
  const { profile } = useLifelist();

  return (
    <OnboardingScreen
      footer={<Button label="Continue" onPress={() => router.push('/onboarding/first-capture')} />}
    >
      <View style={styles.body}>
        <Docent animal={docentFromLook(profile.look)} width={DOCENT_WIDTH} />
        <Text style={styles.message} accessibilityRole="header">
          Welcome to the Pack {profile.name}, excited to be sharing this experience with you.
        </Text>
      </View>
    </OnboardingScreen>
  );
}

/** Figma's 203 × 216 portrait frame; the ring inside it is 195 wide. */
const DOCENT_WIDTH = 195;

const styles = StyleSheet.create({
  // Figma: the portrait starts 96px under the top bar.
  body: {
    alignItems: 'center',
    paddingTop: 96,
    paddingHorizontal: 49,
    gap: 16,
  },
  message: {
    fontFamily: fonts.title,
    fontSize: 20,
    lineHeight: 30,
    letterSpacing: -0.3,
    color: colors.text,
    textAlign: 'center',
  },
});
