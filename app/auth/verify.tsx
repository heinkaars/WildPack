import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, Input } from '../../components/ui';
import {
  ActionGroup,
  AuthScreen,
  FieldNote,
  MessageBox,
  PasswordInput,
  TextLink,
} from '../../components/AuthScreen';
import { useAuth } from '../../lib/auth';

/**
 * The second half of a password reset. A reset is the one thing that genuinely
 * needs a round trip through the inbox, and a typed code keeps that working
 * the same way on the web and on a phone — no deep links to configure.
 */
export default function VerifyScreen() {
  const router = useRouter();
  const { requestPasswordReset, resetPassword } = useAuth();
  const params = useLocalSearchParams<{ email?: string }>();
  const email = params.email ?? '';

  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const tooShort = password.length > 0 && password.length < 6;
  const canSubmit = code.trim().length === 6 && password.length >= 6 && !busy;

  async function handleSubmit() {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await resetPassword(email, code.trim(), password);
      router.dismissTo('/');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
      setBusy(false);
    }
  }

  async function handleResend() {
    setError(null);
    setNotice(null);
    try {
      await requestPasswordReset(email);
      setNotice('Sent. It can take a minute to arrive.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not send another code.');
    }
  }

  return (
    <AuthScreen
      title="Check your email"
      subtitle={`We sent a 6-digit code to ${email}. Enter it below and choose your new password.`}
      error={error}
      footer={
        <>
          <ActionGroup>
            <Button
              label="Set new password"
              onPress={handleSubmit}
              disabled={!canSubmit}
              loading={busy}
              style={styles.button}
            />
            <TextLink label="Send the code again" onPress={handleResend} />
          </ActionGroup>
          {notice && <MessageBox>{notice}</MessageBox>}
        </>
      }
    >
      <Input
        value={code}
        onChangeText={(text) => setCode(text.replace(/[^0-9]/g, '').slice(0, 6))}
        placeholder="6-digit code"
        accessibilityLabel="6-digit code"
        keyboardType="number-pad"
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
        maxLength={6}
        disabled={busy}
      />
      <PasswordInput
        value={password}
        onChangeText={setPassword}
        placeholder="New Password"
        accessibilityLabel="New password"
        autoComplete="new-password"
        disabled={busy}
        onSubmitEditing={canSubmit ? handleSubmit : undefined}
      />
      {tooShort && <FieldNote>At least 6 characters.</FieldNote>}
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  button: { alignSelf: 'stretch' },
});
