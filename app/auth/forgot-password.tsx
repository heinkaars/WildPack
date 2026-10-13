import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Input } from '../../components/ui';
import { ActionGroup, AuthScreen } from '../../components/AuthScreen';
import { useAuth } from '../../lib/auth';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { requestPasswordReset } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const trimmed = email.trim();
  const canSubmit = trimmed.includes('@') && !busy;

  async function handleSubmit() {
    setBusy(true);
    setError(null);
    try {
      await requestPasswordReset(trimmed);
      router.replace({ pathname: '/auth/verify', params: { email: trimmed } });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
      setBusy(false);
    }
  }

  return (
    <AuthScreen
      title="Reset your password"
      subtitle="Tell us the email on your account and we will send you a 6-digit code."
      error={error}
      footer={
        <ActionGroup>
          <Button
            label="Send me a code"
            onPress={handleSubmit}
            disabled={!canSubmit}
            loading={busy}
            style={styles.button}
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
        onSubmitEditing={canSubmit ? handleSubmit : undefined}
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  button: { alignSelf: 'stretch' },
});
