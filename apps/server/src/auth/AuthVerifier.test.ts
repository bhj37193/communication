// ClerkAuthVerifier unit tests: injected fake verifyToken, no network.
import { describe, expect, it, vi } from 'vitest';
import { ClerkAuthVerifier } from './AuthVerifier.js';

describe('ClerkAuthVerifier', () => {
  it('returns externalId from a valid token\'s sub claim', async () => {
    const verifyTokenFn = vi.fn().mockResolvedValue({ sub: 'user_123' });
    const verifier = new ClerkAuthVerifier('sk_test_x', verifyTokenFn as never);

    const result = await verifier.verify('Bearer good-token');

    expect(verifyTokenFn).toHaveBeenCalledWith('good-token', { secretKey: 'sk_test_x' });
    expect(result).toEqual({ externalId: 'user_123' });
  });

  it('returns null when the header is missing the Bearer prefix', async () => {
    const verifyTokenFn = vi.fn();
    const verifier = new ClerkAuthVerifier('sk_test_x', verifyTokenFn as never);

    expect(await verifier.verify('Basic good-token')).toBeNull();
    expect(await verifier.verify(undefined)).toBeNull();
    expect(verifyTokenFn).not.toHaveBeenCalled();
  });

  it('returns null when the token is empty after the Bearer prefix', async () => {
    const verifyTokenFn = vi.fn();
    const verifier = new ClerkAuthVerifier('sk_test_x', verifyTokenFn as never);

    expect(await verifier.verify('Bearer    ')).toBeNull();
    expect(verifyTokenFn).not.toHaveBeenCalled();
  });

  it('returns null when verifyToken rejects (expired/invalid/tampered token)', async () => {
    const verifyTokenFn = vi.fn().mockRejectedValue(new Error('invalid token'));
    const verifier = new ClerkAuthVerifier('sk_test_x', verifyTokenFn as never);

    expect(await verifier.verify('Bearer bad-token')).toBeNull();
  });
});
