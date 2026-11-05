import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { HomeView } from '../components/home/HomeView';
import { SyncIndicator } from '../components/SyncIndicator';
import * as db from '../lib/db';
import { useLifelist } from '../lib/lifelist-store';
import { localDateKey } from '../lib/xp';
import { FlashBanner } from '../lib/flash';
import { colors, type } from '../lib/theme';

/** Home: greeting, week / XP overview, badges and the life list (Figma 88384:2943). */
export default function HomeScreen() {
  const router = useRouter();
  const { ready, profile, entries, stats, refresh } = useLifelist();

  if (!ready) {
    return (
      <View style={styles.loading}>
        <Text style={[type.bodyLg, styles.muted]}>Loading your life list…</Text>
      </View>
    );
  }

  return (
    <>
      <HomeView
        profile={profile}
        entries={entries}
        stats={stats}
        onOpenProfile={() => router.push('/account')}
        onOpenSpecies={(id) => router.push(`/species/${id}`)}
        onCapture={() => router.push('/capture')}
        onOpenQuiz={() => router.push('/quiz')}
        onReplayQuiz={
          __DEV__
            ? async () => {
                await db.deleteQuiz(localDateKey(new Date()));
                await refresh();
                router.push('/quiz');
              }
            : undefined
        }
        notices={<SyncIndicator />}
      />
      {/* Confirms a sign-in or a new account, both of which land here. */}
      <FlashBanner />
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  muted: {
    color: colors.textMuted,
  },
});
