import { createHmac, timingSafeEqual } from "node:crypto";

import type { UnsubscribeTokenService } from "src/notifications/core/gateways/UnsubscribeTokenService";

const TOKEN_VERSION = "v1";
// Domain separation: this key only ever signs unsubscribe tokens of this version.
const SIGNED_PAYLOAD_PREFIX = "lifecycle-emails-unsubscribe:v1:";
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

/**
 * Stateless unsubscribe token: `v1.<userId>.<base64url(HMAC-SHA256(secret, prefix + userId))>`.
 *
 * - Non-expiring by construction: no timestamp in the token, no clock in this class.
 * - Deterministic per user: every email to a user carries the same link, so replays and
 *   forwarded emails keep working, with nothing stored.
 * - Revocation is only possible by rotating the secret, which invalidates every link sent.
 */
export class HmacUnsubscribeTokenService implements UnsubscribeTokenService {
  private readonly secret: string;

  constructor(secret: string) {
    if (!secret) {
      // An empty HMAC key would make every token forgeable.
      throw new Error("HmacUnsubscribeTokenService requires a non-empty secret");
    }
    this.secret = secret;
  }

  sign(userId: string): string {
    return `${TOKEN_VERSION}.${userId}.${this.computeSignature(userId)}`;
  }

  verify(token: string): string | undefined {
    const parts = token.split(".");
    if (parts.length !== 3) return undefined;

    const [version, userId, signature] = parts as [string, string, string];
    if (version !== TOKEN_VERSION || !UUID_REGEX.test(userId)) return undefined;

    // Compare the base64url strings, not decoded bytes: the last base64url character of a
    // 32-byte HMAC carries unused bits, so different strings can decode to the same bytes.
    const expected = Buffer.from(this.computeSignature(userId));
    const actual = Buffer.from(signature);
    // timingSafeEqual throws on buffers of different lengths.
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
      return undefined;
    }

    return userId;
  }

  private computeSignature(userId: string): string {
    return createHmac("sha256", this.secret)
      .update(`${SIGNED_PAYLOAD_PREFIX}${userId}`)
      .digest("base64url");
  }
}
