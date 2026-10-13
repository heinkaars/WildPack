import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Baloo2_800ExtraBold } from '@expo-google-fonts/baloo-2';
import { FredokaOne_400Regular } from '@expo-google-fonts/fredoka-one';
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_600SemiBold_Italic,
  Nunito_700Bold,
  Nunito_900Black,
} from '@expo-google-fonts/nunito';
import { AuthProvider } from '../lib/auth';
import { LifelistProvider } from '../lib/lifelist-store';
import { CaptureSessionProvider } from '../lib/capture-session';
import { OnboardingGate, OnboardingProvider } from '../lib/onboarding';
import { colors } from '../lib/theme';

export default function RootLayout() {
  // Keys must match `fonts` in lib/theme.ts.
  const [fontsLoaded, fontError] = useFonts({
    FredokaOne_400Regular,
    Baloo2_800ExtraBold,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_600SemiBold_Italic,
    Nunito_700Bold,
    Nunito_900Black,
  });

  // Fonts are bundled, so this is a frame or two; on a load error fall back to system fonts.
  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <LifelistProvider>
            <OnboardingProvider>
              <CaptureSessionProvider>
                <StatusBar style="dark" />
                <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="onboarding/welcome" />
                  <Stack.Screen name="onboarding/look" />
                  <Stack.Screen name="onboarding/name" />
                  <Stack.Screen name="onboarding/first-capture" />
                  <Stack.Screen name="account" options={{ presentation: 'modal' }} />
                  <Stack.Screen name="auth/sign-in" />
                  <Stack.Screen name="auth/create-account" />
                  <Stack.Screen name="auth/forgot-password" />
                  <Stack.Screen name="auth/verify" />
                  <Stack.Screen name="capture/index" />
                  <Stack.Screen name="capture/identify" />
                  <Stack.Screen name="capture/result" />
                  <Stack.Screen name="species/[id]" options={{ presentation: 'modal' }} />
                  <Stack.Screen name="ama/[id]" options={{ presentation: 'modal' }} />
                  <Stack.Screen name="dev/components" />
                  <Stack.Screen name="dev/auth" />
                </Stack>
                {/* Sits above the stack so the lifelist cannot flash before we
                    know whether this user still owes us onboarding. */}
                <OnboardingGate />
              </CaptureSessionProvider>
            </OnboardingProvider>
          </LifelistProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
