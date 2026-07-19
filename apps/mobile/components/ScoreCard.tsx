import { forwardRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface ScoreCardProps {
  score: number;
  passed: boolean;
}

// Standalone, capture-ready score card (shared to the OS share sheet via
// react-native-view-shot's captureRef in lib/share.ts). Deliberately renders
// ONLY the score + pass/fail + the static positioning tagline — never any
// transcript quote/win/fix/moment text. forwardRef exposes a plain View that
// captureRef can snapshot; the capture library stays out of this file.
export const ScoreCard = forwardRef<View, ScoreCardProps>(function ScoreCard(
  { score, passed },
  ref,
) {
  return (
    <View ref={ref} style={[styles.card, passed ? styles.pass : styles.fail]} collapsable={false}>
      <Text style={styles.label}>SCORE</Text>
      <Text style={styles.score}>{score}</Text>
      <Text style={styles.verdict}>{passed ? 'PASSED' : 'KEEP PRACTICING'}</Text>
      <Text style={styles.tagline}>
        The most interesting person in the room is the one who makes everyone else feel interesting.
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  card: { borderRadius: 16, padding: 24, alignItems: 'center', gap: 4 },
  pass: { backgroundColor: '#dcfce7' },
  fail: { backgroundColor: '#fee2e2' },
  label: { fontSize: 14, fontWeight: '700', color: '#374151', letterSpacing: 1 },
  score: { fontSize: 56, fontWeight: '800', color: '#111827' },
  verdict: { fontSize: 16, fontWeight: '700', color: '#374151' },
  tagline: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 21,
    color: '#2563eb',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
