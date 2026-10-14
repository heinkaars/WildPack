import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Asset } from 'expo-asset';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { SpeciesView } from '../../components/species/SpeciesView';
import { AskView, ChatMessage } from '../../components/species/AskView';
import { LifelistEntry } from '../../lib/types';

const RACCOON = Asset.fromModule(require('../../assets/dev/raccoon.jpg')).uri;

const SAMPLE: LifelistEntry = {
  id: 'procyon-lotor',
  commonName: 'Raccoon',
  scientificName: 'Procyon lotor',
  description:
    "A medium-sized mammal known for its distinctive black 'mask' of fur around its eyes and its bushy tail with rings. Raccoons are known for their dexterity and intelligence, often seen rummaging through trash or exploring urban areas.",
  categoryId: 'mammals',
  photoUri: RACCOON,
  firstSeenAt: new Date(2026, 7, 26, 10).toISOString(),
  lastSeenAt: new Date(2026, 7, 26, 10).toISOString(),
  sightingCount: 1,
  location: null,
};

const CHAT: ChatMessage[] = [
  { id: '1', role: 'user', text: 'Were do raccoons live' },
  {
    id: '2',
    role: 'assistant',
    text: 'Raccoons (Procyon lotor) are highly adaptable creatures found primarily in North America, from southern Canada to central Mexico. They thrive in diverse habitats, including forests, wetlands, urban areas, and suburban neighborhoods, often near water sources.',
  },
  { id: '3', role: 'user', text: 'How many types of raccoons there are' },
];

const OFF_TOPIC: ChatMessage[] = [
  { id: '1', role: 'user', text: 'What do red squirrels eat?' },
  {
    id: '2',
    role: 'assistant',
    offTopic: true,
    text: "We are discussing the raccoon, not the red squirrel, so let's focus on the unique characteristics and behaviors that distinguish raccoons from other similar animals.",
  },
];

type Screen = 'species' | 'ask' | 'ask-empty' | 'ask-off-topic' | 'ask-error';

/**
 * The species page and the Ask chat with sample data, reachable without a
 * server. Dev builds only.
 * `/dev/species?screen=species|ask|ask-empty|ask-off-topic|ask-error` (default species).
 */
export default function SpeciesPreview() {
  const { screen = 'species' } = useLocalSearchParams<{ screen?: Screen }>();
  const router = useRouter();
  const [entry, setEntry] = useState(SAMPLE);
  const [extra, setExtra] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);

  if (!__DEV__) return <Redirect href="/" />;

  if (screen === 'species') {
    return (
      <SpeciesView
        entry={entry}
        onBack={() => {}}
        onAsk={() => router.push('/dev/species?screen=ask')}
        onChangeDate={async (seenAt) => setEntry((e) => ({ ...e, firstSeenAt: seenAt }))}
        onChangeLocation={async (location) => setEntry((e) => ({ ...e, location }))}
      />
    );
  }

  const base = screen === 'ask' ? CHAT : screen === 'ask-off-topic' ? OFF_TOPIC : [];
  // The real chat is a see-through screen over the species page; here both are drawn on one.
  return (
    <View style={StyleSheet.absoluteFill}>
      <SpeciesView
        entry={entry}
        onBack={() => {}}
        onAsk={() => {}}
        onChangeDate={async () => {}}
        onChangeLocation={async () => {}}
      />
      <View style={StyleSheet.absoluteFill}>
        <AskView
          speciesName="Raccoon"
          userName="Hein"
          docent="lion"
          messages={[...base, ...extra]}
          sending={screen === 'ask' || sending}
          error={screen === 'ask-error' ? 'Could not get an answer right now. Try again in a moment.' : null}
          onSend={(question) => {
            setExtra((prev) => [...prev, { id: String(Date.now()), role: 'user', text: question }]);
            setSending(true);
            setTimeout(() => {
              setSending(false);
              setExtra((prev) => [
                ...prev,
                {
                  id: `${Date.now()}a`,
                  role: 'assistant',
                  text: 'Preview only: no answer here.',
                },
              ]);
            }, 1500);
          }}
          onClose={() => router.replace('/dev/species')}
        />
      </View>
    </View>
  );
}
