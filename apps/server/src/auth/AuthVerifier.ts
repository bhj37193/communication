// AuthVerifier is a documented seam (PRD 3.x): FakeAuthVerifier here, a real
// ClerkAuthVerifier lands later behind the same interface. composition.ts is
// the only place that picks between them.
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
