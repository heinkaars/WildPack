import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLifelist } from '../../lib/lifelist-store';
import { SpeciesView } from '../../components/species/SpeciesView';
import { Button } from '../../components/ui';
import { colors, spacing, type } from '../../lib/theme';

export default function SpeciesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getEntry, editSighting } = useLifelist();
  const entry = getEntry(id);

  // Back returns to wherever the page was opened from; with nothing behind it
  // (a reload on web), it goes to the life list.
  const back = () => (router.canGoBack() ? router.back() : router.replace('/'));

  if (!entry) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={[type.bodySm, styles.notFound]}>This species hasn't been logged yet.</Text>
          <Button label="Back to life list" onPress={() => router.dismissTo('/')} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SpeciesView
      entry={entry}
      onBack={back}
      onAsk={() => router.push(`/ama/${entry.id}`)}
      onChangeDate={(seenAt) => editSighting(entry.id, { seenAt })}
      onChangeLocation={(location) => editSighting(entry.id, { location })}
    />
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.screen, gap: spacing.lg },
  notFound: { color: colors.textMuted, textAlign: 'center' },
});
