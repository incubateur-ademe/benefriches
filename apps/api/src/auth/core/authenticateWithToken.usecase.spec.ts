import { addMinutes } from "date-fns";
import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";

import { InMemoryTokenAuthenticationAttemptRepository } from "src/auth/adapters/auth-token-repository/InMemoryTokenAuthenticationAttemptRepository";
import { InMemoryUserRepository } from "src/auth/adapters/user-repository/InMemoryAuthUserRepository";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import type { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { InMemoryEventPublisher } from "src/shared-kernel/adapters/events/publisher/InMemoryEventPublisher";
import { DeterministicUuidGenerator } from "src/shared-kernel/adapters/id-generator/DeterministicIdGenerator";
import type { FailureResult, SuccessResult } from "src/shared-kernel/result";
import { UserBuilder } from "src/users/core/model/user.mock";

import { DeterministicTokenGenerator } from "../adapters/token-generator/DeterministicTokenGenerator";
import { AuthenticateWithTokenUseCase } from "./authenticateWithToken.usecase";
import type { LoginWithTokenFailedEvent } from "./events/loginWithTokenFailed.event";
import { LOGIN_WITH_TOKEN_FAILED } from "./events/loginWithTokenFailed.event";
import type { TokenGenerator } from "./sendAuthLink.usecase";
import type { TokenAuthenticationAttempt } from "./tokenAuthenticationAttempt";

describe("AuthenticateWithToken Use Case", () => {
  let dateProvider: DateProvider;
  let userRepository: InMemoryUserRepository;
  let tokenAuthAttemptRepository: InMemoryTokenAuthenticationAttemptRepository;
  let tokenGenerator: TokenGenerator;
  let eventPublisher: InMemoryEventPublisher;
  let uuidGenerator: DeterministicUuidGenerator;

  const fakeNow = new Date("2025-01-01T14:00:00Z");
  const fakeToken = "token-123";
  const fakeTokenHashed = fakeToken + "-hashed";

  const buildTokenAuthAttempt = (
    overrides: Partial<TokenAuthenticationAttempt> = {},
  ): TokenAuthenticationAttempt => ({
    userId: "user-123",
    token: fakeTokenHashed,
    email: "user@example.com",
    createdAt: fakeNow,
    expiresAt: addMinutes(fakeNow, 15),
    completedAt: null,
    ...overrides,
  });

  beforeEach(() => {
    dateProvider = new DeterministicDateProvider(fakeNow);
    userRepository = new InMemoryUserRepository();
    tokenAuthAttemptRepository = new InMemoryTokenAuthenticationAttemptRepository();
    tokenGenerator = new DeterministicTokenGenerator(fakeToken);
    eventPublisher = new InMemoryEventPublisher();
    uuidGenerator = new DeterministicUuidGenerator();
  });

  describe("Error cases", () => {
    it("Cannot authenticate with non-existent token", async () => {
      uuidGenerator.nextUuids("event-id-1");
      const usecase = new AuthenticateWithTokenUseCase(
        tokenAuthAttemptRepository,
        userRepository,
        dateProvider,
        tokenGenerator,
        eventPublisher,
        uuidGenerator,
      );

      const result = await usecase.execute({ token: "non-existent-token" });

      assert.strictEqual(result.isFailure(), true);
      assert.strictEqual((result as FailureResult).getError(), "TokenNotFound");

      assert.strictEqual(eventPublisher.events.length, 1);
      assert.deepStrictEqual(eventPublisher.events[0], {
        id: "event-id-1",
        name: LOGIN_WITH_TOKEN_FAILED,
        payload: { errorType: "TokenNotFound" },
      } satisfies LoginWithTokenFailedEvent);
    });

    it("Cannot authenticate with expired token", async () => {
      uuidGenerator.nextUuids("event-id-1");
      dateProvider = new DeterministicDateProvider(new Date("2025-01-01T14:00:00Z"));
      const expiredAttempt = buildTokenAuthAttempt({
        createdAt: new Date("2025-01-01T13:00:00Z"),
        expiresAt: new Date("2025-01-01T13:30:00Z"),
      });

      tokenAuthAttemptRepository.tokens = [expiredAttempt];

      const usecase = new AuthenticateWithTokenUseCase(
        tokenAuthAttemptRepository,
        userRepository,
        dateProvider,
        tokenGenerator,
        eventPublisher,
        uuidGenerator,
      );

      const result = await usecase.execute({ token: fakeToken });

      assert.strictEqual(result.isFailure(), true);
      assert.strictEqual((result as FailureResult).getError(), "AuthenticationAttemptExpired");

      assert.strictEqual(eventPublisher.events.length, 1);
      assert.deepStrictEqual(eventPublisher.events[0], {
        id: "event-id-1",
        name: LOGIN_WITH_TOKEN_FAILED,
        payload: { errorType: "AuthenticationAttemptExpired" },
      } satisfies LoginWithTokenFailedEvent);
    });

    it("Cannot authenticate with already used token", async () => {
      uuidGenerator.nextUuids("event-id-1");
      const usedAttempt = buildTokenAuthAttempt({
        completedAt: new Date("2025-01-01T13:55:00Z"),
      });

      tokenAuthAttemptRepository.tokens = [usedAttempt];

      const usecase = new AuthenticateWithTokenUseCase(
        tokenAuthAttemptRepository,
        userRepository,
        dateProvider,
        tokenGenerator,
        eventPublisher,
        uuidGenerator,
      );

      const result = await usecase.execute({ token: fakeToken });

      assert.strictEqual(result.isFailure(), true);
      assert.strictEqual((result as FailureResult).getError(), "TokenAlreadyUsed");

      assert.strictEqual(eventPublisher.events.length, 1);
      assert.deepStrictEqual(eventPublisher.events[0], {
        id: "event-id-1",
        name: LOGIN_WITH_TOKEN_FAILED,
        payload: { errorType: "TokenAlreadyUsed" },
      } satisfies LoginWithTokenFailedEvent);
    });
  });

  describe("Success cases", () => {
    it("authenticates user and sets authentication attempt as completed", async () => {
      const user = new UserBuilder().withEmail("test@example.com").build();
      const validTokenAuthAttempt = buildTokenAuthAttempt({ userId: user.id, email: user.email });

      const fakeNow = new Date("2025-01-01T14:00:00Z");
      dateProvider = new DeterministicDateProvider(fakeNow);
      userRepository._setUsers([user]);
      tokenAuthAttemptRepository.tokens = [validTokenAuthAttempt];

      const usecase = new AuthenticateWithTokenUseCase(
        tokenAuthAttemptRepository,
        userRepository,
        dateProvider,
        tokenGenerator,
        eventPublisher,
        uuidGenerator,
      );

      const result = await usecase.execute({ token: fakeToken });

      assert.strictEqual(result.isSuccess(), true);
      const data = (result as SuccessResult<{ user: { id: string; email: string } }>).getData();
      assert.deepStrictEqual(data.user, {
        id: user.id,
        email: user.email,
      });

      // Token should be marked as used
      const updatedToken = tokenAuthAttemptRepository.tokens.find(
        (t) => t.token === validTokenAuthAttempt.token,
      );
      assert.deepStrictEqual(updatedToken?.completedAt, fakeNow);

      // No failure event on success
      assert.strictEqual(eventPublisher.events.length, 0);
    });
  });
});
