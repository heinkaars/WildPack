import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Docent, docentFromLook, Input } from '../../components/ui';
import { OnboardingScreen } from '../../components/onboarding/OnboardingScreen';
import { useLifelist } from '../../lib/lifelist-store';
import { useOnboarding } from '../../lib/onboarding';
import { colors, fonts, spacing } from '../../lib/theme';

export default function ChooseNameScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useLifelist();
  const { markComplete } = useOnboarding();
  const [name, setName] = useState('');

  const trimmed = name.trim();

  async function handleContinue() {
    if (!trimmed) return;
    await updateProfile({ name: trimmed });
    // Docent and name are saved, so leaving on a later screen should not
    // restart the flow.
    await markComplete();
    router.push('/onboarding/pack');
  }

  return (
    <OnboardingScreen
      wash={false}
      footer={<Button label="Continue" onPress={handleContinue} disabled={!trimmed} />}
    >
      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Docent animal={docentFromLook(profile.look)} width={78} style={styles.docent} />
        {/* Figma "Description Container": 138.5° green wash, text sitting at the bottom. */}
        <LinearGradient
          colors={['rgba(144, 184, 0, 0.2)', 'rgba(46, 105, 15, 0.2)']}
          locations={[0.351, 1]}
          start={{ x: 0.169, y: -0.33 }}
          end={{ x: 0.831, y: 1.33 }}
          style={styles.bubble}
        >
          <Text style={styles.bubbleText}>
            Excellent choice! I’m your docent, your guide on this WildPack adventure. Ask me
            anything about the wildlife you capture, no question is too wild! Did you know there
            are over 1.5 million wildlife species out there? And they’re all waiting to be
            discovered by you! Together, we’ll build your lifelist. Before we start exploring, what
            should I call you?
          </Text>
        </LinearGradient>

        <View style={styles.field}>
          <Input
            value={name}
            onChangeText={setName}
            placeholder="Call me…"
            accessibilityLabel="Your name"
            autoCapitalize="words"
            autoComplete="name"
            autoCorrect={false}
            maxLength={24}
            returnKeyType="done"
            onSubmitEditing={handleContinue}
          />
        </View>
      </ScrollView>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: spacing.screen, paddingTop: 20, paddingBottom: spacing.lg },
  // Figma: the portrait sits 22px in from the bubble's edge and overlaps its top by 31px.
  docent: { marginLeft: 22, zIndex: 1 },
  bubble: {
    marginTop: -31,
    minHeight: 160,
    padding: 12,
    borderRadius: 12,
    justifyContent: 'flex-end',
  },
  bubbleText: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: -0.2,
    color: colors.text,
  },
  field: { marginTop: 20, gap: 12 },
});
