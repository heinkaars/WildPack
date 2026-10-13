import { Image, ImageSourcePropType, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, palette, radii, sizes } from '../../lib/theme';

export type BadgeId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

/**
 * The 13 badge animals from Figma (Badge 01–13). Icons are white-on-clear
 * masks so one file serves both states; the tile tints them.
 */
export const BADGES: Record<BadgeId, { icon: ImageSourcePropType; tile: string }> = {
  1: { icon: require('../../assets/badges/badge-01.png'), tile: '#FDF5A6' },
  2: { icon: require('../../assets/badges/badge-02.png'), tile: '#FBE6C2' },
  3: { icon: require('../../assets/badges/badge-03.png'), tile: '#FAF1CA' },
  4: { icon: require('../../assets/badges/badge-04.png'), tile: '#F5E2D4' },
  5: { icon: require('../../assets/badges/badge-05.png'), tile: '#D3E7DE' },
  6: { icon: require('../../assets/badges/badge-06.png'), tile: '#E2FCC3' },
  7: { icon: require('../../assets/badges/badge-07.png'), tile: '#FFF9D8' },
  8: { icon: require('../../assets/badges/badge-08.png'), tile: '#FFDADA' },
  9: { icon: require('../../assets/badges/badge-09.png'), tile: '#FCF2E5' },
  10: { icon: require('../../assets/badges/badge-10.png'), tile: '#EAE2D6' },
  11: { icon: require('../../assets/badges/badge-11.png'), tile: '#F5E8D4' },
  12: { icon: require('../../assets/badges/badge-12.png'), tile: '#F9D2BA' },
  13: { icon: require('../../assets/badges/badge-13.png'), tile: '#F9F0E0' },
};

type Props = {
  badge: BadgeId;
  /** Earned badges get their own pastel tile and an orange icon; locked ones are grey. */
  earned: boolean;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function BadgeTile({ badge, earned, size = sizes.badge, style }: Props) {
  const { icon, tile } = BADGES[badge];
  const iconSize = size / 2;
  return (
    <View
      style={[
        styles.tile,
        { width: size, height: size, backgroundColor: earned ? tile : colors.fillStrong },
        style,
      ]}
      accessibilityLabel={earned ? `Badge ${badge}, earned` : `Badge ${badge}, locked`}
    >
      <Image
        source={icon}
        style={{ width: iconSize, height: iconSize, tintColor: earned ? palette.badgeIcon : colors.text }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
