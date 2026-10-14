import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Gradient, Popup, PopupButtons, Radio } from '../ui';
import { CATEGORIES } from '../../lib/categories';
import { DEFAULT_VIEW, LifelistView, SORT_OPTIONS, toggleCategory } from '../../lib/lifelist-view';
import { colors, radii, type } from '../../lib/theme';

type Props = {
  visible: boolean;
  view: LifelistView;
  onChange: (view: LifelistView) => void;
  onClose: () => void;
};

/**
 * Behind the life list's Filter button: any number of categories and a sort
 * order. Not in Figma (only the button is), so it reuses the pop-up card and
 * the controls from the Components page. Changes apply as they are tapped.
 */
export function FilterPopup({ visible, view, onChange, onClose }: Props) {
  // "All" is simply no category picked; tapping it clears the rest.
  const chips = [
    { key: 'all', label: 'All', selected: view.categories.length === 0, onPress: () => onChange({ ...view, categories: [] }) },
    ...CATEGORIES.map((category) => ({
      key: category.id,
      label: category.label,
      selected: view.categories.includes(category.id),
      onPress: () => onChange(toggleCategory(view, category.id)),
    })),
  ];

  return (
    <Popup visible={visible} onClose={onClose} style={styles.card}>
      <Text style={type.headingM} accessibilityRole="header">
        Filter
      </Text>

      <View style={styles.section}>
        <Text style={type.levelSemiBold}>Category</Text>
        <View style={styles.chips}>
          {chips.map(({ key, label, selected, onPress }) => {
            return (
              <Pressable
                key={key}
                onPress={onPress}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selected }}
                style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
              >
                {selected ? (
                  <Gradient style={styles.chipFill}>
                    <Text style={[type.label, styles.chipTextSelected]}>{label}</Text>
                  </Gradient>
                ) : (
                  <View style={[styles.chipFill, styles.chipIdle]}>
                    <Text style={type.label}>{label}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={type.levelSemiBold}>Sort by</Text>
        {SORT_OPTIONS.map((option) => {
          const selected = view.sort === option.id;
          const choose = () => onChange({ ...view, sort: option.id });
          return (
            <Pressable key={option.id} onPress={choose} style={styles.sortRow} accessibilityRole="radio" accessibilityState={{ checked: selected }}>
              <Radio checked={selected} onChange={choose} accessibilityLabel={option.label} />
              <Text style={type.bodyLg}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <PopupButtons>
        <Button label="Reset" variant="outline" size="compact" onPress={() => onChange(DEFAULT_VIEW)} style={styles.flex} />
        <Button label="Done" size="compact" onPress={onClose} style={styles.flex} />
      </PopupButtons>
    </Popup>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'stretch',
  },
  section: {
    gap: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  chipFill: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipIdle: {
    borderWidth: 1,
    borderColor: colors.strokeStrong,
  },
  chipTextSelected: {
    color: colors.textOnPrimary,
  },
  pressed: {
    opacity: 0.8,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  flex: {
    flex: 1,
  },
});
