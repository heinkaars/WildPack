import { Redirect, useLocalSearchParams } from 'expo-router';
import WelcomeScreen from '../onboarding/welcome';
import ChooseDocentScreen from '../onboarding/look';
import ChooseNameScreen from '../onboarding/name';
import WelcomeToPackScreen from '../onboarding/pack';
import FirstCaptureScreen from '../onboarding/first-capture';

const SCREENS = {
  welcome: WelcomeScreen,
  look: ChooseDocentScreen,
  name: ChooseNameScreen,
  pack: WelcomeToPackScreen,
  'first-capture': FirstCaptureScreen,
};

/**
 * The onboarding screens, reachable without a server — for checking the layout
 * in the browser preview. Dev builds only. `/dev/onboarding?screen=name`
 * (default welcome).
 */
export default function OnboardingPreview() {
  const { screen } = useLocalSearchParams<{ screen?: keyof typeof SCREENS }>();
  if (!__DEV__) return <Redirect href="/" />;
  const Screen = SCREENS[screen ?? 'welcome'] ?? WelcomeScreen;
  return <Screen />;
}
