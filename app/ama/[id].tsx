import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useLifelist } from '../../lib/lifelist-store';
import { askAma } from '../../lib/ama-service';
import { useAmaThread } from '../../lib/ama-store';
import { AskView } from '../../components/species/AskView';
import { docentFromLook } from '../../components/ui';
import { colors, spacing, type } from '../../lib/theme';

export default function AskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getEntry, profile } = useLifelist();
  const entry = getEntry(id);

  const { messages, append } = useAmaThread(id);
  const [sending, setSending] = useState(false);
  // A refused question used to fail silently: the message appeared, no answer
  // ever came, and nothing said why. Now the reason is shown above the field.
  const [error, setError] = useState<string | null>(null);
  // Which answers were redirections. Kept for this visit only — the stored
  // chat has no column for it, so a reopened chat shows them as plain answers.
  const [offTopic, setOffTopic] = useState<Set<string>>(() => new Set());

  if (!entry) {
    return (
      <View style={styles.missing}>
        <Text style={[type.bodySm, styles.notFound]}>Species not found.</Text>
      </View>
    );
  }

  async function handleSend(question: string) {
    if (!entry) return;
    const history = messages;
    setSending(true);
    setError(null);
    try {
      await append('user', question);
      const reply = await askAma(entry, question, history);
      const answer = await append('assistant', reply.answer);
      if (reply.offTopic) setOffTopic((prev) => new Set(prev).add(answer.id));
    } catch (e) {
      // The question stays in the thread, so asking again is one tap away.
      setError(e instanceof Error ? e.message : 'Could not get an answer right now.');
    } finally {
      setSending(false);
    }
  }

  return (
    <AskView
      speciesName={entry.commonName}
      docent={docentFromLook(profile.look)}
      messages={messages.map((message) => ({ ...message, offTopic: offTopic.has(message.id) }))}
      sending={sending}
      error={error}
      onSend={handleSend}
      onClose={() => router.back()}
    />
  );
}

const styles = StyleSheet.create({
  missing: { flex: 1, backgroundColor: colors.sheet, padding: spacing.screen },
  notFound: { color: colors.textMuted },
});
