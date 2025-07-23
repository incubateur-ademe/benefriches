import { addMinutes } from "date-fns";

import { InMemoryTokenAuthenticationAttemptRepository } from "src/auth/adapters/auth-token-repository/InMemoryTokenAuthenticationAttemptRepository";
import { InMemoryAuthUserRepository } from "src/auth/adapters/auth-user-repository/InMemoryAuthUserRepository";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";

import { AuthenticatedUser } from "../adapters/auth-user-repository/AuthUsersRepository";
import { AuthenticateWithTokenUseCase } from "./authenticateWithToken.usecase";
import { TokenAuthenticationAttempt } from "./tokenAuthenticationAttempt";

describe("AuthenticateWithToken Use Case", () => {
  let dateProvider: DateProvider;
  let userRepository: InMemoryAuthUserRepository;
  let tokenAuthAttemptRepository: InMemoryTokenAuthenticationAttemptRepository;

  const fakeNow = new Date("2025-01-01T14:00:00Z");

  const buildAuthenticatedUser = (
    overrides: Partial<AuthenticatedUser> = {},
  ): AuthenticatedUser => ({
    id: "user-123",
    firstName: "John",
    lastName: "Doe",
    email: "user@example.com",
    structureType: "company",
    structureActivity: "urban_planner",
    structureName: "My Company",
    ...overrides,
  });

  const buildTokenAuthAttempt = (
    overrides: Partial<TokenAuthenticationAttempt> = {},
  ): TokenAuthenticationAttempt => ({
    userId: "user-123",
    token: "valid-token-123",
    email: "user@example.com",
    createdAt: fakeNow,
    expiresAt: addMinutes(fakeNow, 15),
    completedAt: null,
    ...overrides,
  });

  beforeEach(() => {
    dateProvider = new DeterministicDateProvider(fakeNow);
    userRepository = new InMemoryAuthUserRepository();
    tokenAuthAttemptRepository = new InMemoryTokenAuthenticationAttemptRepository();
  });

  describe("Error cases", () => {
    it("Cannot authenticate with non-existent token", async () => {
      const usecase = new AuthenticateWithTokenUseCase(
        tokenAuthAttemptRepository,
        userRepository,
        dateProvider,
      );

      const result = await usecase.execute({ token: "non-existent-token" });

      expect(result).toEqual({
        success: false,
        error: "TokenNotFound",
      });
    });

    it("Cannot authenticate with expired token", async () => {
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
      );

      const result = await usecase.execute({ token: expiredAttempt.token });

      expect(result).toEqual({
        success: false,
        error: "AuthenticationAttemptExpired",
      });
    });

    it("Cannot authenticate with already used token", async () => {
      const usedToken = buildTokenAuthAttempt({
        completedAt: new Date("2025-01-01T13:55:00Z"),
      });

      tokenAuthAttemptRepository.tokens = [usedToken];

      const usecase = new AuthenticateWithTokenUseCase(
        tokenAuthAttemptRepository,
        userRepository,
        dateProvider,
      );

      const result = await usecase.execute({ token: usedToken.token });

      expect(result).toEqual({
        success: false,
        error: "TokenAlreadyUsed",
      });
    });
  });

  describe("Success cases", () => {
    it("authenticates user and sets authentication attempt as completed", async () => {
      const user = buildAuthenticatedUser({
        email: "test@example.com",
      });
      const validToken = buildTokenAuthAttempt();

      const fakeNow = new Date("2025-01-01T14:00:00Z");
      dateProvider = new DeterministicDateProvider(fakeNow);
      userRepository._setUsers([user]);
      tokenAuthAttemptRepository.tokens = [validToken];

      const usecase = new AuthenticateWithTokenUseCase(
        tokenAuthAttemptRepository,
        userRepository,
        dateProvider,
      );

      const result = await usecase.execute({ token: validToken.token });

      expect(result).toEqual({
        success: true,
        user: {
          id: user.id,
          email: user.email,
        },
      });

      // Token should be marked as used
      const updatedToken = tokenAuthAttemptRepository.tokens.find(
        (t) => t.token === validToken.token,
      );
      expect(updatedToken?.completedAt).toEqual(fakeNow);
    });
  });
});
