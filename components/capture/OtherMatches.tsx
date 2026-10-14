import { Fragment, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronDown, ChevronUp } from '../ui';
import { SpeciesGuess } from '../../lib/types';
import { colors, fonts } from '../../lib/theme';

type Props = {
  /** Every guess except the one on screen, best first. */
  others: SpeciesGuess[];
  /** The guess the user chose from this list, if any — the closed pill then names it. */
  picked: SpeciesGuess | null;
  onPick: (guess: SpeciesGuess) => void;
  /** Called once the list has opened, so the screen can scroll it into view. */
  onOpen?: () => void;
};

/**
 * Figma "See other matches": a soft orange pill (Captured-species 88384:3495)
 * that opens into a rounded panel of names and confidences
 * (Captured-species-otherOption 88384:3608). Once a match is picked, the closed
 * pill shows its name (…-GsOpossum 88384:3645).
 */
export function OtherMatches({ others, picked, onPick, onOpen }: Props) {
  const [open, setOpen] = useState(false);
  if (others.length === 0) return null;

  return (
    <View style={[styles.panel, open && styles.panelOpen]}>
      <Pressable
        onPress={() => {
          // After the rows have laid out, or there is nothing new to scroll to.
          if (!open) setTimeout(() => onOpen?.(), 50);
          setOpen(!open);
        }}
        style={styles.toggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={open ? 'Hide other matches' : 'See other matches'}
      >
        <Text style={[styles.text, styles.flex]} numberOfLines={1}>
          {picked ? picked.commonName : 'See other matches'}
        </Text>
        {open ? <ChevronUp /> : <ChevronDown />}
      </Pressable>

      {open &&
        others.map((guess) => (
          <Fragment key={guess.scientificName}>
            <View style={styles.divider} />
            <Pressable
              onPress={() => {
                onPick(guess);
                setOpen(false);
              }}
              style={({ pressed }) => [styles.row, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel={`${guess.commonName}, ${Math.round(guess.confidence * 100)}% confidence`}
            >
              <Text style={[styles.text, styles.flex]} numberOfLines={1}>
                {guess.commonName}
              </Text>
              <Text style={styles.text}>{Math.round(guess.confidence * 100)}%</Text>
            </Pressable>
          </Fragment>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  panel: {
    alignSelf: 'stretch',
    minHeight: 56,
    justifyContent: 'center',
    padding: 16,
    gap: 8,
    borderRadius: 999,
    backgroundColor: colors.primaryFill,
  },
  panelOpen: { borderRadius: 12 },
  toggle: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 22 },
  pressed: { opacity: 0.6 },
  divider: { height: 1, backgroundColor: colors.fill },
  text: { fontFamily: fonts.bodySemiBold, fontSize: 14, lineHeight: 22, letterSpacing: -0.2, color: colors.text },
});
