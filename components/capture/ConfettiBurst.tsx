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
import { absoluteFill } from '../../lib/theme';
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

// How far past its resting place the confetti flies before it falls back.
const PEAK_SCALE = 2.6;

type LayerProps = {
  index: number;
  fill: string;
  paths: string[];
  /** 0 → 1: the explosion, fast and hard. */
  pop: SharedValue<number>;
  /** 0 → 1: the pieces settling back from the peak to where Figma draws them. */
  settle: SharedValue<number>;
  /** 0 → 1 → 0, forever: the gentle drift afterwards. */
  drift: SharedValue<number>;
};

function ConfettiLayer({ index, fill, paths, pop, settle, drift }: LayerProps) {
  // Fixed per layer, so each colour drifts out of step with the others.
  const sign = index % 2 === 0 ? 1 : -1;
  const lag = 0.07 * index;

  const style = useAnimatedStyle(() => {
    // Staggered a little so the colours leave the docent in waves, not as one block.
    const p = Math.min(1, Math.max(0, (pop.value - lag) / (1 - lag)));
    const out = p * (1 - settle.value);
    const wave = drift.value - 0.5;
    return {
      opacity: Math.min(1, p * 4),
      transform: [
        { translateX: wave * 6 * sign },
        // Thrown up, then it sags as it settles, like it has weight.
        { translateY: wave * (7 + index) * -sign - p * 10 * (1 - settle.value) },
        { rotate: `${wave * (8 + index * 2) * sign + (1 - p) * 240 * sign}deg` },
        { scale: 0.05 + (1 - 0.05) * p + (PEAK_SCALE - 1) * out + wave * 0.08 },
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
  const pop = useSharedValue(reduceMotion ? 1 : 0);
  const settle = useSharedValue(reduceMotion ? 1 : 0);
  const drift = useSharedValue(0.5);

  useEffect(() => {
    if (reduceMotion) return;
    // Waits a beat for the card's spring-in, then explodes: a hard, fast throw
    // out to well past the resting place, then a slower fall back into it.
    pop.value = withDelay(150, withTiming(1, { duration: 450, easing: Easing.out(Easing.exp) }));
    settle.value = withDelay(
      520,
      withTiming(1, { duration: 1300, easing: Easing.out(Easing.cubic) }),
    );
    drift.value = withDelay(
      1800,
      withRepeat(withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.sin) }), -1, true),
    );
  }, [reduceMotion]);

  return (
    <View style={[styles.box, style]} pointerEvents="none">
      {LAYERS.map((layer, i) => (
        <ConfettiLayer key={layer.fill} index={i} {...layer} pop={pop} settle={settle} drift={drift} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { width: WIDTH, height: HEIGHT },
  layer: { ...absoluteFill },
});
