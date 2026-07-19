/* eslint-env jest */
// Standard React act-environment flag. RNTL 14 wires its own renderer that
// doesn't read this global, so it does NOT silence the act warnings printed
// during tests — those are harmless console noise; tests still pass. Kept
// because it's the conventional, correct flag to set for React test envs.
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Clerk ships native/ESM the jest-expo transform can choke on; the app never
// loads it without a publishable key, so a stub keeps it out of the bundle.
jest.mock('@clerk/clerk-expo', () => ({}));

// AsyncStorage's native module needs the library's own in-memory jest mock.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Deterministic id for the dev-fake auth path.
jest.mock('expo-crypto', () => ({ randomUUID: () => 'test-uuid' }));

// react-native-view-shot / expo-sharing are native modules with no JS impl in
// the jest-expo environment; stub them so lib/share.ts is importable under test.
jest.mock('react-native-view-shot', () => ({
  captureRef: jest.fn(() => Promise.resolve('file:///mock.png')),
}));
jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn(() => Promise.resolve(true)),
  shareAsync: jest.fn(() => Promise.resolve()),
}));
