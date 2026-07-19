import { ClerkProvider, useAuth as useClerkAuth } from '@clerk/clerk-expo';
import { Stack } from 'expo-router';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  CLERK_PUBLISHABLE_KEY,
  getDevUserId,
  isAuthConfigured,
  signOut as authSignOut,
  tokenCache,
} from '../lib/auth';

interface AuthContextValue {
  ready: boolean;
  // True when a usable auth identity exists (dev-fake, or a signed-in Clerk user).
  authenticated: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// Dev-fake / no-Clerk-key path: unchanged from before Clerk was wired.
function DevAuthProvider({ children }: { children: ReactNode }) {
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

// Clerk-configured path: bridges Clerk's own useAuth()/signOut() into the same
// AuthContextValue shape so screens (index.tsx, profile.tsx) never need to
// know which auth backend is active.
function ClerkAuthBridge({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, signOut: clerkSignOut } = useClerkAuth();

  const value: AuthContextValue = {
    ready: isLoaded,
    authenticated: !!isSignedIn,
    signOut: async () => {
      await clerkSignOut();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Static per-process: a real Clerk key with dev-fake off. ClerkProvider throws
// without a publishable key, so it can only ever mount when this is true.
const USE_CLERK = !isAuthConfigured();

export default function RootLayout() {
  const screens = (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: 'Charisma Trainer' }} />
      <Stack.Screen name="chat" options={{ title: 'The Housewarming' }} />
      <Stack.Screen name="result" options={{ title: 'Your Result' }} />
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
      <Stack.Screen name="sign-in" options={{ title: 'Sign in' }} />
      <Stack.Screen name="sign-up" options={{ title: 'Sign up' }} />
    </Stack>
  );

  if (USE_CLERK) {
    return (
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
        <ClerkAuthBridge>{screens}</ClerkAuthBridge>
      </ClerkProvider>
    );
  }

  return <DevAuthProvider>{screens}</DevAuthProvider>;
}
