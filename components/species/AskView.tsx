import { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChatInput, CloseIcon, Docent, DocentAnimal } from '../ui';
import { MessageBox } from '../AuthScreen';
import { colors, fonts, radii, spacing } from '../../lib/theme';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  /** The question wasn't about this species; the answer steers back (Figma -ifNotReleventQuestion). */
  offTopic?: boolean;
};

type Props = {
  speciesName: string;
  docent: DocentAnimal;
  messages: ChatMessage[];
  /** Waiting for an answer: shows the typing bubble and holds the send button. */
  sending: boolean;
  error: string | null;
  onSend: (question: string) => void;
  onClose: () => void;
};

/**
 * Figma species-Details-Ask 88384:3692 — the chat sheet over the species page:
 * grabber, close cross and title, the user's questions on the right in cream,
 * the docent's answers on the left in white, a three-dot typing bubble, and
 * the chat field at the bottom. An off-topic answer gets the red wash and dot
 * from 88384:3751.
 */
export function AskView({ speciesName, docent, messages, sending, error, onSend, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const list = useRef<FlatList<ChatMessage>>(null);
  const [draft, setDraft] = useState('');

  // Not stored: the docent opens every chat with the same invitation.
  const greeting: ChatMessage = {
    id: 'greeting',
    role: 'assistant',
    text: `Hi! Ask me anything about the ${speciesName} — where it lives, what it eats, or how to tell it apart from look-alikes.`,
  };
  const data = [greeting, ...messages];

  function send() {
    const question = draft.trim();
    if (!question || sending) return;
    setDraft('');
    onSend(question);
  }

  return (
    <View style={styles.sheet}>
      <View style={styles.toolbar}>
        {Platform.OS === 'ios' && <View style={styles.grabber} />}
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1} accessibilityRole="header">
            Ask about {speciesName}
          </Text>
          <Pressable
            onPress={onClose}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Close"
            style={({ pressed }) => [styles.close, pressed && styles.pressed]}
          >
            <CloseIcon size={24} strokeWidth={2} color={colors.textSecondary} />
          </Pressable>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <FlatList
          ref={list}
          data={data}
          keyExtractor={(message) => message.id}
          contentContainerStyle={styles.messages}
          onContentSizeChange={() => list.current?.scrollToEnd({ animated: true })}
          keyboardDismissMode="interactive"
          renderItem={({ item }) => <Bubble message={item} docent={docent} />}
          ListFooterComponent={sending ? <Typing docent={docent} /> : null}
        />

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) + 4 }]}>
          {error ? <MessageBox tone="error">{error}</MessageBox> : null}
          <ChatInput
            value={draft}
            onChangeText={setDraft}
            placeholder={`Ask about this ${speciesName}...`}
            onSend={send}
            sendDisabled={sending || draft.trim().length === 0}
            maxLength={500}
            accessibilityLabel={`Ask about this ${speciesName}`}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function Avatar({ docent }: { docent: DocentAnimal }) {
  return (
    <View style={styles.avatar} importantForAccessibility="no-hide-descendants">
      <Docent animal={docent} width={40} />
    </View>
  );
}

function Bubble({ message, docent }: { message: ChatMessage; docent: DocentAnimal }) {
  if (message.role === 'user') {
    return (
      <View style={styles.userItem}>
        <View style={[styles.bubble, styles.userBubble]}>
          <Text style={styles.bubbleText}>{message.text}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.answerItem}>
      <View style={[styles.bubble, styles.answerBubble]}>
        {message.offTopic && (
          <>
            <LinearGradient
              colors={[colors.chatOffTopic, 'rgba(153, 0, 3, 0)']}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
            <View style={styles.offTopicDot} accessibilityLabel="Off topic" />
          </>
        )}
        <Text style={styles.bubbleText}>{message.text}</Text>
      </View>
      <Avatar docent={docent} />
    </View>
  );
}

/** The three-dot typing bubble; each dot lifts and darkens in turn. */
function Typing({ docent }: { docent: DocentAnimal }) {
  return (
    <View
      style={[styles.answerItem, styles.typingItem]}
      accessibilityLabel="Your docent is typing"
      accessibilityLiveRegion="polite"
    >
      <View style={[styles.bubble, styles.answerBubble, styles.typingBubble]}>
        {[0, 1, 2].map((i) => (
          <Dot key={i} index={i} />
        ))}
      </View>
      <Avatar docent={docent} />
    </View>
  );
}

function Dot({ index }: { index: number }) {
  const lift = useSharedValue(0);
  useEffect(() => {
    lift.value = withDelay(
      index * 160,
      withRepeat(withSequence(withTiming(1, { duration: 280 }), withTiming(0, { duration: 280 }), withTiming(0, { duration: 400 })), -1),
    );
  }, []);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: -4 * lift.value }],
    opacity: 0.6 + 0.4 * lift.value,
    backgroundColor: lift.value > 0.5 ? colors.textMuted : colors.typingDot,
  }));
  return <Animated.View style={[styles.dot, style]} />;
}

const BUBBLE_MAX = 288;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  sheet: { flex: 1, backgroundColor: colors.sheet },
  toolbar: { alignItems: 'center', paddingBottom: 10 },
  grabber: { width: 36, height: 5, borderRadius: 100, marginTop: 5, backgroundColor: colors.grabber },
  titleRow: {
    alignSelf: 'stretch',
    height: 44,
    marginTop: Platform.OS === 'ios' ? 6 : 16,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginHorizontal: 60,
    fontFamily: fonts.bodySemiBold,
    fontSize: 18,
    lineHeight: 27,
    letterSpacing: -0.3,
    color: colors.text,
  },
  close: {
    position: 'absolute',
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backButtonFill,
  },
  pressed: { opacity: 0.7 },

  messages: { paddingHorizontal: spacing.screen, paddingTop: 8, paddingBottom: 16, gap: 16 },
  userItem: { alignItems: 'flex-end' },
  answerItem: { paddingLeft: 40, alignItems: 'flex-start' },
  typingItem: { marginTop: 16 },
  bubble: {
    maxWidth: BUBBLE_MAX,
    minHeight: 36,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  userBubble: { backgroundColor: colors.chatUser, borderBottomRightRadius: 4 },
  answerBubble: { backgroundColor: colors.surface, borderBottomLeftRadius: 4 },
  bubbleText: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: -0.2,
    color: colors.textSecondary,
  },
  offTopicDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.warning,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    borderBottomLeftRadius: 16,
  },
  dot: { width: 4, height: 4, borderRadius: 2 },
  avatar: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },

  footer: { paddingHorizontal: spacing.screen, paddingTop: 8, gap: 8, backgroundColor: colors.sheet },
});
