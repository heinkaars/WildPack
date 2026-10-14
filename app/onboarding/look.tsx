import { useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, DocentAnimal, DocentCard, DOCENT_ANIMALS } from '../../components/ui';
import { OnboardingScreen } from '../../components/onboarding/OnboardingScreen';
import { useLifelist } from '../../lib/lifelist-store';
import { spacing, type } from '../../lib/theme';

// Figma's grid order (88384:3880): raccoon and gecko on top, lion and rhino below.
const GRID: DocentAnimal[] = ['raccoon', 'gecko', 'lion', 'rhino'];
const COLUMN_GAP = 8;

export default function ChooseDocentScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useLifelist();
  const { width } = useWindowDimensions();
  // Nothing is picked until the user picks, so Continue starts disabled — but
  // coming back to this screen shows the docent chosen before.
  const [selected, setSelected] = useState<DocentAnimal | null>(
    (DOCENT_ANIMALS as string[]).includes(profile.look) ? (profile.look as DocentAnimal) : null,
  );

  const cardWidth = (width - spacing.screen * 2 - COLUMN_GAP) / 2;

  async function handleContinue() {
    if (!selected) return;
    await updateProfile({ look: selected });
    router.push('/onboarding/name');
  }

  return (
    <OnboardingScreen
      footer={<Button label="Continue" onPress={handleContinue} disabled={!selected} />}
    >
      <View style={styles.body}>
        <Text style={type.headingM} accessibilityRole="header">
          Choose your Docent
        </Text>
        <View style={styles.grid} accessibilityRole="radiogroup">
          {GRID.map((animal) => (
            <DocentCard
              key={animal}
              animal={animal}
              width={cardWidth}
              selected={selected === animal}
              onPress={() => setSelected(animal)}
            />
          ))}
        </View>
      </View>
    </OnboardingScreen>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: spacing.screen, paddingTop: 20 },
  grid: {
    marginTop: 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: COLUMN_GAP,
    rowGap: 20,
  },
});
