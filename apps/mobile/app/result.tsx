import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ApiError, getResult, type ScoredResult } from '../lib/api';

const POLL_INTERVAL_MS = 1500;

export default function ResultScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [result, setResult] = useState<ScoredResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let active = true;

    const poll = async (): Promise<void> => {
      try {
        const res = await getResult(id);
        if (!active) return;
        if (res.status === 'scored') {
          setResult(res.result);
          return;
        }
        // Still open/scoring (202) — retry.
        timer.current = setTimeout(poll, POLL_INTERVAL_MS);
      } catch (err) {
        if (!active) return;
        setError(err instanceof ApiError ? err.message : 'Could not load your result.');
      }
    };

    void poll();
    return () => {
      active = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, [id]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
        <Pressable style={styles.button} onPress={() => router.replace('/')} accessibilityRole="button">
          <Text style={styles.buttonText}>Back to start</Text>
        </Pressable>
      </View>
    );
  }

  if (!result) {
    return (
      <View style={styles.centered} testID="result-loading">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Scoring your conversation…</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.scoreCard, result.passed ? styles.pass : styles.fail]}>
        <Text style={styles.scoreLabel}>SCORE</Text>
        <Text style={styles.score}>{result.score}</Text>
        <Text style={styles.verdict}>{result.passed ? 'PASSED' : 'KEEP PRACTICING'}</Text>
      </View>

      <Section label="WIN" text={result.win.text} detail={result.win.quote} detailLabel="Quote" />
      <Section label="FIX" text={result.fix.text} detail={result.fix.anchor} detailLabel="Anchor" />
      <Section
        label="THE MOMENT"
        text={result.moment.text}
        detail={result.moment.quote}
        detailLabel="Quote"
      />

      <Pressable style={styles.button} onPress={() => router.replace('/')} accessibilityRole="button">
        <Text style={styles.buttonText}>Done</Text>
      </Pressable>
    </ScrollView>
  );
}

function Section({
  label,
  text,
  detail,
  detailLabel,
}: {
  label: string;
  text: string;
  detail: string;
  detailLabel: string;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <Text style={styles.sectionText}>{text}</Text>
      {detail ? (
        <Text style={styles.sectionDetail}>
          {detailLabel}: {detail}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 },
  loadingText: { fontSize: 16, color: '#6b7280' },
  error: { color: '#b91c1c', fontSize: 16, textAlign: 'center' },
  container: { padding: 20, gap: 16 },
  scoreCard: { borderRadius: 16, padding: 24, alignItems: 'center' },
  pass: { backgroundColor: '#dcfce7' },
  fail: { backgroundColor: '#fee2e2' },
  scoreLabel: { fontSize: 14, fontWeight: '700', color: '#374151', letterSpacing: 1 },
  score: { fontSize: 56, fontWeight: '800', color: '#111827' },
  verdict: { fontSize: 16, fontWeight: '700', color: '#374151' },
  section: { borderRadius: 12, backgroundColor: '#f9fafb', padding: 16, gap: 6 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#2563eb', letterSpacing: 1 },
  sectionText: { fontSize: 16, lineHeight: 22, color: '#111827' },
  sectionDetail: { fontSize: 14, color: '#6b7280', fontStyle: 'italic' },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#ffffff', fontSize: 18, fontWeight: '600' },
});
