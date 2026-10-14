import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLifelist } from '../../lib/lifelist-store';
import { SpeciesView } from '../../components/species/SpeciesView';
import { Button } from '../../components/ui';
import { Sighting } from '../../lib/types';
import { colors, spacing, type } from '../../lib/theme';

export default function SpeciesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getEntry, getSightings, editSighting, setCoverPhoto } = useLifelist();
  const entry = getEntry(id);

  const [sightings, setSightings] = useState<Sighting[]>([]);
  // Null until the captures are in; then it starts on the life list's cover photo.
  const [index, setIndex] = useState<number | null>(null);

  // Re-read whenever the species changes underneath: an edit, or a photo
  // arriving from the server.
  useEffect(() => {
    if (!entry) return;
    let cancelled = false;
    getSightings(entry.id).then((loaded) => {
      if (cancelled) return;
      setSightings(loaded);
      setIndex((previous) => {
        if (previous !== null) return Math.min(previous, loaded.length - 1);
        const cover = loaded.findIndex((sighting) => sighting.id === entry.coverSightingId);
        return cover >= 0 ? cover : 0;
      });
    });
    return () => {
      cancelled = true;
    };
  }, [entry, getSightings]);

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

  const current = index !== null ? sightings[index] : undefined;

  function showCapture(next: number) {
    setIndex(next);
    // The life list shows whichever photo was looked at last.
    const sighting = sightings[next];
    if (sighting?.photoUri && entry) setCoverPhoto(entry.id, sighting.id);
  }

  return (
    <SpeciesView
      entry={entry}
      sightings={index !== null ? sightings : []}
      index={index ?? 0}
      onIndexChange={showCapture}
      onBack={back}
      onAsk={() => router.push(`/ama/${entry.id}`)}
      onChangeDate={async (seenAt) => {
        if (current) await editSighting(current.id, { seenAt });
      }}
      onChangeLocation={async (location) => {
        if (current) await editSighting(current.id, { location });
      }}
    />
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.screen, gap: spacing.lg },
  notFound: { color: colors.textMuted, textAlign: 'center' },
});
