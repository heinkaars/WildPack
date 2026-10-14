import { useCallback, useState } from 'react';
import { Modal, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { useFocusEffect } from 'expo-router';
import { colors, spacing } from '../../lib/theme';
import { CloseIcon } from './icons';

type Props = {
  visible: boolean;
  /** Shows the close cross in the top-right corner. Also what Android's back button does. */
  onClose?: () => void;
  /** Springs the card in, for reward moments. */
  pop?: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * The white pop-up card over a 70% black backdrop (Figma "Input" pop-ups on
 * Capture-Camera-ON 88384:3868 and Captured-species-confirmPopup 88384:3517):
 * 350 wide, radius 16, 30px top and bottom, 20px between blocks.
 */
export function Popup({ visible, onClose, pop, children, style }: Props) {
  // A Modal floats above every screen, so one left open on a screen the user
  // has moved on from would cover the next. It shows only while its screen is
  // the one in front.
  const [focused, setFocused] = useState(true);
  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => setFocused(false);
    }, []),
  );
  return (
    <Modal visible={visible && focused} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View
          entering={pop ? ZoomIn.springify().damping(13).mass(0.85) : undefined}
          style={[styles.card, style]}
          accessibilityViewIsModal
        >
          {children}
          {onClose && (
            <Pressable
              onPress={onClose}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Close"
              style={styles.close}
            >
              <CloseIcon />
            </Pressable>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

/** Two buttons side by side at the foot of a pop-up. */
export function PopupButtons({ children }: { children: React.ReactNode }) {
  return <View style={styles.buttons}>{children}</View>;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.screen,
  },
  card: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: 30,
    alignItems: 'center',
    gap: 20,
  },
  close: { position: 'absolute', top: 16, right: 16 },
  buttons: { flexDirection: 'row', gap: 12, alignSelf: 'stretch' },
});
