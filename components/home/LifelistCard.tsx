import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { LockIcon, Wash } from '../ui';
import { colors, type } from '../../lib/theme';

type Props =
  | { kind: 'found'; name: string; photoUri: string; onPress: () => void }
  | { kind: 'locked'; image: ImageSourcePropType };

/**
 * One card in Home's life list (88384:3217): a found species with its own
 * photo and name, or a locked teaser with "Not found yet".
 */
export function LifelistCard(props: Props) {
  if (props.kind === 'locked') {
    return (
      <View style={styles.slot} accessible accessibilityLabel="Not found yet">
        <Wash style={styles.card}>
          <Image source={props.image} style={styles.photo} />
          <View style={styles.label}>
            <LockIcon />
            <Text style={type.captionSm}>Not found yet</Text>
          </View>
        </Wash>
      </View>
    );
  }

  return (
    <Pressable
      onPress={props.onPress}
      accessibilityRole="button"
      accessibilityLabel={props.name}
      style={({ pressed }) => [styles.slot, pressed && styles.pressed]}
    >
      <Wash style={styles.card}>
        {props.photoUri ? (
          <Image source={{ uri: props.photoUri }} style={styles.photo} />
        ) : (
          // The photo is still on its way down from the server.
          <View style={[styles.photo, styles.photoPending]} />
        )}
        <View style={styles.label}>
          <Text style={[type.captionSm, styles.name]} numberOfLines={1}>
            {props.name}
          </Text>
        </View>
      </Wash>
    </Pressable>
  );
}

/** Keeps a short last row's cards the same width as the rest. */
export function LifelistCardSpacer() {
  return <View style={styles.slot} />;
}

const styles = StyleSheet.create({
  slot: {
    flex: 1,
  },
  card: {
    flex: 1,
    padding: 2,
    gap: 4,
    borderRadius: 8,
  },
  pressed: {
    opacity: 0.8,
  },
  photo: {
    width: '100%',
    height: 110,
    borderRadius: 6,
  },
  photoPending: {
    backgroundColor: colors.fill,
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
  },
  name: {
    flexShrink: 1,
  },
});
