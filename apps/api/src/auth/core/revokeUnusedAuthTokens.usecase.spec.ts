import { addMinutes } from "date-fns";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { InMemoryTokenAuthenticationAttemptRepository } from "src/auth/adapters/auth-token-repository/InMemoryTokenAuthenticationAttemptRepository";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { SilentLogger } from "src/shared-kernel/adapters/logger/SilentLogger";
import { SuccessResult } from "src/shared-kernel/result";

import { RevokeUnusedAuthTokensUseCase } from "./revokeUnusedAuthTokens.usecase";
import { TokenAuthenticationAttempt } from "./tokenAuthenticationAttempt";

describe("RevokeUnusedAuthTokens UseCase", () => {
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

  it("revokes an unused token", async () => {
    const tokenAuthAttemptRepository = new InMemoryTokenAuthenticationAttemptRepository();
    const unusedAttempt = buildTokenAuthAttempt({
      token: "t-unused",
      completedAt: null,
      revokedAt: null,
    });
    tokenAuthAttemptRepository.tokens = [unusedAttempt];
    const dateProvider = new DeterministicDateProvider(fakeNow);
    const usecase = new RevokeUnusedAuthTokensUseCase(
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
      { ...unusedAttempt, revokedAt: fakeNow },
    ] satisfies TokenAuthenticationAttempt[]);
  });

  it("leaves an already-used token alone", async () => {
    const tokenAuthAttemptRepository = new InMemoryTokenAuthenticationAttemptRepository();
    const usedAttempt = buildTokenAuthAttempt({
      token: "t-used",
      completedAt: new Date("2025-01-01T13:55:00Z"),
      revokedAt: null,
    });
    tokenAuthAttemptRepository.tokens = [usedAttempt];
    const dateProvider = new DeterministicDateProvider(fakeNow);
    const usecase = new RevokeUnusedAuthTokensUseCase(
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

  it("leaves an already-revoked token alone", async () => {
    const tokenAuthAttemptRepository = new InMemoryTokenAuthenticationAttemptRepository();
    const revokedAttempt = buildTokenAuthAttempt({
      token: "t-revoked",
      completedAt: null,
      revokedAt: new Date("2025-01-01T13:00:00Z"),
    });
    tokenAuthAttemptRepository.tokens = [revokedAttempt];
    const dateProvider = new DeterministicDateProvider(fakeNow);
    const usecase = new RevokeUnusedAuthTokensUseCase(
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

  it("counts only the unused tokens in a mixed set", async () => {
    const tokenAuthAttemptRepository = new InMemoryTokenAuthenticationAttemptRepository();
    const unusedAttempt1 = buildTokenAuthAttempt({
      token: "t-unused-1",
      completedAt: null,
      revokedAt: null,
    });
    const unusedAttempt2 = buildTokenAuthAttempt({
      token: "t-unused-2",
      completedAt: null,
      revokedAt: null,
    });
    const usedAttempt = buildTokenAuthAttempt({
      token: "t-used",
      completedAt: new Date("2025-01-01T13:55:00Z"),
      revokedAt: null,
    });
    const revokedAttempt = buildTokenAuthAttempt({
      token: "t-revoked",
      completedAt: null,
      revokedAt: new Date("2025-01-01T13:00:00Z"),
    });
    tokenAuthAttemptRepository.tokens = [
      unusedAttempt1,
      unusedAttempt2,
      usedAttempt,
      revokedAttempt,
    ];
    const dateProvider = new DeterministicDateProvider(fakeNow);
    const usecase = new RevokeUnusedAuthTokensUseCase(
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
      { ...unusedAttempt1, revokedAt: fakeNow },
      { ...unusedAttempt2, revokedAt: fakeNow },
      usedAttempt,
      revokedAttempt,
    ] satisfies TokenAuthenticationAttempt[]);
  });

  it("returns revokedCount: 0 when nothing is unused", async () => {
    const tokenAuthAttemptRepository = new InMemoryTokenAuthenticationAttemptRepository();
    const dateProvider = new DeterministicDateProvider(fakeNow);
    const usecase = new RevokeUnusedAuthTokensUseCase(
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
