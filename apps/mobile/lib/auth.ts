// Auth for the API client. The server (apps/server/src/auth/AuthVerifier.ts,
// FakeAuthVerifier) reads `Authorization: Bearer <externalId>` — NOT the stale
// `x-test-user` header the planning doc mentions. Dev-fake mode sends a stable
// per-install id as that bearer token.
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import type { TokenCache } from '@clerk/clerk-expo';

const DEV_ID_KEY = 'charisma.devUserId';
const DEV_FAKE_AUTH = process.env.EXPO_PUBLIC_DEV_FAKE_AUTH === 'true';
export const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

// AsyncStorage-backed TokenCache for <ClerkProvider>. Clerk's own built-in
// cache needs expo-secure-store, which isn't a dependency here; AsyncStorage
// already is (it backs the dev-fake identity below), so reuse it.
export const tokenCache: TokenCache = {
  getToken: (key) => AsyncStorage.getItem(key),
  saveToken: (key, token) => AsyncStorage.setItem(key, token),
  clearToken: (key) => {
    void AsyncStorage.removeItem(key);
  },
};

let cachedDevId: string | null = null;

// Stable per-install identity: generated once, persisted so the same dev "user"
// survives app restarts.
export async function getDevUserId(): Promise<string> {
  if (cachedDevId) return cachedDevId;
  let id = await AsyncStorage.getItem(DEV_ID_KEY);
  if (!id) {
    id = Crypto.randomUUID();
    await AsyncStorage.setItem(DEV_ID_KEY, id);
  }
  cachedDevId = id;
  return id;
}

async function clearDevUserId(): Promise<void> {
  cachedDevId = null;
  await AsyncStorage.removeItem(DEV_ID_KEY);
}

// Clerk path: without a publishable key this is never exercised — the dynamic
// import keeps the SDK out of the dev-fake path and out of the jest bundle.
// getClerkInstance() returns the same singleton <ClerkProvider> initializes,
// so the active session (if any) is already attached here.
async function getClerkToken(): Promise<string | null> {
  if (!CLERK_PUBLISHABLE_KEY) return null;
  const { getClerkInstance } = await import('@clerk/clerk-expo');
  const clerk = getClerkInstance({ publishableKey: CLERK_PUBLISHABLE_KEY });
  const token = await clerk.session?.getToken();
  return token ?? null;
}

// True when the app is running the real, exercised auth path (dev-fake, or the
// fallback when Clerk has no key yet). Callers use it to decide whether to gate.
export function isAuthConfigured(): boolean {
  return DEV_FAKE_AUTH || !CLERK_PUBLISHABLE_KEY;
}

// Header for every API request. Falls back to the dev-fake identity when Clerk
// is not configured, so the app stays usable in this repo's default config.
export async function getAuthHeader(): Promise<Record<string, string>> {
  if (DEV_FAKE_AUTH || !CLERK_PUBLISHABLE_KEY) {
    const id = await getDevUserId();
    return { Authorization: `Bearer ${id}` };
  }
  const token = await getClerkToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Sign out: clears the persisted dev identity. The Clerk session itself is
// signed out via Clerk's own useAuth().signOut() in the ClerkAuthBridge
// (app/_layout.tsx) — that's the hook-bound path, this one is dev-fake only.
export async function signOut(): Promise<void> {
  await clearDevUserId();
}
