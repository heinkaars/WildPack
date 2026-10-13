import { Redirect, useLocalSearchParams } from 'expo-router';
import SignInScreen from '../auth/sign-in';
import CreateAccountScreen from '../auth/create-account';
import ForgotPasswordScreen from '../auth/forgot-password';
import VerifyScreen from '../auth/verify';

const SCREENS = {
  'sign-in': SignInScreen,
  'create-account': CreateAccountScreen,
  'forgot-password': ForgotPasswordScreen,
  verify: VerifyScreen,
};

/**
 * The auth screens, reachable before onboarding and without a server — for
 * checking the layout in the browser preview. Dev builds only.
 * `/dev/auth?screen=create-account` (default sign-in).
 */
export default function AuthPreview() {
  const { screen } = useLocalSearchParams<{ screen?: keyof typeof SCREENS }>();
  if (!__DEV__) return <Redirect href="/" />;
  const Screen = SCREENS[screen ?? 'sign-in'] ?? SignInScreen;
  return <Screen />;
}
