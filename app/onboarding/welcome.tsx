import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/ui';
import { WelcomeScene } from '../../components/onboarding/WelcomeScene';
import { spacing } from '../../lib/theme';

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <WelcomeScene>
      <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, spacing.screen) }]}>
        <Button label="I have an account" onPress={() => router.push('/auth/sign-in')} />
        <Button label="I’m new here" variant="outline" onPress={() => router.push('/onboarding/look')} />
      </View>
    </WelcomeScene>
  );
}

const styles = StyleSheet.create({
  actions: { paddingHorizontal: spacing.screen, gap: 10 },
});
