// There is deliberately no expiry test: the token carries no timestamp and the service has
// no DateProvider, so it cannot expire. An unsubscribe link that says "expired" sends people
// to support instead — do not add an expiry "for safety".
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { HmacUnsubscribeTokenService } from "./HmacUnsubscribeTokenService";

const secret = "unsubscribe-secret-for-tests";
const userId = "8d3b6a3e-5f1c-4b8e-9a7d-2c1e0f4b6a90";
const otherUserId = "1f2e3d4c-5b6a-4978-8a9b-0c1d2e3f4a5b";

const signatureOf = (token: string): string => token.split(".")[2] ?? "";

// Flips a middle character: the last base64url character of a 32-byte HMAC carries unused
// padding bits, so changing it may decode to the same bytes.
const tamperSignature = (token: string): string => {
  const [version, id, signature = ""] = token.split(".");
  const index = Math.floor(signature.length / 2);
  const replacement = signature[index] === "A" ? "B" : "A";
  return `${version}.${id}.${signature.slice(0, index)}${replacement}${signature.slice(index + 1)}`;
};

describe("HmacUnsubscribeTokenService", () => {
  it("verifies a token it signed, returning the user id", () => {
    const service = new HmacUnsubscribeTokenService(secret);
    const token = service.sign(userId);

    const result = service.verify(token);

    assert.strictEqual(result, userId);
  });

  it("signs the same user to the same token every time", () => {
    const service = new HmacUnsubscribeTokenService(secret);

    const first = service.sign(userId);
    const second = service.sign(userId);
    const fromOtherInstance = new HmacUnsubscribeTokenService(secret).sign(userId);

    assert.strictEqual(second, first);
    assert.strictEqual(fromOtherInstance, first);
  });

  it("produces a URL-safe token with the v1 prefix", () => {
    const service = new HmacUnsubscribeTokenService(secret);

    const token = service.sign(userId);

    assert.match(token, /^v1\.[0-9a-f-]{36}\.[A-Za-z0-9_-]+$/);
  });

  it("rejects a token whose signature was altered by one character", () => {
    const service = new HmacUnsubscribeTokenService(secret);
    const tampered = tamperSignature(service.sign(userId));

    const result = service.verify(tampered);

    assert.strictEqual(result, undefined);
  });

  it("rejects a token whose user id was swapped for another user's", () => {
    const service = new HmacUnsubscribeTokenService(secret);
    const swapped = `v1.${otherUserId}.${signatureOf(service.sign(userId))}`;

    const result = service.verify(swapped);

    assert.strictEqual(result, undefined);
  });

  it("rejects a token signed with a different secret", () => {
    const service = new HmacUnsubscribeTokenService(secret);
    const token = new HmacUnsubscribeTokenService("other-secret").sign(userId);

    const result = service.verify(token);

    assert.strictEqual(result, undefined);
  });

  const validSignature = signatureOf(new HmacUnsubscribeTokenService(secret).sign(userId));
  const malformedTokens: { name: string; token: string }[] = [
    { name: "an empty string", token: "" },
    { name: "a string without separators", token: "garbage" },
    { name: "a token without signature", token: `v1.${userId}` },
    { name: "a token with an unknown version", token: `v2.${userId}.${validSignature}` },
    { name: "a token whose user id is not a uuid", token: `v1.not-a-uuid.${validSignature}` },
    { name: "a token with an extra part", token: `v1.${userId}.${validSignature}.extra` },
    { name: "a token with a short signature", token: `v1.${userId}.abc` },
  ];
  for (const { name, token } of malformedTokens) {
    it(`rejects ${name} without throwing`, () => {
      const service = new HmacUnsubscribeTokenService(secret);

      const result = service.verify(token);

      assert.strictEqual(result, undefined);
    });
  }

  it("refuses to be built with an empty secret", () => {
    assert.throws(() => new HmacUnsubscribeTokenService(""));
  });
});
