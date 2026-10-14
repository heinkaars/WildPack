import { useState } from 'react';
import { Asset } from 'expo-asset';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { HomeView } from '../../components/home/HomeView';
import { ProfileView } from '../../components/profile/ProfileView';
import type { DocentAnimal } from '../../components/ui';
import { computeStats } from '../../lib/xp';
import { LifelistEntry } from '../../lib/types';

const SQUIRREL = Asset.fromModule(require('../../assets/lifelist/squirrel.jpg')).uri;
const RACCOON = Asset.fromModule(require('../../assets/dev/raccoon.jpg')).uri;

function daysAgo(days: number, hour = 10): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

const ENTRIES: LifelistEntry[] = [
  {
    id: 'sciurus-vulgaris',
    commonName: 'Red Squirrel',
    scientificName: 'Sciurus vulgaris',
    description: 'A small tree squirrel with russet fur and tufted ears.',
    categoryId: 'mammals',
    photoUri: SQUIRREL,
    firstSeenAt: daysAgo(2),
    lastSeenAt: daysAgo(0),
    sightingCount: 2,
    location: 'Utrecht, Utrecht',
  },
  {
    id: 'procyon-lotor',
    commonName: 'Raccoon',
    scientificName: 'Procyon lotor',
    description: 'A medium-sized mammal with a black mask and a ringed tail.',
    categoryId: 'mammals',
    photoUri: RACCOON,
    firstSeenAt: daysAgo(1),
    lastSeenAt: daysAgo(1),
    sightingCount: 1,
    location: null,
  },
];

// Three days in a row, one repeat sighting and a couple of chat questions.
const STATS = computeStats({
  sightings: [
    { speciesSlug: 'sciurus-vulgaris', seenAt: daysAgo(2) },
    { speciesSlug: 'procyon-lotor', seenAt: daysAgo(1) },
    { speciesSlug: 'sciurus-vulgaris', seenAt: daysAgo(0) },
  ],
  questionsBySpecies: { 'procyon-lotor': 2 },
});

const EMPTY_STATS = computeStats({ sightings: [], questionsBySpecies: {} });

type Screen = 'home' | 'empty' | 'profile' | 'profile-signed-in';

/**
 * Home and Profile with sample data, reachable without a server — for checking
 * the layout in the browser preview. Dev builds only.
 * `/dev/home?screen=home|empty|profile|profile-signed-in` (default home).
 */
export default function HomePreview() {
  const { screen = 'home' } = useLocalSearchParams<{ screen?: Screen }>();
  const router = useRouter();
  const [look, setLook] = useState<DocentAnimal>('lion');
  const [name, setName] = useState('Afrina');
  const [locationOn, setLocationOn] = useState(true);

  if (!__DEV__) return <Redirect href="/" />;

  const profile = { name, look };

  if (screen === 'profile' || screen === 'profile-signed-in') {
    const pause = () => new Promise<void>((resolve) => setTimeout(resolve, 600));
    return (
      <ProfileView
        profile={profile}
        profileLoaded
        stats={STATS}
        speciesCount={ENTRIES.length}
        email={screen === 'profile-signed-in' ? 'afrina@example.com' : null}
        locationOn={locationOn}
        onBack={() => router.replace('/dev/home')}
        onRename={setName}
        onPickDocent={setLook}
        onToggleLocation={setLocationOn}
        onCreateAccount={() => {}}
        onSignIn={() => {}}
        onLogOut={pause}
        onDeleteAccount={async () => {
          await pause();
          throw new Error('Preview only: nothing was deleted.');
        }}
      />
    );
  }

  const empty = screen === 'empty';
  return (
    <HomeView
      profile={profile}
      entries={empty ? [] : ENTRIES}
      stats={empty ? EMPTY_STATS : STATS}
      onOpenProfile={() => router.replace('/dev/home?screen=profile')}
      onOpenSpecies={() => {}}
      onCapture={() => router.push('/dev/capture')}
    />
  );
}
