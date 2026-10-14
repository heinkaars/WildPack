import { useState } from 'react';
import { FlatList, Image, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View } from 'react-native';
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
 * with dots underneath; with one it is just the photo. Not in Figma, which
 * draws a single photo.
 */
export function PhotoCarousel({ sightings, index, onIndexChange }: Props) {
  const [width, setWidth] = useState(0);
  const many = sightings.length > 1;

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    if (width === 0) return;
    const settled = Math.round(event.nativeEvent.contentOffset.x / width);
    if (settled !== index && settled >= 0 && settled < sightings.length) onIndexChange(settled);
  }

  return (
    <View style={styles.frame} onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}>
      {width > 0 && (
        <FlatList
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
        <View style={styles.dots} pointerEvents="none">
          {sightings.map((sighting, i) => (
            <View key={sighting.id} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
      )}
    </View>
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
