import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackButton, CalendarIcon, EditIcon, Gradient, LocationIcon, SendIcon } from '../ui';
import { categoryById } from '../../lib/categories';
import { LifelistEntry, Sighting } from '../../lib/types';
import { colors, radii, spacing, type } from '../../lib/theme';
import { EditDatePopup, EditPlacePopup } from './EditSightingPopups';
import { PhotoCarousel } from './PhotoCarousel';

type Props = {
  entry: LifelistEntry;
  /** Every capture of the species, oldest first; empty until loaded. */
  sightings: Sighting[];
  /** The capture showing in the photo; its date and place fill the details card. */
  index: number;
  onIndexChange: (index: number) => void;
  onBack: () => void;
  /** Opens the Ask chat sheet. */
  onAsk: () => void;
  /** Both change the capture currently showing. */
  onChangeDate: (seenAt: string) => Promise<void>;
  onChangeLocation: (location: string | null) => Promise<void>;
};

/**
 * Figma species-Details 88384:3654: the photo, name with category and
 * sighting pills, description, the date/location card with edit icons, and
 * the "Ask about this …" field pinned to the bottom, which opens the chat.
 */
export function SpeciesView({ entry, sightings, index, onIndexChange, onBack, onAsk, onChangeDate, onChangeLocation }: Props) {
  const insets = useSafeAreaInsets();
  const [editing, setEditing] = useState<'date' | 'place' | null>(null);

  const category = categoryById(entry.categoryId);
  // Until the captures have loaded, the species' own summary stands in.
  const current: Sighting = sightings[index] ?? {
    id: '',
    photoUri: entry.photoUri,
    location: entry.location,
    seenAt: entry.firstSeenAt,
  };
  const seenOn = new Date(current.seenAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Re-mounted once the captures arrive, so it opens on the right one. */}
        <PhotoCarousel
          key={sightings.length > 0 ? 'captures' : 'summary'}
          sightings={sightings.length > 0 ? sightings : [current]}
          index={sightings.length > 0 ? index : 0}
          onIndexChange={onIndexChange}
        />

        <View style={styles.body}>
          <View style={styles.header}>
            <View style={styles.titles}>
              <Text style={type.headingM} numberOfLines={2} accessibilityRole="header">
                {entry.commonName}
              </Text>
              <Text style={[type.captionLg, styles.scientific]} numberOfLines={1}>
                {entry.scientificName}
              </Text>
            </View>
            <View style={styles.pills}>
              {category && (
                <View style={[styles.pill, styles.categoryPill]}>
                  <Text style={[type.bodySm, styles.categoryText]}>{category.label}</Text>
                </View>
              )}
              <View style={[styles.pill, styles.sightingPill]}>
                <Text style={[type.bodySm, styles.sightingText]}>
                  {entry.sightingCount} {entry.sightingCount === 1 ? 'sighting' : 'sightings'}
                </Text>
              </View>
            </View>
          </View>

          {entry.description ? <Text style={[type.bodySm, styles.description]}>{entry.description}</Text> : null}

          <View style={styles.details}>
            <DetailRow
              icon={<CalendarIcon />}
              text={seenOn}
              editLabel="Change date"
              onEdit={() => setEditing('date')}
            />
            <View style={styles.divider} />
            <DetailRow
              icon={<LocationIcon />}
              text={current.location ?? 'Location not recorded'}
              editLabel="Change location"
              onEdit={() => setEditing('place')}
            />
          </View>
        </View>
      </ScrollView>

      <BackButton onPress={onBack} style={[styles.back, { top: insets.top + 16 }]} />

      <View style={[styles.askBar, { paddingBottom: Math.max(insets.bottom, 16) + 4 }]}>
        <Pressable
          onPress={onAsk}
          accessibilityRole="button"
          accessibilityLabel={`Ask about this ${entry.commonName}`}
          style={({ pressed }) => [styles.ask, pressed && styles.pressed]}
        >
          <Text style={[type.bodySm, styles.askPlaceholder]} numberOfLines={1}>
            Ask about this {entry.commonName}...
          </Text>
          <Gradient style={styles.askSend}>
            <SendIcon />
          </Gradient>
        </Pressable>
      </View>

      <EditDatePopup
        visible={editing === 'date'}
        value={current.seenAt}
        onSave={onChangeDate}
        onClose={() => setEditing(null)}
      />
      <EditPlacePopup
        visible={editing === 'place'}
        value={current.location}
        onSave={onChangeLocation}
        onClose={() => setEditing(null)}
      />
    </View>
  );
}

function DetailRow({
  icon,
  text,
  editLabel,
  onEdit,
}: {
  icon: React.ReactNode;
  text: string;
  editLabel: string;
  onEdit: () => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        {icon}
        <Text style={[type.bodySm, styles.rowText]} numberOfLines={1}>
          {text}
        </Text>
      </View>
      <Pressable
        onPress={onEdit}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel={editLabel}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <EditIcon />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: 100 },
  back: { position: 'absolute', left: spacing.screen },
  body: { paddingHorizontal: spacing.screen, paddingTop: 20 },

  header: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  titles: { flex: 1, minWidth: 0 },
  scientific: { color: 'rgba(255, 153, 0, 0.9)' },
  pills: { flexDirection: 'row', gap: 4 },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  categoryPill: { backgroundColor: colors.primaryFill, borderColor: colors.primaryFillStrong },
  categoryText: { color: colors.primary },
  sightingPill: { backgroundColor: colors.successFill, borderColor: colors.successStroke },
  sightingText: { color: colors.success },

  description: { marginTop: 20, color: colors.textMuted },

  details: {
    marginTop: 20,
    padding: 16,
    gap: 8,
    borderRadius: 12,
    backgroundColor: colors.primaryFill,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 },
  rowText: { flexShrink: 1 },
  divider: { height: 1, backgroundColor: colors.fill },

  askBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.screen,
    paddingTop: 12,
    backgroundColor: colors.background,
  },
  ask: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.fill,
  },
  askPlaceholder: { flex: 1, color: colors.textMuted },
  askSend: { padding: 8, borderRadius: radii.pill },
  pressed: { opacity: 0.7 },
});
