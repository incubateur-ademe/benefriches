import { ConfigModule, ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";

import { FakeAuthLinkMailer } from "src/auth/adapters/auth-link-mailer/FakeAuthLinkMailer";
import { InMemoryTokenAuthenticationAttemptRepository } from "src/auth/adapters/auth-token-repository/InMemoryTokenAuthenticationAttemptRepository";
import { DeterministicTokenGenerator } from "src/auth/adapters/token-generator/DeterministicTokenGenerator";
import { InMemoryUserRepository } from "src/auth/adapters/user-repository/InMemoryAuthUserRepository";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import type { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { InMemoryEventPublisher } from "src/shared-kernel/adapters/events/publisher/InMemoryEventPublisher";
import { DeterministicUuidGenerator } from "src/shared-kernel/adapters/id-generator/DeterministicIdGenerator";
import type { FailureResult } from "src/shared-kernel/result";

import { SendAuthLinkUseCase } from "./sendAuthLink.usecase";
import type { TokenAuthenticationAttempt } from "./tokenAuthenticationAttempt";
import type { User } from "./user";

describe("SendAuthLink Use Case", () => {
  let dateProvider: DateProvider;
  let userRepository: InMemoryUserRepository;
  let tokenAuthAttemptRepository: InMemoryTokenAuthenticationAttemptRepository;
  let authLinkMailer: FakeAuthLinkMailer;
  let tokenGenerator: DeterministicTokenGenerator;
  let configService: ConfigService;
  let uuidGenerator: DeterministicUuidGenerator;
  let eventPublisher: InMemoryEventPublisher;

  const fakeNow = new Date("2024-01-05T13:00:00Z");
  const fakeToken = "fake-token-123";

  const buildAuthenticatedUser = (overrides: Partial<User> = {}): User => ({
    id: "user-123",
    firstName: "John",
    lastName: "Doe",
    email: "user@example.com",
    structureType: "company",
    structureActivity: "urban_planner",
    structureName: "My Company",
    createdAt: new Date("2024-01-05T12:00:00Z"),
    personalDataAnalyticsUseConsentedAt: new Date("2024-01-05T12:00:00Z"),
    personalDataCommunicationUseConsentedAt: new Date("2024-01-05T12:00:00Z"),
    personalDataStorageConsentedAt: new Date("2024-01-05T12:00:00Z"),
    subscribedToNewsletter: true,
    ...overrides,
  });

  beforeEach(async () => {
    dateProvider = new DeterministicDateProvider(fakeNow);
    userRepository = new InMemoryUserRepository();
    tokenAuthAttemptRepository = new InMemoryTokenAuthenticationAttemptRepository();
    authLinkMailer = new FakeAuthLinkMailer();
    tokenGenerator = new DeterministicTokenGenerator(fakeToken);
    uuidGenerator = new DeterministicUuidGenerator();
    uuidGenerator.nextUuids("a-constant-uuid");
    eventPublisher = new InMemoryEventPublisher();

    const testModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ envFilePath: ".env.test" })],
    }).compile();

    configService = testModule.get<ConfigService>(ConfigService);
  });

  it("Cannot send auth link when user does not exist", async () => {
    uuidGenerator.nextUuids("failure-event-id", "attempt-event-id");
    const usecase = new SendAuthLinkUseCase(
      userRepository,
      tokenGenerator,
      tokenAuthAttemptRepository,
      authLinkMailer,
      dateProvider,
      configService,
      uuidGenerator,
      eventPublisher,
    );

    const result = await usecase.execute({ email: "nonexistent@example.com" });

    assert.strictEqual(result.isFailure(), true);
    assert.strictEqual((result as FailureResult).getError(), "UserDoesNotExist");

    // no token was saved
    assert.strictEqual(tokenAuthAttemptRepository.tokens.length, 0);
    // no email sent
    assert.strictEqual(authLinkMailer.sentEmails.length, 0);
    // failure event was published
    const found =
      authLinkMailer.sentEmails.length === 0 &&
      eventPublisher.events.find(
        (e) =>
          e.id === "failure-event-id" &&
          e.name === "auth.link-send-failed" &&
          (e.payload as { userEmail: string; error: string }).userEmail ===
            "nonexistent@example.com" &&
          (e.payload as { userEmail: string; error: string }).error === "UserDoesNotExist",
      );
    assert.ok(found !== undefined && found !== false);
  });

  it("prevents requesting new token within 1 minute", async () => {
    uuidGenerator.nextUuids("failure-event-id", "attempt-event-2", "attempt-event-1");
    const user = buildAuthenticatedUser();
    userRepository._setUsers([user]);

    // First request at 14:00
    const firstDate = new Date("2025-01-01T14:00:00Z");
    const firstDateProvider = new DeterministicDateProvider(firstDate);
    const firstUsecase = new SendAuthLinkUseCase(
      userRepository,
      tokenGenerator,
      tokenAuthAttemptRepository,
      authLinkMailer,
      firstDateProvider,
      configService,
      uuidGenerator,
      eventPublisher,
    );

    const firstResult = await firstUsecase.execute({ email: user.email });
    assert.strictEqual(firstResult.isSuccess(), true);
    assert.strictEqual(tokenAuthAttemptRepository.tokens.length, 1);
    const firstRequestToken = tokenAuthAttemptRepository.tokens[0];
    assert.strictEqual(authLinkMailer.sentEmails.length, 1);

    // Second request 30 seconds later
    const secondDate = new Date("2025-01-01T14:00:30Z");
    const secondDateProvider = new DeterministicDateProvider(secondDate);
    const secondUsecase = new SendAuthLinkUseCase(
      userRepository,
      tokenGenerator,
      tokenAuthAttemptRepository,
      authLinkMailer,
      secondDateProvider,
      configService,
      uuidGenerator,
      eventPublisher,
    );

    const secondResult = await secondUsecase.execute({ email: user.email });
    assert.strictEqual(secondResult.isFailure(), true);
    assert.strictEqual((secondResult as FailureResult).getError(), "TooManyRequests");

    assert.deepStrictEqual(tokenAuthAttemptRepository.tokens, [firstRequestToken]);
    assert.strictEqual(authLinkMailer.sentEmails.length, 1);

    // failure event was published
    const failureEvent = eventPublisher.events.find(
      (e) =>
        e.id === "failure-event-id" &&
        e.name === "auth.link-send-failed" &&
        (e.payload as { userEmail: string; error: string }).userEmail === user.email &&
        (e.payload as { userEmail: string; error: string }).error === "TooManyRequests",
    );
    assert.ok(failureEvent !== undefined);
  });

  it("Allows new token after 1 minute", async () => {
    uuidGenerator.nextUuids("attempt-1", "attempt-2");
    const user = buildAuthenticatedUser();
    userRepository._setUsers([user]);

    // First request at 14:00
    const firstDate = new Date("2025-01-01T14:00:00Z");
    const firstDateProvider = new DeterministicDateProvider(firstDate);
    const firstUsecase = new SendAuthLinkUseCase(
      userRepository,
      tokenGenerator,
      tokenAuthAttemptRepository,
      authLinkMailer,
      firstDateProvider,
      configService,
      uuidGenerator,
      eventPublisher,
    );

    await firstUsecase.execute({ email: user.email });

    // Second request 1 minute later
    const secondDate = new Date("2025-01-01T14:01:00Z");
    const secondDateProvider = new DeterministicDateProvider(secondDate);
    const secondUsecase = new SendAuthLinkUseCase(
      userRepository,
      tokenGenerator,
      tokenAuthAttemptRepository,
      authLinkMailer,
      secondDateProvider,
      configService,
      uuidGenerator,
      eventPublisher,
    );

    const secondResult = await secondUsecase.execute({ email: user.email });
    assert.strictEqual(secondResult.isSuccess(), true);

    assert.strictEqual(tokenAuthAttemptRepository.tokens.length, 2);
    assert.strictEqual(authLinkMailer.sentEmails.length, 2);
  });

  it("Sends auth link to existing user with expiration time of 1 minute (set from test env)", async () => {
    const user = buildAuthenticatedUser({
      email: "user@example.com",
    });
    userRepository._setUsers([user]);

    dateProvider = new DeterministicDateProvider(new Date("2025-01-01T14:00:00Z"));
    const usecase = new SendAuthLinkUseCase(
      userRepository,
      tokenGenerator,
      tokenAuthAttemptRepository,
      authLinkMailer,
      dateProvider,
      configService,
      uuidGenerator,
      eventPublisher,
    );

    const result = await usecase.execute({ email: "user@example.com" });

    assert.strictEqual(result.isSuccess(), true);

    // auth token was saved
    assert.deepStrictEqual(tokenAuthAttemptRepository.tokens, [
      {
        userId: user.id,
        token: fakeToken + "-hashed",
        email: user.email,
        createdAt: new Date(new Date("2025-01-01T14:00:00Z")),
        expiresAt: new Date(new Date("2025-01-01T14:01:00Z")),
        completedAt: null,
      },
    ] satisfies TokenAuthenticationAttempt[]);
    // auth link email was sent
    assert.strictEqual(authLinkMailer.sentEmails.length, 1);
    assert.strictEqual(authLinkMailer.sentEmails[0]?.email, user.email);
    assert.strictEqual(
      authLinkMailer.sentEmails[0]?.authLinkUrl,
      `http://app.test.benefriches.fr/authentification/token?token=${fakeToken}`,
    );
    assert.ok(authLinkMailer.sentEmails[0]?.sentAt instanceof Date);
  });
});
