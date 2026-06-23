import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { UidGenerator } from "src/shared-kernel/adapters/id-generator/UidGenerator";
import { DomainEventPublisher } from "src/shared-kernel/domainEventPublisher";
import { TResult, fail, success } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";

import { createLoginWithTokenFailedEvent } from "./events/loginWithTokenFailed.event";
import { TokenAuthenticationAttemptRepository } from "./gateways/TokenAuthenticationAttemptRepository";
import { UserRepository } from "./gateways/UsersRepository";
import { TokenGenerator } from "./sendAuthLink.usecase";

type Request = {
  token: string;
};

type AuthenticatedUserInfo = {
  id: string;
  email: string;
};

type AuthenticateWithTokenErrorType =
  | "TokenNotFound"
  | "AuthenticationAttemptExpired"
  | "TokenAlreadyUsed";

type AuthenticateWithTokenResult = TResult<
  { user: AuthenticatedUserInfo },
  AuthenticateWithTokenErrorType
>;

export class AuthenticateWithTokenUseCase implements UseCase<Request, AuthenticateWithTokenResult> {
  constructor(
    private readonly tokenAuthenticationAttemptRepository: TokenAuthenticationAttemptRepository,
    private readonly userRepository: UserRepository,
    private readonly dateProvider: DateProvider,
    private readonly tokenGenerator: TokenGenerator,
    private readonly eventPublisher: DomainEventPublisher,
    private readonly uuidGenerator: UidGenerator,
  ) {}

  async execute(request: Request): Promise<AuthenticateWithTokenResult> {
    const inputToken = request.token;

    const hashedToken = this.tokenGenerator.hash(inputToken);
    const existingToken = await this.tokenAuthenticationAttemptRepository.findByToken(hashedToken);

    if (!existingToken) return this.failWithEvent("TokenNotFound");
    if (existingToken.completedAt) return this.failWithEvent("TokenAlreadyUsed");
    if (existingToken.expiresAt < this.dateProvider.now())
      return this.failWithEvent("AuthenticationAttemptExpired");

    const authenticatedUser = await this.userRepository.getWithId(existingToken.userId);

    if (!authenticatedUser) {
      return this.failWithEvent("TokenNotFound");
    }

    await this.tokenAuthenticationAttemptRepository.markAsComplete(
      hashedToken,
      this.dateProvider.now(),
    );

    return success({ user: { id: authenticatedUser.id, email: authenticatedUser.email } });
  }

  private async failWithEvent(
    errorType: AuthenticateWithTokenErrorType,
  ): Promise<AuthenticateWithTokenResult> {
    await this.eventPublisher.publish(
      createLoginWithTokenFailedEvent(this.uuidGenerator.generate(), { errorType }),
    );
    return fail(errorType);
  }
}
