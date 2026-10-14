import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, ChevronLeft, ChevronRight, Gradient, Input, Popup, PopupButtons } from '../ui';
import { colors, radii, type } from '../../lib/theme';

/**
 * The pop-ups behind the species page's edit icons. Figma draws only the icons
 * (the handoff leaves "inline vs modal edit" open), so they reuse the pop-up
 * card, buttons and field from the Components page.
 */

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

type DateProps = {
  visible: boolean;
  /** ISO time of the sighting; the time of day is kept when the day changes. */
  value: string;
  onSave: (seenAt: string) => Promise<void>;
  onClose: () => void;
};

/** A month calendar. Days after today can't be picked — a sighting can't be in the future. */
export function EditDatePopup({ visible, value, onSave, onClose }: DateProps) {
  const [picked, setPicked] = useState(() => new Date(value));
  const [month, setMonth] = useState(() => new Date(value));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setPicked(new Date(value));
    setMonth(new Date(value));
  }, [visible, value]);

  const today = new Date();
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  // Monday-first grid: blanks before the 1st.
  const lead = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
  const cells: (number | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const atCurrentMonth = year === today.getFullYear() && monthIndex === today.getMonth();

  async function save() {
    setSaving(true);
    try {
      await onSave(picked.toISOString());
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Popup visible={visible} onClose={saving ? undefined : onClose} style={styles.card}>
      <Text style={type.headingM} accessibilityRole="header">
        When did you see it?
      </Text>

      <View style={styles.calendar}>
        <View style={styles.monthRow}>
          <Pressable
            onPress={() => setMonth(new Date(year, monthIndex - 1, 1))}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Previous month"
          >
            <ChevronLeft />
          </Pressable>
          <Text style={type.levelSemiBold}>
            {month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
          </Text>
          <Pressable
            onPress={() => setMonth(new Date(year, monthIndex + 1, 1))}
            disabled={atCurrentMonth}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Next month"
            style={atCurrentMonth && styles.disabled}
          >
            <ChevronRight />
          </Pressable>
        </View>

        <View style={styles.grid}>
          {WEEKDAYS.map((day, i) => (
            <View key={`h${i}`} style={styles.cell}>
              <Text style={[type.labelSm, styles.weekday]}>{day}</Text>
            </View>
          ))}
          {cells.map((day, i) => {
            if (day === null) return <View key={`b${i}`} style={styles.cell} />;
            const date = new Date(year, monthIndex, day);
            const selected = sameDay(date, picked);
            const future = date > today && !sameDay(date, today);
            return (
              <Pressable
                key={day}
                disabled={future}
                onPress={() => {
                  const next = new Date(picked);
                  next.setFullYear(year, monthIndex, day);
                  setPicked(next);
                }}
                accessibilityRole="button"
                accessibilityState={{ selected, disabled: future }}
                accessibilityLabel={date.toLocaleDateString(undefined, { dateStyle: 'long' } as any)}
                style={styles.cell}
              >
                {selected ? (
                  <Gradient style={styles.day}>
                    <Text style={[type.label, styles.dayTextSelected]}>{day}</Text>
                  </Gradient>
                ) : (
                  <View style={styles.day}>
                    <Text style={[type.label, future && styles.future]}>{day}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      <PopupButtons>
        <Button label="Cancel" variant="outline" size="compact" onPress={onClose} disabled={saving} style={styles.flex} />
        <Button label="Save" size="compact" onPress={save} loading={saving} style={styles.flex} />
      </PopupButtons>
    </Popup>
  );
}

type PlaceProps = {
  visible: boolean;
  value: string | null;
  onSave: (location: string | null) => Promise<void>;
  onClose: () => void;
};

/** A free-text place name. Saving it empty clears it back to "Location not recorded". */
export function EditPlacePopup({ visible, value, onSave, onClose }: PlaceProps) {
  const [text, setText] = useState(value ?? '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) setText(value ?? '');
  }, [visible, value]);

  async function save() {
    setSaving(true);
    try {
      await onSave(text.trim() ? text.trim().slice(0, 120) : null);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Popup visible={visible} onClose={saving ? undefined : onClose} style={styles.card}>
      <Text style={type.headingM} accessibilityRole="header">
        Where did you see it?
      </Text>
      <Input
        value={text}
        onChangeText={setText}
        placeholder="e.g. Vondelpark, Amsterdam"
        autoFocus
        returnKeyType="done"
        onSubmitEditing={save}
        accessibilityLabel="Place"
        style={styles.field}
      />
      <PopupButtons>
        <Button label="Cancel" variant="outline" size="compact" onPress={onClose} disabled={saving} style={styles.flex} />
        <Button label="Save" size="compact" onPress={save} loading={saving} style={styles.flex} />
      </PopupButtons>
    </Popup>
  );
}

const CELL = `${100 / 7}%` as const;

const styles = StyleSheet.create({
  card: { paddingHorizontal: 20 },
  calendar: { alignSelf: 'stretch', gap: 8 },
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: CELL, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  weekday: { color: colors.textMuted },
  day: {
    width: 36,
    height: 36,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayTextSelected: { color: colors.textOnPrimary },
  future: { color: colors.textDisabled },
  disabled: { opacity: 0.3 },
  field: { alignSelf: 'stretch' },
  flex: { flex: 1 },
});
