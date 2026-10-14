import { useCallback, useEffect, useState } from 'react';
import { AppState, Linking, Pressable, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ProfileView } from '../components/profile/ProfileView';
import { Button, Popup, PopupButtons } from '../components/ui';
import { deleteAccount } from '../lib/account-service';
import { useAuth } from '../lib/auth';
import { useLifelist } from '../lib/lifelist-store';
import { isLocationSharingOn, setLocationSharing } from '../lib/location';
import { useOnboarding } from '../lib/onboarding';
import { colors, type } from '../lib/theme';

/** Profile (Figma Home-Profile 88384:3300), opened from the avatar on Home. */
export default function ProfileScreen() {
  const router = useRouter();
  const { isAnonymous, email, signOut } = useAuth();
  const { profile, profileLoaded, entries, stats, updateProfile } = useLifelist();
  const { resetOnboarding } = useOnboarding();

  const [locationOn, setLocationOn] = useState(false);
  const [locationBlocked, setLocationBlocked] = useState(false);

  // The phone's permission can change in Settings while the app is away.
  const readLocation = useCallback(() => {
    isLocationSharingOn().then(setLocationOn);
  }, []);
  useEffect(() => {
    readLocation();
    const subscription = AppState.addEventListener('change', (next) => {
      if (next === 'active') readLocation();
    });
    return () => subscription.remove();
  }, [readLocation]);

  async function toggleLocation(on: boolean) {
    setLocationOn(on);
    const result = await setLocationSharing(on);
    setLocationOn(result === 'on');
    if (result === 'blocked') setLocationBlocked(true);
  }

  // The account is only real once the emailed code has been entered, so an
  // address without a confirmed session still counts as unsaved.
  const savedEmail = !isAnonymous && email ? email : null;

  async function logOut() {
    await signOut();
    router.dismissTo('/');
  }

  async function removeAccount() {
    await deleteAccount();
    // Signing out hands the phone a fresh account, which clears the local
    // copy of the old one; the welcome screens start over.
    await signOut();
    await resetOnboarding();
    router.dismissTo('/');
  }

  return (
    <>
      <ProfileView
        profile={profile}
        profileLoaded={profileLoaded}
        stats={stats}
        speciesCount={entries.length}
        email={savedEmail}
        locationOn={locationOn}
        onBack={() => router.back()}
        onRename={(name) => updateProfile({ name })}
        onPickDocent={(animal) => updateProfile({ look: animal })}
        onToggleLocation={toggleLocation}
        onCreateAccount={() => router.push('/auth/create-account')}
        onSignIn={() => router.push('/auth/sign-in')}
        onLogOut={logOut}
        onDeleteAccount={removeAccount}
        devTools={
          __DEV__ && (
            <Pressable onPress={resetOnboarding} hitSlop={8} style={styles.dev}>
              <Text style={[type.labelSm, styles.devText]}>↺ Replay onboarding (dev)</Text>
            </Pressable>
          )
        }
      />

      <Popup visible={locationBlocked} onClose={() => setLocationBlocked(false)}>
        <Text style={[type.headingM, styles.center]}>Location is turned off</Text>
        <Text style={[type.bodyLg, styles.center, styles.secondary]}>
          Allow WildPack to use your location in your phone’s Settings, then switch it on here.
        </Text>
        <PopupButtons>
          <Button label="Not now" variant="outline" size="compact" onPress={() => setLocationBlocked(false)} style={styles.flex} />
          <Button
            label="Open Settings"
            size="compact"
            onPress={() => {
              setLocationBlocked(false);
              Linking.openSettings().catch(() => {});
            }}
            style={styles.flex}
          />
        </PopupButtons>
      </Popup>
    </>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: 'center' },
  secondary: { color: colors.textSecondary },
  flex: { flex: 1 },
  dev: { alignSelf: 'center', paddingTop: 16 },
  devText: { color: colors.warning },
});
