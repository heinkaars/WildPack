import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Input } from '../../components/ui';
import {
  ActionGroup,
  AuthScreen,
  MessageBox,
  PasswordInput,
  TextLink,
} from '../../components/AuthScreen';
import { useAuth } from '../../lib/auth';
import { useOnboarding } from '../../lib/onboarding';
import { previewMerge } from '../../lib/account-switch';
import { showFlash } from '../../lib/flash';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { markComplete } = useOnboarding();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [carrying, setCarrying] = useState<{ species: number; sightings: number } | null>(null);

  // What this device is holding, so the merge is stated up front rather than
  // happening silently behind the sign-in.
  useEffect(() => {
    let cancelled = false;
    previewMerge().then((counts) => {
      if (!cancelled && counts.sightings > 0) setCarrying(counts);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const trimmed = email.trim();
  const canSubmit = trimmed.includes('@') && password.length > 0 && !busy;

  async function handleSubmit() {
    setBusy(true);
    setError(null);
    try {
      await signIn(trimmed, password);
      // Reached from A1's "I have an account": an existing account is past
      // onboarding. Saying so now keeps the gate from sending the user back to
      // A1 in the moment before the store has rebuilt around the account.
      await markComplete();

      showFlash(`Welcome back. Signed in as ${trimmed}.`);

      // The lifelist store rebuilds itself around the new account; going back to
      // the root means landing on it once it has.
      router.dismissTo('/');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
      setBusy(false);
    }
  }

  return (
    <AuthScreen
      title="Welcome back"
      subtitle="Sign in to bring your lifelist onto this phone."
      error={error}
      footer={
        <>
          <ActionGroup>
            <Button
              label="Sign in"
              onPress={handleSubmit}
              disabled={!canSubmit}
              loading={busy}
              style={styles.button}
            />
            <TextLink label="Create an account instead" onPress={() => router.replace('/auth/create-account')} />
          </ActionGroup>
          {carrying && (
            <MessageBox>
              The {carrying.sightings === 1 ? 'sighting' : `${carrying.sightings} sightings`} on this
              phone {carrying.sightings === 1 ? 'moves' : 'move'} across to the account you sign in to.
              Nothing is lost.
            </MessageBox>
          )}
        </>
      }
    >
      <Input
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        accessibilityLabel="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        disabled={busy}
      />
      <PasswordInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        accessibilityLabel="Password"
        autoComplete="current-password"
        disabled={busy}
        onSubmitEditing={canSubmit ? handleSubmit : undefined}
      />
      <View style={styles.forgot}>
        <TextLink label="Forgot Password?" onPress={() => router.push('/auth/forgot-password')} />
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  button: { alignSelf: 'stretch' },
  forgot: { marginTop: 4, alignItems: 'flex-start' },
});
