import { ConfigModule, ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";

import { FakeAuthLinkMailer } from "src/auth/adapters/auth-link-mailer/FakeAuthLinkMailer";
import { InMemoryTokenAuthenticationAttemptRepository } from "src/auth/adapters/auth-token-repository/InMemoryTokenAuthenticationAttemptRepository";
import { DeterministicTokenGenerator } from "src/auth/adapters/token-generator/DeterministicTokenGenerator";
import { InMemoryUserRepository } from "src/auth/adapters/user-repository/InMemoryAuthUserRepository";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";

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
    ...overrides,
  });

  beforeEach(async () => {
    dateProvider = new DeterministicDateProvider(fakeNow);
    userRepository = new InMemoryUserRepository();
    tokenAuthAttemptRepository = new InMemoryTokenAuthenticationAttemptRepository();
    authLinkMailer = new FakeAuthLinkMailer();
    tokenGenerator = new DeterministicTokenGenerator(fakeToken);
    const testModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ envFilePath: ".env.test" })],
    }).compile();

    configService = testModule.get<ConfigService>(ConfigService);
  });

  it("Cannot send auth link when user does not exist", async () => {
    const usecase = new SendAuthLinkUseCase(
      userRepository,
      tokenGenerator,
      tokenAuthAttemptRepository,
      authLinkMailer,
      dateProvider,
      configService,
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
  });

  it("prevents requesting new token within 1 minute", async () => {
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
    );

    const secondResult = await secondUsecase.execute({ email: user.email });
    expect(secondResult).toEqual({
      success: false,
      error: "TooManyRequests",
    });

    expect(tokenAuthAttemptRepository.tokens).toEqual([firstRequestToken]);
    expect(authLinkMailer.sentEmails).toHaveLength(1);
  });

  it("Allows new token after 1 minute", async () => {
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
    );

    const result = await usecase.execute({ email: "user@example.com" });

    expect(result).toEqual({ success: true });

    // auth token was saved
    expect(tokenAuthAttemptRepository.tokens).toEqual<TokenAuthenticationAttempt[]>([
      {
        userId: user.id,
        token: fakeToken,
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        sentAt: expect.any(Date),
      },
    ]);
  });
});
