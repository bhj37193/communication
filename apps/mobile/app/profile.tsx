import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from './_layout';
import { ApiError, deleteMyData } from '../lib/api';

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSignOut = async (): Promise<void> => {
    setBusy(true);
    setError(null);
    try {
      await signOut();
      router.replace('/');
    } catch {
      setError('Could not sign out.');
      setBusy(false);
    }
  };

  const onDelete = async (): Promise<void> => {
    setBusy(true);
    setError(null);
    try {
      await deleteMyData();
      await signOut();
      router.replace('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not delete your data.');
      setBusy(false);
    }
  };

  const confirmDelete = (): void => {
    Alert.alert('Delete my data', 'This permanently deletes your data. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => void onDelete() },
    ]);
  };

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        style={styles.button}
        onPress={onSignOut}
        disabled={busy}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>Sign out</Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.danger]}
        onPress={confirmDelete}
        disabled={busy}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>Delete my data</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16, justifyContent: 'center' },
  error: { color: '#b91c1c', fontSize: 14, textAlign: 'center' },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  danger: { backgroundColor: '#dc2626' },
  buttonText: { color: '#ffffff', fontSize: 18, fontWeight: '600' },
});
