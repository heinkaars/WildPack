import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SvgXml } from 'react-native-svg';
import { BoltIcon, Button, Docent, docentFromLook, Popup, SpeciesIcon, StarIcon, Wash } from '../ui';
import { useLifelist } from '../../lib/lifelist-store';
import { useRewardFeedback } from '../../lib/use-reward';
import { CelebrationPayload } from '../../lib/types';
import { colors, fonts, type } from '../../lib/theme';
import { CONFETTI_XML } from './confetti';

type Props = {
  payload: CelebrationPayload;
  /** False once "Add To Life List" is tapped, so the pop-up closes before anything opens. */
  visible: boolean;
  onContinue: () => void;
  /** The pop-up has finished closing; safe to open the next screen. */
  onDismissed: () => void;
};

/** Plays the haptics and chime once, when the pop-up appears. */
function RewardFeedback() {
  useRewardFeedback();
  return null;
}

/**
 * Figma Captured-species-confirmPopup 88384:3517: the docent in confetti, the
 * species card and three stat rows, over the result screen.
 */
export function CelebrationPopup({ payload, visible, onContinue, onDismissed }: Props) {
  const { profile } = useLifelist();
  const { entry, isNewSpecies, streak, xpEarned: xp, speciesNumber } = payload;

  const stats = [
    {
      icon: <SpeciesIcon />,
      text: isNewSpecies ? `Species #${speciesNumber}` : `Seen ${entry.sightingCount} times`,
    },
    { icon: <StarIcon />, text: `${streak}-day streak` },
    { icon: <BoltIcon />, text: `+${xp} XP earned` },
  ];

  return (
    <Popup visible={visible} pop onDismissed={onDismissed}>
      <RewardFeedback />

      <View style={styles.header}>
        <View style={styles.docent}>
          <Docent animal={docentFromLook(profile.look)} width={74} />
          <SvgXml xml={CONFETTI_XML} width={159.785} height={91.2} style={styles.confetti} pointerEvents="none" />
        </View>
        <Text style={[type.headingM, styles.center]} accessibilityRole="header">
          Congratulations!
        </Text>
      </View>

      <Wash style={styles.stats}>
        <View style={styles.speciesCard}>
          {entry.photoUri ? <Image source={{ uri: entry.photoUri }} style={styles.speciesPhoto} /> : null}
          <View style={styles.speciesText}>
            <Text style={styles.speciesName} numberOfLines={2}>
              {entry.commonName}
            </Text>
            <Text style={[type.labelSm, styles.muted]}>{isNewSpecies ? 'NEW SPECIES' : 'SEEN AGAIN'}</Text>
          </View>
        </View>

        <View style={styles.statColumn}>
          {stats.map((stat, i) => (
            <Animated.View
              key={stat.text}
              entering={FadeInDown.delay(240 + i * 100).springify().damping(15)}
              style={styles.stat}
            >
              {stat.icon}
              <Text style={type.bodySm} numberOfLines={1}>
                {stat.text}
              </Text>
            </Animated.View>
          ))}
        </View>
      </Wash>

      <Button label="Add To Life List" onPress={onContinue} style={styles.button} />
    </Popup>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: 'center' },
  muted: { color: colors.textMuted },

  header: { alignItems: 'center', gap: 12 },
  docent: { width: 74, height: 82, alignItems: 'center', justifyContent: 'flex-end' },
  confetti: { position: 'absolute', left: -43.2, top: -4.6 },

  stats: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    gap: 4,
    padding: 8,
    borderRadius: 12,
  },
  speciesCard: {
    width: 129,
    padding: 4,
    gap: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  speciesPhoto: { width: '100%', height: 72, borderRadius: 6, backgroundColor: colors.fill },
  speciesText: { alignItems: 'center', gap: 4, paddingBottom: 4 },
  speciesName: {
    fontFamily: fonts.heading,
    fontSize: 20,
    lineHeight: 22,
    letterSpacing: -0.4,
    color: colors.text,
    textAlign: 'center',
  },
  statColumn: { flex: 1, gap: 4 },
  stat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  button: { alignSelf: 'stretch' },
});
