import { useEffect } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { CONFETTI_XML } from './confetti';

// Drawn on the same 159.785 × 91.2 box as Figma's confetti
// (Captured-species-confirmPopup 88384:3522), centred on the docent.
const WIDTH = 159.785;
const HEIGHT = 91.1999;

/**
 * Figma's confetti is one SVG of small coloured shapes. They are grouped by
 * colour into layers; each layer is a view that can be scaled, turned and moved
 * with ordinary view transforms, which is what makes the burst and the drift.
 */
const LAYERS = Object.values(
  [...CONFETTI_XML.matchAll(/<path d="([^"]+)" fill="([^"]+)"/g)].reduce<
    Record<string, { fill: string; paths: string[] }>
  >((groups, [, d, fill]) => {
    (groups[fill] ??= { fill, paths: [] }).paths.push(d);
    return groups;
  }, {}),
);

type LayerProps = {
  index: number;
  fill: string;
  paths: string[];
  burst: SharedValue<number>;
  drift: SharedValue<number>;
};

function ConfettiLayer({ index, fill, paths, burst, drift }: LayerProps) {
  // Fixed per layer, so each colour drifts out of step with the others.
  const sign = index % 2 === 0 ? 1 : -1;
  const lag = 0.12 * index;

  const style = useAnimatedStyle(() => {
    // Staggered a little so the colours don't leave the docent as one block.
    const b = Math.min(1, Math.max(0, (burst.value - lag) / (1 - lag)));
    const wave = drift.value - 0.5;
    return {
      opacity: Math.min(1, b * 3),
      transform: [
        { translateX: wave * 5 * sign },
        { translateY: wave * (6 + index) * -sign },
        { rotate: `${wave * (6 + index * 2) * sign + (1 - b) * 60 * sign}deg` },
        { scale: 0.15 + 0.85 * b + wave * 0.06 },
      ],
    };
  });

  return (
    <Animated.View style={[styles.layer, style]}>
      <Svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        {paths.map((d, i) => (
          <Path key={i} d={d} fill={fill} />
        ))}
      </Svg>
    </Animated.View>
  );
}

/**
 * The reward confetti: bursts out from behind the docent as the pop-up lands,
 * then keeps drifting gently. Holds still for people who have reduced motion on.
 */
export function ConfettiBurst({ style }: { style?: StyleProp<ViewStyle> }) {
  const reduceMotion = useReducedMotion();
  const burst = useSharedValue(reduceMotion ? 1 : 0);
  const drift = useSharedValue(0.5);

  useEffect(() => {
    if (reduceMotion) return;
    // Waits a beat for the card's spring-in, then bursts.
    burst.value = withDelay(180, withTiming(1, { duration: 1000, easing: Easing.out(Easing.cubic) }));
    drift.value = withDelay(
      1000,
      withRepeat(withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.sin) }), -1, true),
    );
  }, [reduceMotion]);

  return (
    <View style={[styles.box, style]} pointerEvents="none">
      {LAYERS.map((layer, i) => (
        <ConfettiLayer key={layer.fill} index={i} {...layer} burst={burst} drift={drift} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { width: WIDTH, height: HEIGHT },
  layer: { ...StyleSheet.absoluteFillObject },
});
