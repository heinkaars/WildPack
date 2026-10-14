import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../../lib/theme';

type Props = {
  /** 0–1, as identification returns it. */
  confidence: number;
  /** The identification's own top pick ("Best guess") or one of the other matches ("Good guess"). */
  best: boolean;
};

/** Handoff "Confidence pill" — green, used on every species-ID card (Captured-species 88384:3492). */
export function ConfidencePill({ confidence, best }: Props) {
  return (
    <View style={styles.pill}>
      <Text style={styles.text} numberOfLines={1}>
        {best ? 'Best guess' : 'Good guess'} {Math.round(confidence * 100)}% confidence
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.successStroke,
    backgroundColor: colors.successFill,
  },
  text: { fontFamily: fonts.bodySemiBold, fontSize: 14, lineHeight: 21, color: colors.success },
});
