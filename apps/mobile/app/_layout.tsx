import { Stack } from 'expo-router';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getDevUserId, isAuthConfigured, signOut as authSignOut } from '../lib/auth';

interface AuthContextValue {
  ready: boolean;
  // True when a usable auth identity exists (dev-fake, or Clerk fallback).
  authenticated: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      // In the exercised (dev-fake / no-Clerk-key) path, ensure the stable
      // per-install identity exists up front. If Clerk is ever configured
      // without a key this stays false and screens can gate on it.
      if (isAuthConfigured()) {
        await getDevUserId();
        if (active) setAuthenticated(true);
      }
      if (active) setReady(true);
    })();
    return () => {
      active = false;
    };
  }, []);

  const signOut = async (): Promise<void> => {
    await authSignOut();
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ ready, authenticated, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen name="index" options={{ title: 'Charisma Trainer' }} />
        <Stack.Screen name="chat" options={{ title: 'The Housewarming' }} />
        <Stack.Screen name="result" options={{ title: 'Your Result' }} />
        <Stack.Screen name="profile" options={{ title: 'Profile' }} />
      </Stack>
    </AuthProvider>
  );
}
