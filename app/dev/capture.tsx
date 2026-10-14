import { useEffect, useState } from 'react';
import { Asset } from 'expo-asset';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import CaptureScreen from '../capture/index';
import ResultScreen from '../capture/result';
import { FAILURES, FailurePopup, IdentifyingView } from '../capture/identify';
import { useCaptureSession } from '../../lib/capture-session';
import { IdentifyOutcome, LifelistEntry } from '../../lib/types';

const PHOTO = Asset.fromModule(require('../../assets/dev/raccoon.jpg')).uri;

// The Figma sample: a raccoon with three other matches.
const OUTCOME: IdentifyOutcome = {
  best: {
    commonName: 'Raccoon',
    scientificName: 'Procyon lotor',
    description:
      "A medium-sized mammal known for its distinctive black 'mask' of fur around its eyes and its bushy tail with rings. Raccoons are known for their dexterity and intelligence, often seen rummaging through trash or exploring urban areas.",
    categoryId: 'mammals',
    confidence: 0.95,
  },
  alternates: [
    { commonName: 'Coatimundi', scientificName: 'Nasua nasua', description: 'A ring-tailed relative of the raccoon with a long, upturned snout.', categoryId: 'mammals', confidence: 0.7 },
    {
      commonName: 'Opossum',
      scientificName: 'Didelphimorphia',
      description:
        'Opossums are small to medium-sized marsupials with a distinctive appearance. They have a pointed snout, rounded ears, and a long, hairless, prehensile tail.',
      categoryId: 'mammals',
      confidence: 0.5,
    },
    { commonName: 'Kinkajou', scientificName: 'Potos flavus', description: 'A tree-dwelling rainforest mammal with a long gripping tail.', categoryId: 'mammals', confidence: 0.4 },
  ],
};

const ENTRY: LifelistEntry = {
  id: 'procyon-lotor',
  commonName: 'Raccoon',
  scientificName: 'Procyon lotor',
  description: OUTCOME.best.description,
  categoryId: 'mammals',
  photoUri: PHOTO,
  firstSeenAt: new Date().toISOString(),
  lastSeenAt: new Date().toISOString(),
  sightingCount: 1,
  location: null,
};

type Screen = 'camera' | 'identifying' | 'unsure' | 'offline' | 'result' | 'celebration';

/**
 * The capture screens with a sample photo and identification, reachable without
 * a server — for checking the layout in the browser preview. Dev builds only.
 * `/dev/capture?screen=result` (default camera). Confirm on `result` really
 * saves the sample to the life list.
 */
export default function CapturePreview() {
  const { screen = 'camera' } = useLocalSearchParams<{ screen?: Screen }>();
  const router = useRouter();
  const { setPhoto, setOutcome, setCelebration, outcome } = useCaptureSession();
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    if (screen !== 'result' && screen !== 'celebration') return;
    setPhoto(PHOTO, 'sample');
    setOutcome(OUTCOME);
    if (screen === 'celebration') {
      setCelebration({ entry: ENTRY, isNewSpecies: true, streak: 1, xpEarned: 70, badge: null, speciesNumber: 1 });
    }
    setSeeded(true);
  }, [screen]);

  if (!__DEV__) return <Redirect href="/" />;

  switch (screen) {
    case 'identifying':
      return <IdentifyingView photoUri={PHOTO} />;
    case 'unsure':
    case 'offline':
      return (
        <>
          <IdentifyingView photoUri={PHOTO} busy={false} />
          <FailurePopup
            failure={FAILURES[screen]}
            canRetry
            onRetry={() => {}}
            onRetake={() => router.replace('/dev/capture')}
            onClose={() => router.replace('/dev/components')}
          />
        </>
      );
    case 'result':
    case 'celebration':
      return seeded && outcome ? <ResultScreen /> : null;
    default:
      return <CaptureScreen />;
  }
}
