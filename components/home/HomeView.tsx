import { ReactNode, useMemo, useState } from 'react';
import { FlatList, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNav, Docent, docentFromLook, FilterIcon, ScreenStatusBar, StarIcon } from '../ui';
import { BadgeShelf } from './BadgeShelf';
import { FilterPopup } from './FilterPopup';
import { LifelistCard, LifelistCardSpacer } from './LifelistCard';
import { OverviewCard } from './OverviewCard';
import { categoryById } from '../../lib/categories';
import { applyView, DEFAULT_VIEW, isDefaultView, LifelistView } from '../../lib/lifelist-view';
import { teasersStillHidden } from '../../lib/teasers';
import { LifelistEntry, Profile } from '../../lib/types';
import { Stats } from '../../lib/xp';
import { colors, fonts, spacing, type } from '../../lib/theme';

type Props = {
  profile: Profile;
  entries: LifelistEntry[];
  stats: Stats;
  onOpenProfile: () => void;
  onOpenSpecies: (id: string) => void;
  onCapture: () => void;
  /** Sync status and similar, shown under the overview card. */
  notices?: ReactNode;
  now?: Date;
};

type Card =
  | { kind: 'found'; entry: LifelistEntry }
  | { kind: 'locked'; key: string; image: ImageSourcePropType }
  | { kind: 'spacer'; key: string };

const COLUMNS = 3;
/** The bottom nav's height plus breathing room, so the last row can scroll clear of it. */
const NAV_CLEARANCE = 52 + 24;

function greeting(now: Date): string {
  const hour = now.getHours();
  if (hour < 12) return 'Good morning!';
  if (hour < 18) return 'Good afternoon!';
  return 'Good evening!';
}

/**
 * Figma Home 88384:2943: greeting and streak, the week / XP overview, the
 * badges and the life list, with the bottom nav floating over it. Takes its
 * data as props so `/dev/home` can show it without an account.
 */
export function HomeView({ profile, entries, stats, onOpenProfile, onOpenSpecies, onCapture, notices, now = new Date() }: Props) {
  const insets = useSafeAreaInsets();
  const [view, setView] = useState<LifelistView>(DEFAULT_VIEW);
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = !isDefaultView(view);

  const rows = useMemo(() => {
    const cards: Card[] = applyView(entries, view).map((entry) => ({ kind: 'found', entry }));
    // Teasers belong to the whole list; once it's filtered they would only mislead.
    if (!filtered) {
      for (const teaser of teasersStillHidden(entries)) {
        cards.push({ kind: 'locked', key: teaser.key, image: teaser.image });
      }
    }
    while (cards.length % COLUMNS !== 0) cards.push({ kind: 'spacer', key: `spacer-${cards.length}` });

    const chunked: Card[][] = [];
    for (let i = 0; i < cards.length; i += COLUMNS) chunked.push(cards.slice(i, i + COLUMNS));
    return chunked;
  }, [entries, view, filtered]);

  const categoryLabels = view.categories
    .map((id) => categoryById(id)?.label)
    .filter(Boolean)
    .join(', ');

  const header = (
    <View>
      <View style={styles.top}>
        <View style={styles.userRow}>
          <Pressable
            onPress={onOpenProfile}
            accessibilityRole="button"
            accessibilityLabel="Your profile"
            hitSlop={8}
            style={({ pressed }) => [styles.user, pressed && styles.pressed]}
          >
            <Docent animal={docentFromLook(profile.look)} width={40} />
            <View style={styles.userText}>
              <Text style={[type.bodySm, styles.muted]} numberOfLines={1}>
                {greeting(now)}
              </Text>
              <Text style={type.headingM} numberOfLines={1}>
                {profile.name}
              </Text>
            </View>
          </Pressable>

          <View style={styles.streak} accessible accessibilityLabel={`${stats.streak}-day streak`}>
            <StarIcon size={18} />
            <Text style={type.count}>{stats.streak}</Text>
          </View>
        </View>

        <OverviewCard stats={stats} now={now} />
        {notices}
      </View>

      <Text style={[type.headingM, styles.sectionTitle]} accessibilityRole="header">
        Badges
      </Text>
      <BadgeShelf xp={stats.xp} />

      <View style={styles.lifelistHeading}>
        <View style={styles.lifelistInfo}>
          <Text style={type.headingM} accessibilityRole="header">
            Life list
          </Text>
          <Text style={[type.bodySm, styles.muted]} numberOfLines={1}>
            {entries.length} in the Pack
            {categoryLabels ? ` · ${categoryLabels}` : ''}
          </Text>
        </View>
        <Pressable
          onPress={() => setFilterOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={filtered ? 'Filter, changed' : 'Filter'}
          style={({ pressed }) => [styles.filter, filtered && styles.filterOn, pressed && styles.pressed]}
        >
          <Text style={styles.filterText}>Filter</Text>
          <FilterIcon color={filtered ? colors.primary : colors.textSecondary} />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <ScreenStatusBar backgroundColor={colors.background} />

      <FlatList
        data={rows}
        keyExtractor={(row) => row.map(cardKey).join('|')}
        ListHeaderComponent={header}
        contentContainerStyle={{ paddingBottom: insets.bottom + NAV_CLEARANCE }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={[type.bodyLg, styles.muted, styles.empty]}>
            Nothing here yet{categoryLabels ? ` in ${categoryLabels}` : ''}.
          </Text>
        }
        renderItem={({ item: row }) => (
          <View style={styles.row}>
            {row.map((card) =>
              card.kind === 'found' ? (
                <LifelistCard
                  key={card.entry.id}
                  kind="found"
                  name={card.entry.commonName}
                  photoUri={card.entry.photoUri}
                  onPress={() => onOpenSpecies(card.entry.id)}
                />
              ) : card.kind === 'locked' ? (
                <LifelistCard key={card.key} kind="locked" image={card.image} />
              ) : (
                <LifelistCardSpacer key={card.key} />
              ),
            )}
          </View>
        )}
      />

      <BottomNav
        active="home"
        onHome={() => {}}
        onCapture={onCapture}
        style={[styles.nav, { bottom: Math.max(insets.bottom, spacing.md) }]}
      />

      <FilterPopup visible={filterOpen} view={view} onChange={setView} onClose={() => setFilterOpen(false)} />
    </View>
  );
}

function cardKey(card: Card): string {
  return card.kind === 'found' ? card.entry.id : card.key;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  top: {
    paddingTop: 16,
    paddingLeft: spacing.screen,
    paddingRight: 16,
    gap: 8,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  userText: {
    flexShrink: 1,
  },
  muted: {
    color: colors.textMuted,
  },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingLeft: 4,
    paddingRight: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.cream,
  },
  sectionTitle: {
    paddingTop: 20,
    paddingBottom: 12,
    paddingHorizontal: spacing.screen,
  },
  lifelistHeading: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 12,
    paddingHorizontal: spacing.screen,
  },
  lifelistInfo: {
    flexShrink: 1,
    marginRight: 12,
  },
  filter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.strokeStrong,
  },
  filterOn: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryFill,
  },
  filterText: {
    ...type.labelSm,
    fontFamily: fonts.bodyMedium,
    color: colors.textSecondary,
  },
  row: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: spacing.screen,
    marginBottom: 8,
  },
  empty: {
    paddingHorizontal: spacing.screen,
  },
  pressed: {
    opacity: 0.8,
  },
  nav: {
    position: 'absolute',
  },
});
