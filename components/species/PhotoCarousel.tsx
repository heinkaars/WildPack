import { useRef, useState } from 'react';
import { FlatList, Image, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, Pressable, StyleSheet, View } from 'react-native';
import { ChevronLeft, ChevronRight } from '../ui';
import { Sighting } from '../../lib/types';
import { colors, radii } from '../../lib/theme';

type Props = {
  sightings: Sighting[];
  index: number;
  onIndexChange: (index: number) => void;
};

const HEIGHT = 375;

/**
 * The species page photo. With two or more captures it swipes between them,
 * with arrows on the sides and dots underneath; with one it is just the photo.
 * Not in Figma, which draws a single photo; the arrows reuse the chevrons.
 */
export function PhotoCarousel({ sightings, index, onIndexChange }: Props) {
  const list = useRef<FlatList<Sighting>>(null);
  const [width, setWidth] = useState(0);
  const many = sightings.length > 1;

  function goTo(next: number) {
    const clamped = Math.max(0, Math.min(sightings.length - 1, next));
    list.current?.scrollToOffset({ offset: clamped * width, animated: true });
    onIndexChange(clamped);
  }

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    if (width === 0) return;
    const settled = Math.round(event.nativeEvent.contentOffset.x / width);
    if (settled !== index && settled >= 0 && settled < sightings.length) onIndexChange(settled);
  }

  return (
    <View style={styles.frame} onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}>
      {width > 0 && (
        <FlatList
          ref={list}
          data={sightings}
          keyExtractor={(sighting) => sighting.id}
          horizontal
          pagingEnabled
          scrollEnabled={many}
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={32}
          getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
          // Opens on the capture the page asked for (the life list's cover photo).
          initialScrollIndex={Math.min(index, Math.max(sightings.length - 1, 0))}
          renderItem={({ item, index: i }) =>
            item.photoUri ? (
              <Image
                source={{ uri: item.photoUri }}
                style={[styles.photo, { width }]}
                accessibilityLabel={many ? `Capture ${i + 1} of ${sightings.length}` : undefined}
                accessibilityIgnoresInvertColors
              />
            ) : (
              // The photo is still on its way down from the server.
              <View style={[styles.photo, styles.pending, { width }]} />
            )
          }
        />
      )}

      {many && (
        <>
          {index > 0 && <Arrow side="left" onPress={() => goTo(index - 1)} />}
          {index < sightings.length - 1 && <Arrow side="right" onPress={() => goTo(index + 1)} />}
          <View style={styles.dots} pointerEvents="none">
            {sightings.map((sighting, i) => (
              <View key={sighting.id} style={[styles.dot, i === index && styles.dotActive]} />
            ))}
          </View>
        </>
      )}
    </View>
  );
}

function Arrow({ side, onPress }: { side: 'left' | 'right'; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={side === 'left' ? 'Previous capture' : 'Next capture'}
      style={({ pressed }) => [styles.arrow, side === 'left' ? styles.arrowLeft : styles.arrowRight, pressed && styles.pressed]}
    >
      {side === 'left' ? <ChevronLeft strokeWidth={1.5} /> : <ChevronRight />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  frame: {
    height: HEIGHT,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: colors.fill,
  },
  photo: {
    height: HEIGHT,
  },
  pending: {
    backgroundColor: colors.fill,
  },
  arrow: {
    position: 'absolute',
    top: HEIGHT / 2 - 22,
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  arrowLeft: {
    left: 16,
  },
  arrowRight: {
    right: 16,
  },
  pressed: {
    opacity: 0.7,
  },
  dots: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  dotActive: {
    width: 20,
    backgroundColor: colors.surface,
  },
});
