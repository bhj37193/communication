import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { MessageBubble } from '../components/MessageBubble';
import { ApiError, endSession, sendMessage, type ChatMessage } from '../lib/api';

// Randomized "typing" delay so the character doesn't reply instantly. Longer
// replies take longer, clamped to 600–1800ms.
function typingDelayMs(reply: string): number {
  const lengthFactor = Math.min(reply.length, 100) / 100; // 0..1
  const base = 600 + lengthFactor * 1000; // 600..1600
  const jitter = Math.random() * 200; // 0..200
  return Math.round(base + jitter);
}

export default function ChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string; opener?: string; remaining?: string }>();
  const sessionId = params.id;

  const [messages, setMessages] = useState<ChatMessage[]>(
    params.opener ? [{ role: 'character', content: params.opener }] : [],
  );
  const [remaining, setRemaining] = useState<number>(
    params.remaining ? Number(params.remaining) : 0,
  );
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [ending, setEnding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const activeRef = useRef(true);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, typing]);

  useEffect(() => {
    return () => {
      activeRef.current = false;
    };
  }, []);

  const trimmed = text.trim();
  const canSend =
    !sending && !typing && !ending && remaining > 0 && trimmed.length >= 1 && trimmed.length <= 500;

  const goToResult = async (): Promise<void> => {
    if (ending) return;
    setEnding(true);
    setError(null);
    try {
      await endSession(sessionId);
      if (!activeRef.current) return;
      router.replace({ pathname: '/result', params: { id: sessionId } });
    } catch (err) {
      if (!activeRef.current) return;
      setError(err instanceof ApiError ? err.message : 'Could not end the session.');
      setEnding(false);
    }
  };

  const onSend = async (): Promise<void> => {
    if (!canSend) return;
    const userText = trimmed;
    setText('');
    setSending(true);
    setError(null);
    setMessages((prev) => [...prev, { role: 'user', content: userText }]);
    try {
      const res = await sendMessage(sessionId, userText);
      if (!activeRef.current) return;
      setSending(false);
      // Simulate the character "typing" before revealing the reply.
      setTyping(true);
      await new Promise((resolve) => setTimeout(resolve, typingDelayMs(res.reply)));
      if (!activeRef.current) return;
      setTyping(false);
      setMessages((prev) => [...prev, { role: 'character', content: res.reply }]);
      setRemaining(res.remaining);
      if (res.remaining <= 0) {
        await goToResult();
      }
    } catch (err) {
      if (!activeRef.current) return;
      setSending(false);
      setTyping(false);
      setMessages((prev) => prev.slice(0, -1));
      setText(userText);
      setError(err instanceof ApiError ? err.message : 'Could not send your message.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.remaining} testID="remaining">
          {remaining} {remaining === 1 ? 'message' : 'messages'} left
        </Text>
        <Pressable
          onPress={goToResult}
          disabled={ending || sending || typing}
          accessibilityRole="button"
        >
          <Text style={styles.doneLink}>I&apos;m done</Text>
        </Pressable>
      </View>

      <ScrollView ref={scrollRef} style={styles.flex} contentContainerStyle={styles.messages}>
        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role} content={m.content} />
        ))}
        {typing ? (
          <View style={styles.typingRow}>
            <Text style={styles.typingText}>Sam is typing…</Text>
          </View>
        ) : null}
      </ScrollView>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          onKeyPress={(e: any) => {
            // Web: Enter sends, Shift+Enter inserts a newline. No-op on native soft keyboards.
            if (e?.nativeEvent?.key === 'Enter' && !e?.nativeEvent?.shiftKey) {
              e.preventDefault?.();
              if (canSend) onSend();
            }
          }}
          placeholder={remaining > 0 ? 'Type a message…' : 'No messages left'}
          editable={remaining > 0 && !ending}
          maxLength={500}
          multiline
          accessibilityLabel="message input"
        />
        <Pressable
          style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
          onPress={onSend}
          disabled={!canSend}
          accessibilityRole="button"
        >
          {sending ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.sendText}>Send</Text>}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  remaining: { fontSize: 14, color: '#6b7280', fontWeight: '600' },
  doneLink: { fontSize: 14, color: '#2563eb', fontWeight: '600' },
  messages: { paddingVertical: 12 },
  typingRow: { paddingHorizontal: 16, paddingVertical: 6 },
  typingText: { color: '#9ca3af', fontStyle: 'italic' },
  error: { color: '#b91c1c', paddingHorizontal: 16, paddingVertical: 4 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    gap: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e7eb',
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingHorizontal: 20,
    height: 44,
    justifyContent: 'center',
  },
  sendButtonDisabled: { opacity: 0.5 },
  sendText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});
