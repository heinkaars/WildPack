import { Image, ImageSourcePropType, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { palette, radii } from '../../lib/theme';
import { Gradient } from './Gradient';
import { CheckCircleIcon } from './icons';

export type DocentAnimal = 'lion' | 'rhino' | 'gecko' | 'raccoon';
export const DOCENT_ANIMALS: DocentAnimal[] = ['lion', 'rhino', 'gecko', 'raccoon'];

type Art = { source: ImageSourcePropType; aspect: number };
const art = (source: ImageSourcePropType, w: number, h: number): Art => ({ source, aspect: h / w });

const PORTRAITS: Record<DocentAnimal, { happy: Art; sad: Art }> = {
  lion: {
    happy: art(require('../../assets/docents/lion-happy.png'), 300, 332),
    sad: art(require('../../assets/docents/lion-sad.png'), 297, 330),
  },
  rhino: {
    happy: art(require('../../assets/docents/rhino-happy.png'), 300, 315),
    sad: art(require('../../assets/docents/rhino-sad.png'), 298, 324),
  },
  gecko: {
    happy: art(require('../../assets/docents/gecko-happy.png'), 300, 311),
    sad: art(require('../../assets/docents/gecko-sad.png'), 298, 330),
  },
  raccoon: {
    happy: art(require('../../assets/docents/raccoon-happy.png'), 300, 316),
    sad: art(require('../../assets/docents/raccoon-sad.png'), 299, 316),
  },
};

const FULL_BODY: Record<DocentAnimal, ImageSourcePropType> = {
  lion: require('../../assets/docents/lion-full.png'),
  rhino: require('../../assets/docents/rhino-full.png'),
  gecko: require('../../assets/docents/gecko-full.png'),
  raccoon: require('../../assets/docents/raccoon-full.png'),
};

// Figma frames: portrait 97.4 × 107.6, full-body card 171 × 157.6.
const PORTRAIT_ASPECT = 107.6 / 97.4;
const CARD_ASPECT = 157.6 / 171;

type DocentProps = {
  animal: DocentAnimal;
  /** happy = the guide used across the app; sad = failures or a wrong species. */
  mood?: 'happy' | 'sad';
  width?: number;
  style?: StyleProp<ViewStyle>;
};

/** The circular docent portrait. Artwork is bottom-aligned so the rings line up across animals. */
export function Docent({ animal, mood = 'happy', width = 97, style }: DocentProps) {
  const { source, aspect } = PORTRAITS[animal][mood];
  return (
    <View style={[{ width, height: width * PORTRAIT_ASPECT, justifyContent: 'flex-end' }, style]}>
      <Image source={source} style={{ width, height: width * aspect }} />
    </View>
  );
}

type CardProps = {
  animal: DocentAnimal;
  selected: boolean;
  onPress: () => void;
  width?: number;
  style?: StyleProp<ViewStyle>;
};

/** Full-body docent for the onboarding picker; selected adds the brown card and check. */
export function DocentCard({ animal, selected, onPress, width = 171, style }: CardProps) {
  const scale = width / 171;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={animal}
      style={[
        styles.card,
        { width, height: width * CARD_ASPECT },
        selected && styles.cardSelected,
        style,
      ]}
    >
      <Image source={FULL_BODY[animal]} style={styles.fullBody} resizeMode="contain" />
      {selected && (
        <Gradient
          style={[
            styles.check,
            { top: 19.5 * scale, right: 26.5 * scale, width: 24 * scale, height: 24 * scale },
          ]}
        >
          <CheckCircleIcon size={12.67 * scale} />
        </Gradient>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 6,
  },
  cardSelected: {
    backgroundColor: palette.docentSelected,
  },
  fullBody: {
    flex: 1,
    width: '100%',
  },
  check: {
    position: 'absolute',
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
