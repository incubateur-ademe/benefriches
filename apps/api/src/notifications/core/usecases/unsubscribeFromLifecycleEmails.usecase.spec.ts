import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { InMemoryLifecycleEmailSubscriptionRepository } from "src/notifications/adapters/secondary/lifecycle-email-subscription/InMemoryLifecycleEmailSubscriptionRepository";
import { HmacUnsubscribeTokenService } from "src/notifications/adapters/secondary/unsubscribe-token/HmacUnsubscribeTokenService";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";

import { UnsubscribeFromLifecycleEmailsUseCase } from "./unsubscribeFromLifecycleEmails.usecase";

const fakeNow = new Date("2026-01-01T10:00:00.000Z");
const secret = "unsubscribe-secret-for-tests";
const userId = "8d3b6a3e-5f1c-4b8e-9a7d-2c1e0f4b6a90";

// Flips a middle character of the signature (see HmacUnsubscribeTokenService.spec.ts).
const tamperSignature = (token: string): string => {
  const [version, id, signature = ""] = token.split(".");
  const index = Math.floor(signature.length / 2);
  const replacement = signature[index] === "A" ? "B" : "A";
  return `${version}.${id}.${signature.slice(0, index)}${replacement}${signature.slice(index + 1)}`;
};

describe("UnsubscribeFromLifecycleEmails UseCase", () => {
  it("unsubscribes the user a valid token was signed for", async () => {
    const repository = new InMemoryLifecycleEmailSubscriptionRepository();
    repository._setUnsubscribedAt(userId, null);
    const tokenService = new HmacUnsubscribeTokenService(secret);
    const usecase = new UnsubscribeFromLifecycleEmailsUseCase(
      tokenService,
      repository,
      new DeterministicDateProvider(fakeNow),
    );

    const result = await usecase.execute({ token: tokenService.sign(userId) });

    assert.strictEqual(result.isSuccess(), true);
    assert.deepStrictEqual(repository._getUnsubscribedAt(userId), fakeNow);
  });

  it("keeps the original unsubscribe date when the link is used again", async () => {
    const firstUnsubscribedAt = new Date("2025-06-01T08:00:00.000Z");
    const repository = new InMemoryLifecycleEmailSubscriptionRepository();
    repository._setUnsubscribedAt(userId, firstUnsubscribedAt);
    const tokenService = new HmacUnsubscribeTokenService(secret);
    const usecase = new UnsubscribeFromLifecycleEmailsUseCase(
      tokenService,
      repository,
      new DeterministicDateProvider(fakeNow),
    );

    const result = await usecase.execute({ token: tokenService.sign(userId) });

    assert.strictEqual(result.isSuccess(), true);
    assert.deepStrictEqual(repository._getUnsubscribedAt(userId), firstUnsubscribedAt);
  });

  it("fails with InvalidUnsubscribeToken and changes nothing when the token is tampered", async () => {
    const repository = new InMemoryLifecycleEmailSubscriptionRepository();
    repository._setUnsubscribedAt(userId, null);
    const tokenService = new HmacUnsubscribeTokenService(secret);
    const usecase = new UnsubscribeFromLifecycleEmailsUseCase(
      tokenService,
      repository,
      new DeterministicDateProvider(fakeNow),
    );

    const result = await usecase.execute({ token: tamperSignature(tokenService.sign(userId)) });

    assert.ok(result.isFailure());
    assert.strictEqual(result.getError(), "InvalidUnsubscribeToken");
    assert.strictEqual(repository._getUnsubscribedAt(userId), null);
  });

  it("succeeds without writing when the signed user no longer exists", async () => {
    const repository = new InMemoryLifecycleEmailSubscriptionRepository();
    const tokenService = new HmacUnsubscribeTokenService(secret);
    const usecase = new UnsubscribeFromLifecycleEmailsUseCase(
      tokenService,
      repository,
      new DeterministicDateProvider(fakeNow),
    );

    const result = await usecase.execute({ token: tokenService.sign(userId) });

    assert.strictEqual(result.isSuccess(), true);
    assert.strictEqual(repository._getUnsubscribedAt(userId), undefined);
  });
});
