import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  /** dark = dark clock/icons for light screens; light = white icons over photos or gradients. */
  tone?: 'dark' | 'light';
  /** Paints behind the status bar; leave unset to let the screen show through. */
  backgroundColor?: string;
};

/**
 * Figma's "Statusbar" is the phone's own bar (clock, signal, battery) and the
 * home indicator — the OS draws those. This sets their colour per screen and
 * reserves the space above the content, so screens don't hand-roll insets.
 */
export function ScreenStatusBar({ tone = 'dark', backgroundColor }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <>
      <StatusBar style={tone} />
      <View style={{ height: insets.top, backgroundColor }} />
    </>
  );
}
