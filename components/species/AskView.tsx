import { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChatInput, CloseIcon, Docent, DocentAnimal } from '../ui';
import { MessageBox } from '../AuthScreen';
import { colors, fonts, spacing } from '../../lib/theme';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  /** The question wasn't about this species; the answer steers back (Figma -ifNotReleventQuestion). */
  offTopic?: boolean;
};

type Props = {
  speciesName: string;
  /** The user's name, for the docent's greeting. */
  userName: string;
  docent: DocentAnimal;
  messages: ChatMessage[];
  /** Waiting for an answer: shows the typing bubble and holds the send button. */
  sending: boolean;
  error: string | null;
  onSend: (question: string) => void;
  onClose: () => void;
};

/**
 * Figma species-Details-Ask 88384:3692 — the chat sheet over the species page,
 * which stays in place behind its frosted glass: grabber, close cross and
 * title, the user's questions on the right in cream,
 * the docent's answers on the left in white, a three-dot typing bubble, and
 * the chat field at the bottom. An off-topic answer gets the red wash
 * from 88384:3751.
 */
export function AskView({ speciesName, userName, docent, messages, sending, error, onSend, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const list = useRef<FlatList<ChatMessage>>(null);
  const [draft, setDraft] = useState('');

  // Not stored: the docent opens every chat with the same invitation.
  const greeting: ChatMessage = {
    id: 'greeting',
    role: 'assistant',
    text: `Hi${userName.trim() ? ` ${userName.trim()}` : ''}! Ask me anything about the ${speciesName} — where it lives, what it eats, or how to tell it apart from look-alikes.`,
  };
  const data = [greeting, ...messages];

  function send() {
    const question = draft.trim();
    if (!question || sending) return;
    setDraft('');
    onSend(question);
  }

  // Dragging the grabber or title down closes the sheet, like an iOS sheet.
  const drag = useSharedValue(0);
  const pan = Gesture.Pan()
    .runOnJS(true)
    .onUpdate((event) => {
      drag.value = Math.max(0, event.translationY);
    })
    .onEnd((event) => {
      if (event.translationY > 120 || event.velocityY > 800) onClose();
      else drag.value = withSpring(0, { damping: 20 });
    });
  const dragStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: drag.value }],
  }));

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* The species page shows above the sheet; tapping it closes the chat. */}
      <Pressable
        style={{ height: insets.top + SHEET_TOP }}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close chat"
      />

      <Animated.View style={[styles.sheetShadow, dragStyle]}>
        <View style={styles.sheet}>
          <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, styles.glass]} />

          <GestureDetector gesture={pan}>
            <View style={styles.toolbar}>
              <View style={styles.grabber} />
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
          </GestureDetector>

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
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

function Avatar({ docent }: { docent: DocentAnimal }) {
  return (
    <View style={styles.avatar} importantForAccessibility="no-hide-descendants">
      {/* 36 wide makes the portrait 40 tall, so the hat fits inside the slot. */}
      <Docent animal={docent} width={36} />
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
        {/* Figma also puts a red dot in the corner; left out at the user's request. */}
        {message.offTopic && (
          <LinearGradient
            colors={[colors.chatOffTopic, 'rgba(153, 0, 3, 0)']}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
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
      withRepeat(
        withSequence(
          withTiming(1, { duration: 280 }),
          withTiming(0, { duration: 280 }),
          withTiming(0, { duration: 400 }),
        ),
        -1,
      ),
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
/** Sheet top below the safe area (Figma: 127 from the top of an 844 frame with a 43 status bar). */
const SHEET_TOP = 84;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  sheetShadow: {
    flex: 1,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  sheet: {
    flex: 1,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    overflow: 'hidden',
  },
  glass: { backgroundColor: colors.sheetGlass },
  toolbar: { alignItems: 'center', paddingBottom: 10 },
  grabber: {
    width: 36,
    height: 5,
    borderRadius: 100,
    marginTop: 5,
    backgroundColor: colors.grabber,
  },
  titleRow: {
    alignSelf: 'stretch',
    height: 44,
    marginTop: 6,
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

  messages: {
    paddingHorizontal: spacing.screen,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 16,
  },
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
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  footer: { paddingHorizontal: spacing.screen, paddingTop: 8, gap: 8 },
});
