import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { TResult, fail, success } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";

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

type AuthenticateWithTokenResult = TResult<
  { user: AuthenticatedUserInfo },
  "TokenNotFound" | "AuthenticationAttemptExpired" | "TokenAlreadyUsed"
>;

export class AuthenticateWithTokenUseCase implements UseCase<Request, AuthenticateWithTokenResult> {
  constructor(
    private readonly tokenAuthenticationAttemptRepository: TokenAuthenticationAttemptRepository,
    private readonly userRepository: UserRepository,
    private readonly dateProvider: DateProvider,
    private readonly tokenGenerator: TokenGenerator,
  ) {}

  async execute(request: Request): Promise<AuthenticateWithTokenResult> {
    const inputToken = request.token;

    const hashedToken = this.tokenGenerator.hash(inputToken);
    const existingToken = await this.tokenAuthenticationAttemptRepository.findByToken(hashedToken);

    if (!existingToken) return fail("TokenNotFound");
    if (existingToken.completedAt) return fail("TokenAlreadyUsed");
    if (existingToken.expiresAt < this.dateProvider.now())
      return fail("AuthenticationAttemptExpired");

    const authenticatedUser = await this.userRepository.getWithId(existingToken.userId);

    if (!authenticatedUser) {
      return fail("TokenNotFound");
    }

    await this.tokenAuthenticationAttemptRepository.markAsComplete(
      hashedToken,
      this.dateProvider.now(),
    );

    return success({ user: { id: authenticatedUser.id, email: authenticatedUser.email } });
  }
}
