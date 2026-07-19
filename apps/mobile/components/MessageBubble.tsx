import { StyleSheet, Text, View } from 'react-native';

export interface MessageBubbleProps {
  role: 'user' | 'character';
  content: string;
}

// Shared by the chat surface (live messages) and could be reused elsewhere.
export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === 'user';
  return (
    <View
      style={[styles.row, isUser ? styles.rowUser : styles.rowCharacter]}
      accessibilityRole="text"
    >
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleCharacter]}>
        <Text style={isUser ? styles.textUser : styles.textCharacter}>{content}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginVertical: 4, paddingHorizontal: 12 },
  rowUser: { justifyContent: 'flex-end' },
  rowCharacter: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '80%', borderRadius: 16, paddingVertical: 8, paddingHorizontal: 12 },
  bubbleUser: { backgroundColor: '#2563eb', borderBottomRightRadius: 4 },
  bubbleCharacter: { backgroundColor: '#e5e7eb', borderBottomLeftRadius: 4 },
  textUser: { color: '#ffffff', fontSize: 16 },
  textCharacter: { color: '#111827', fontSize: 16 },
});
