import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../lib/theme';

type Props = {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

/**
 * Figma's card wash ("Bg/spCard"): soft orange 30%, a lime glow rising from
 * the bottom and a white sheen from the bottom left. Used on the reward
 * pop-up's stats, Home's overview card and the life-list cards. Give it a
 * borderRadius in `style`; it clips its own corners.
 */
export function Wash({ style, children }: Props) {
  return (
    <View style={[styles.wash, style]}>
      <LinearGradient
        colors={['rgba(174, 255, 0, 0)', 'rgba(174, 255, 0, 0.3)']}
        locations={[0.36, 1]}
        start={{ x: 0.58, y: 0 }}
        end={{ x: 0.42, y: 1.15 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <LinearGradient
        colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.61)']}
        locations={[0.41, 0.98]}
        start={{ x: 0.81, y: 0.11 }}
        end={{ x: 0.19, y: 0.89 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wash: {
    overflow: 'hidden',
    backgroundColor: colors.wash,
  },
});
