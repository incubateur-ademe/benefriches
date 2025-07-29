import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { UseCase } from "src/shared-kernel/usecase";

import { TokenAuthenticationAttemptRepository } from "./gateways/TokenAuthenticationAttemptRepository";
import { UserRepository } from "./gateways/UsersRepository";

type Request = {
  token: string;
};

type AuthenticatedUserInfo = {
  id: string;
  email: string;
};

type Result =
  | {
      success: true;
      user: AuthenticatedUserInfo;
    }
  | {
      success: false;
      error: "TokenNotFound" | "AuthenticationAttemptExpired" | "TokenAlreadyUsed";
    };

export class AuthenticateWithTokenUseCase implements UseCase<Request, Result> {
  constructor(
    private readonly authByTokenRequestRepository: TokenAuthenticationAttemptRepository,
    private readonly userRepository: UserRepository,
    private readonly dateProvider: DateProvider,
  ) {}

  async execute(request: Request): Promise<Result> {
    const inputToken = request.token;

    const existingToken = await this.authByTokenRequestRepository.findByToken(inputToken);
    if (!existingToken) return { success: false, error: "TokenNotFound" };
    if (existingToken.completedAt) return { success: false, error: "TokenAlreadyUsed" };
    if (existingToken.expiresAt < this.dateProvider.now())
      return { success: false, error: "AuthenticationAttemptExpired" };

    const authenticatedUser = await this.userRepository.getWithId(existingToken.userId);

    if (!authenticatedUser) {
      return { success: false, error: "TokenNotFound" };
    }

    await this.authByTokenRequestRepository.markAsComplete(inputToken, this.dateProvider.now());

    return { success: true, user: { id: authenticatedUser.id, email: authenticatedUser.email } };
  }
}
