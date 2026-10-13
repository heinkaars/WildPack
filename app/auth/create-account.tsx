import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Input } from '../../components/ui';
import {
  ActionGroup,
  AuthScreen,
  FieldNote,
  PasswordInput,
  PromptLink,
} from '../../components/AuthScreen';
import { useAuth } from '../../lib/auth';
import { showFlash } from '../../lib/flash';

export default function CreateAccountScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const trimmed = email.trim();
  const tooShort = password.length > 0 && password.length < 6;
  // Flag the confirmation once it stops being the start of the password, not
  // while it is still being typed.
  const mismatch = confirm.length > 0 && !password.startsWith(confirm);
  const canSubmit =
    trimmed.includes('@') && password.length >= 6 && confirm === password && !busy;

  async function handleSubmit() {
    setBusy(true);
    setError(null);
    try {
      await signUp(trimmed, password);
      // The account this device has been using is now theirs — same lifelist,
      // same everything, just with a way back into it.
      showFlash(`You are signed in as ${trimmed}.`);
      router.dismissTo('/');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
      setBusy(false);
    }
  }

  return (
    <AuthScreen
      wordmark
      title="Create Account"
      subtitle="Hey, let's create an account to save all the data and species you've recorded."
      error={error}
      footer={
        <ActionGroup>
          <Button
            label="Create account"
            onPress={handleSubmit}
            disabled={!canSubmit}
            loading={busy}
            style={styles.button}
          />
          <PromptLink
            prompt="Already have an account?"
            action="Sign in"
            onPress={() => router.replace('/auth/sign-in')}
          />
        </ActionGroup>
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
        autoComplete="new-password"
        disabled={busy}
      />
      {tooShort && <FieldNote>At least 6 characters.</FieldNote>}
      <PasswordInput
        value={confirm}
        onChangeText={setConfirm}
        placeholder="Confirm Password"
        accessibilityLabel="Confirm password"
        autoComplete="new-password"
        disabled={busy}
        error={mismatch}
        onSubmitEditing={canSubmit ? handleSubmit : undefined}
      />
      {mismatch && <FieldNote tone="error">The passwords don't match.</FieldNote>}
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  button: { alignSelf: 'stretch' },
});
