import { addMinutes, subMinutes } from "date-fns";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { InMemoryTokenAuthenticationAttemptRepository } from "src/auth/adapters/auth-token-repository/InMemoryTokenAuthenticationAttemptRepository";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { SilentLogger } from "src/shared-kernel/adapters/logger/SilentLogger";
import { SuccessResult } from "src/shared-kernel/result";

import { RevokePendingAuthTokensUseCase } from "./revokePendingAuthTokens.usecase";
import { TokenAuthenticationAttempt } from "./tokenAuthenticationAttempt";

describe("RevokePendingAuthTokens UseCase", () => {
  const fakeNow = new Date("2025-01-01T14:00:00Z");

  const buildTokenAuthAttempt = (
    overrides: Partial<TokenAuthenticationAttempt> = {},
  ): TokenAuthenticationAttempt => ({
    userId: "user-123",
    token: "token-hashed",
    email: "user@example.com",
    createdAt: fakeNow,
    expiresAt: addMinutes(fakeNow, 15),
    completedAt: null,
    revokedAt: null,
    ...overrides,
  });

  it("revokes a pending token", async () => {
    const tokenAuthAttemptRepository = new InMemoryTokenAuthenticationAttemptRepository();
    const pendingAttempt = buildTokenAuthAttempt({
      token: "t-pending",
      completedAt: null,
      revokedAt: null,
      expiresAt: addMinutes(fakeNow, 15),
    });
    tokenAuthAttemptRepository.tokens = [pendingAttempt];
    const dateProvider = new DeterministicDateProvider(fakeNow);
    const usecase = new RevokePendingAuthTokensUseCase(
      tokenAuthAttemptRepository,
      dateProvider,
      new SilentLogger(),
    );

    const result = await usecase.execute();

    assert.strictEqual(result.isSuccess(), true);
    assert.deepStrictEqual((result as SuccessResult<{ revokedCount: number }>).getData(), {
      revokedCount: 1,
    });
    assert.deepStrictEqual(tokenAuthAttemptRepository.tokens, [
      { ...pendingAttempt, revokedAt: fakeNow },
    ] satisfies TokenAuthenticationAttempt[]);
  });

  it("leaves an already-used token alone", async () => {
    const tokenAuthAttemptRepository = new InMemoryTokenAuthenticationAttemptRepository();
    const usedAttempt = buildTokenAuthAttempt({
      token: "t-used",
      completedAt: new Date("2025-01-01T13:55:00Z"),
      revokedAt: null,
      expiresAt: addMinutes(fakeNow, 15),
    });
    tokenAuthAttemptRepository.tokens = [usedAttempt];
    const dateProvider = new DeterministicDateProvider(fakeNow);
    const usecase = new RevokePendingAuthTokensUseCase(
      tokenAuthAttemptRepository,
      dateProvider,
      new SilentLogger(),
    );

    const result = await usecase.execute();

    assert.strictEqual(result.isSuccess(), true);
    assert.deepStrictEqual((result as SuccessResult<{ revokedCount: number }>).getData(), {
      revokedCount: 0,
    });
    assert.deepStrictEqual(tokenAuthAttemptRepository.tokens, [
      usedAttempt,
    ] satisfies TokenAuthenticationAttempt[]);
  });

  it("leaves an expired token alone", async () => {
    const tokenAuthAttemptRepository = new InMemoryTokenAuthenticationAttemptRepository();
    const expiredAttempt = buildTokenAuthAttempt({
      token: "t-expired",
      completedAt: null,
      revokedAt: null,
      expiresAt: subMinutes(fakeNow, 1),
    });
    tokenAuthAttemptRepository.tokens = [expiredAttempt];
    const dateProvider = new DeterministicDateProvider(fakeNow);
    const usecase = new RevokePendingAuthTokensUseCase(
      tokenAuthAttemptRepository,
      dateProvider,
      new SilentLogger(),
    );

    const result = await usecase.execute();

    assert.strictEqual(result.isSuccess(), true);
    assert.deepStrictEqual((result as SuccessResult<{ revokedCount: number }>).getData(), {
      revokedCount: 0,
    });
    assert.deepStrictEqual(tokenAuthAttemptRepository.tokens, [
      expiredAttempt,
    ] satisfies TokenAuthenticationAttempt[]);
  });

  it("leaves an already-revoked token alone", async () => {
    const tokenAuthAttemptRepository = new InMemoryTokenAuthenticationAttemptRepository();
    const revokedAttempt = buildTokenAuthAttempt({
      token: "t-revoked",
      completedAt: null,
      revokedAt: new Date("2025-01-01T13:00:00Z"),
      expiresAt: addMinutes(fakeNow, 15),
    });
    tokenAuthAttemptRepository.tokens = [revokedAttempt];
    const dateProvider = new DeterministicDateProvider(fakeNow);
    const usecase = new RevokePendingAuthTokensUseCase(
      tokenAuthAttemptRepository,
      dateProvider,
      new SilentLogger(),
    );

    const result = await usecase.execute();

    assert.strictEqual(result.isSuccess(), true);
    assert.deepStrictEqual((result as SuccessResult<{ revokedCount: number }>).getData(), {
      revokedCount: 0,
    });
    assert.deepStrictEqual(tokenAuthAttemptRepository.tokens, [
      revokedAttempt,
    ] satisfies TokenAuthenticationAttempt[]);
  });

  it("counts only the pending tokens in a mixed set", async () => {
    const tokenAuthAttemptRepository = new InMemoryTokenAuthenticationAttemptRepository();
    const pendingAttempt1 = buildTokenAuthAttempt({
      token: "t-pending-1",
      completedAt: null,
      revokedAt: null,
      expiresAt: addMinutes(fakeNow, 15),
    });
    const pendingAttempt2 = buildTokenAuthAttempt({
      token: "t-pending-2",
      completedAt: null,
      revokedAt: null,
      expiresAt: addMinutes(fakeNow, 20),
    });
    const usedAttempt = buildTokenAuthAttempt({
      token: "t-used",
      completedAt: new Date("2025-01-01T13:55:00Z"),
      revokedAt: null,
      expiresAt: addMinutes(fakeNow, 15),
    });
    const expiredAttempt = buildTokenAuthAttempt({
      token: "t-expired",
      completedAt: null,
      revokedAt: null,
      expiresAt: subMinutes(fakeNow, 1),
    });
    const revokedAttempt = buildTokenAuthAttempt({
      token: "t-revoked",
      completedAt: null,
      revokedAt: new Date("2025-01-01T13:00:00Z"),
      expiresAt: addMinutes(fakeNow, 15),
    });
    tokenAuthAttemptRepository.tokens = [
      pendingAttempt1,
      pendingAttempt2,
      usedAttempt,
      expiredAttempt,
      revokedAttempt,
    ];
    const dateProvider = new DeterministicDateProvider(fakeNow);
    const usecase = new RevokePendingAuthTokensUseCase(
      tokenAuthAttemptRepository,
      dateProvider,
      new SilentLogger(),
    );

    const result = await usecase.execute();

    assert.strictEqual(result.isSuccess(), true);
    assert.deepStrictEqual((result as SuccessResult<{ revokedCount: number }>).getData(), {
      revokedCount: 2,
    });
    assert.deepStrictEqual(tokenAuthAttemptRepository.tokens, [
      { ...pendingAttempt1, revokedAt: fakeNow },
      { ...pendingAttempt2, revokedAt: fakeNow },
      usedAttempt,
      expiredAttempt,
      revokedAttempt,
    ] satisfies TokenAuthenticationAttempt[]);
  });

  it("returns revokedCount: 0 when nothing is pending", async () => {
    const tokenAuthAttemptRepository = new InMemoryTokenAuthenticationAttemptRepository();
    const dateProvider = new DeterministicDateProvider(fakeNow);
    const usecase = new RevokePendingAuthTokensUseCase(
      tokenAuthAttemptRepository,
      dateProvider,
      new SilentLogger(),
    );

    const result = await usecase.execute();

    assert.strictEqual(result.isSuccess(), true);
    assert.deepStrictEqual((result as SuccessResult<{ revokedCount: number }>).getData(), {
      revokedCount: 0,
    });
  });
});
