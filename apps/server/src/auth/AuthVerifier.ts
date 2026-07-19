// AuthVerifier is a documented seam (PRD 3.x): FakeAuthVerifier here, a real
// ClerkAuthVerifier lands later behind the same interface. composition.ts is
// the only place that picks between them.
import { verifyToken } from '@clerk/backend';

export interface VerifiedIdentity {
  externalId: string;
}

export interface AuthVerifier {
  verify(authHeader: string | undefined): Promise<VerifiedIdentity | null>;
}

// Dev/test only: trusts a bearer token as the external user id directly.
// composition.ts refuses to select this provider when NODE_ENV=production.
export class FakeAuthVerifier implements AuthVerifier {
  async verify(authHeader: string | undefined): Promise<VerifiedIdentity | null> {
    if (!authHeader?.startsWith('Bearer ')) return null;
    const externalId = authHeader.slice('Bearer '.length).trim();
    return externalId ? { externalId } : null;
  }
}

// Production: verifies a real Clerk session token. `sub` is the Clerk user id
// (`user_xxx`), the same id the /v1/webhooks/clerk handler stores as
// users.clerkId — so a signed-in user and their webhook-created row converge.
// `verifyTokenFn` is injected (defaulting to the real @clerk/backend call) so
// tests can fake it without network access, mirroring AnthropicChatModel's
// injected-client pattern.
export class ClerkAuthVerifier implements AuthVerifier {
  constructor(
    private readonly secretKey: string,
    private readonly verifyTokenFn: typeof verifyToken = verifyToken,
  ) {}

  async verify(authHeader: string | undefined): Promise<VerifiedIdentity | null> {
    if (!authHeader?.startsWith('Bearer ')) return null;
    const token = authHeader.slice('Bearer '.length).trim();
    if (!token) return null;
    try {
      const payload = await this.verifyTokenFn(token, { secretKey: this.secretKey });
      return { externalId: payload.sub };
    } catch {
      return null;
    }
  }
}
