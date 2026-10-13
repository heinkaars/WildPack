import { StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradient } from '../../lib/theme';

type Props = {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

/** The brand "PrimaryGradient" fill: orange at the top fading to warning red. */
export function Gradient({ style, children }: Props) {
  return (
    <LinearGradient colors={gradient.colors} start={gradient.start} end={gradient.end} style={style}>
      {children}
    </LinearGradient>
  );
}
