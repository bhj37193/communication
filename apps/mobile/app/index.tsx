import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from './_layout';
import { ApiError, type Challenge, createSession, getChallenge } from '../lib/api';

export default function EntryScreen() {
  const router = useRouter();
  const { ready, authenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [challengeLoading, setChallengeLoading] = useState(false);
  const [challengeError, setChallengeError] = useState<string | null>(null);

  useEffect(() => {
    if (!authenticated) return;
    setChallengeLoading(true);
    setChallengeError(null);
    getChallenge()
      .then(setChallenge)
      .catch(() => setChallengeError('Could not load today’s challenge.'))
      .finally(() => setChallengeLoading(false));
  }, [authenticated]);

  const onStart = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const session = await createSession();
      router.push({
        pathname: '/chat',
        params: {
          id: session.session_id,
          opener: session.opener,
          remaining: String(session.remaining),
        },
      });
    } catch (err) {
      const message =
        err instanceof ApiError && err.code === 'UNAUTHENTICATED'
          ? 'Please sign in to start.'
          : err instanceof ApiError
            ? err.message
            : 'Could not start a session. Try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {challengeLoading ? (
        <ActivityIndicator />
      ) : challenge ? (
        <>
          <Text style={styles.title}>{challenge.title}</Text>
          <Text style={styles.setup}>{challenge.setup_text}</Text>
        </>
      ) : null}
      {challengeError ? <Text style={styles.error}>{challengeError}</Text> : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={onStart}
        disabled={loading}
        accessibilityRole="button"
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Start</Text>
        )}
      </Pressable>

      <View style={styles.footer}>
        {authenticated ? (
          <Pressable onPress={() => router.push('/profile')} accessibilityRole="button">
            <Text style={styles.link}>Profile</Text>
          </Pressable>
        ) : ready ? (
          // ponytail: `ready` gate avoids a one-frame flash of "Sign in" while
          // the dev-fake identity is still resolving (it would route to a
          // screen that calls useSignIn() outside ClerkProvider in dev mode).
          <Pressable onPress={() => router.push('/sign-in')} accessibilityRole="button">
            <Text style={styles.link}>Sign in</Text>
          </Pressable>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, justifyContent: 'center', gap: 16 },
  title: { fontSize: 28, fontWeight: '700', color: '#111827' },
  setup: { fontSize: 16, lineHeight: 24, color: '#374151' },
  error: { color: '#b91c1c', fontSize: 14 },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#ffffff', fontSize: 18, fontWeight: '600' },
  footer: { alignItems: 'center', marginTop: 24 },
  link: { color: '#2563eb', fontSize: 16 },
});
