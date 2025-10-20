import { ConfigModule, ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";

import { FakeAuthLinkMailer } from "src/auth/adapters/auth-link-mailer/FakeAuthLinkMailer";
import { InMemoryTokenAuthenticationAttemptRepository } from "src/auth/adapters/auth-token-repository/InMemoryTokenAuthenticationAttemptRepository";
import { DeterministicTokenGenerator } from "src/auth/adapters/token-generator/DeterministicTokenGenerator";
import { InMemoryUserRepository } from "src/auth/adapters/user-repository/InMemoryAuthUserRepository";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { InMemoryEventPublisher } from "src/shared-kernel/adapters/events/publisher/InMemoryEventPublisher";
import { DeterministicUuidGenerator } from "src/shared-kernel/adapters/id-generator/DeterministicIdGenerator";

import { SendAuthLinkUseCase } from "./sendAuthLink.usecase";
import { TokenAuthenticationAttempt } from "./tokenAuthenticationAttempt";
import { User } from "./user";

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

    expect(result).toEqual({
      success: false,
      error: "UserDoesNotExist",
    });

    // no token was saved
    expect(tokenAuthAttemptRepository.tokens).toHaveLength(0);
    // no email sent
    expect(authLinkMailer.sentEmails).toHaveLength(0);
    // failure event was published
    expect(eventPublisher.events).toContainEqual({
      id: "failure-event-id",
      name: "auth.link-send-failed",
      payload: {
        userEmail: "nonexistent@example.com",
        error: "UserDoesNotExist",
      },
    });
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
    expect(firstResult).toEqual({ success: true });
    expect(tokenAuthAttemptRepository.tokens).toHaveLength(1);
    const firstRequestToken = tokenAuthAttemptRepository.tokens[0];
    expect(authLinkMailer.sentEmails).toHaveLength(1);

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
    expect(secondResult).toEqual({
      success: false,
      error: "TooManyRequests",
    });

    expect(tokenAuthAttemptRepository.tokens).toEqual([firstRequestToken]);
    expect(authLinkMailer.sentEmails).toHaveLength(1);

    // failure event was published
    expect(eventPublisher.events).toContainEqual({
      id: "failure-event-id",
      name: "auth.link-send-failed",
      payload: {
        userEmail: user.email,
        error: "TooManyRequests",
      },
    });
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
    expect(secondResult).toEqual({ success: true });

    expect(tokenAuthAttemptRepository.tokens).toHaveLength(2);
    expect(authLinkMailer.sentEmails).toHaveLength(2);
  });

  it("Sends auth link to existing user with expiration time of 15 minutes", async () => {
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

    expect(result).toEqual({ success: true });

    // auth token was saved
    expect(tokenAuthAttemptRepository.tokens).toEqual<TokenAuthenticationAttempt[]>([
      {
        userId: user.id,
        token: fakeToken + "-hashed",
        email: user.email,
        createdAt: new Date(new Date("2025-01-01T14:00:00Z")),
        expiresAt: new Date(new Date("2025-01-01T14:15:00Z")),
        completedAt: null,
      },
    ]);
    // auth link email was sent
    expect(authLinkMailer.sentEmails).toEqual([
      {
        email: user.email,
        authLinkUrl: `http://app.test.benefriches.fr/authentification/token?token=${fakeToken}`,
        // oxlint-disable-next-line typescript/no-unsafe-assignment
        sentAt: expect.any(Date),
      },
    ]);
  });
});
