// Hand-rolled svix webhook signature verification (node:crypto, no new dep —
// the algorithm is a compact, well-documented HMAC-SHA256 scheme).
// https://docs.svix.com/receiving/verifying-payloads/how-manual
import { createHmac, timingSafeEqual } from 'node:crypto';

export function verifyClerkWebhook(
  secret: string,
  headers: { svixId: string | undefined; svixTimestamp: string | undefined; svixSignature: string | undefined },
  rawBody: string,
): unknown | null {
  if (secret === '') {
    // fake/test mode (BUILD-EXECUTION-PLAN 3.3): unsigned JSON bodies accepted.
    try {
      return JSON.parse(rawBody);
    } catch {
      return null;
    }
  }

  const { svixId, svixTimestamp, svixSignature } = headers;
  if (!svixId || !svixTimestamp || !svixSignature) return null;

  const signedContent = `${svixId}.${svixTimestamp}.${rawBody}`;
  const secretBytes = Buffer.from(secret.replace(/^whsec_/, ''), 'base64');
  const expected = createHmac('sha256', secretBytes).update(signedContent).digest();

  const valid = svixSignature.split(' ').some((candidate) => {
    const [version, sig] = candidate.split(',');
    if (version !== 'v1' || !sig) return false;
    const sigBytes = Buffer.from(sig, 'base64');
    return sigBytes.length === expected.length && timingSafeEqual(sigBytes, expected);
  });
  if (!valid) return null;

  try {
    return JSON.parse(rawBody);
  } catch {
    return null;
  }
}
