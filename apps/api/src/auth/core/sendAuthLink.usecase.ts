import { ConfigService } from "@nestjs/config";
import { addMinutes, subMinutes } from "date-fns";

import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { UseCase } from "src/shared-kernel/usecase";

import { TokenAuthenticationAttemptRepository } from "./gateways/TokenAuthenticationAttemptRepository";
import { UserRepository } from "./gateways/UsersRepository";

export interface TokenGenerator {
  generate(): string;
}

export interface AuthLinkMailer {
  sendAuthLink(email: string, authLinkUrl: string): Promise<void>;
}

type Request = {
  email: string;
  postLoginRedirectTo?: string;
};

type SendAuthLinkFailureReason = "UserDoesNotExist" | "TooManyRequests";

type SendAuthLinkResult = { success: true } | { success: false; error: SendAuthLinkFailureReason };

export class SendAuthLinkUseCase implements UseCase<Request, SendAuthLinkResult> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenGenerator: TokenGenerator,
    private readonly authByTokenRequestRepository: TokenAuthenticationAttemptRepository,
    private readonly mailService: AuthLinkMailer,
    private readonly dateProvider: DateProvider,
    private readonly configService: ConfigService,
  ) {}

  async execute({ email, postLoginRedirectTo }: Request): Promise<SendAuthLinkResult> {
    const user = await this.userRepository.getWithEmail(email);
    if (!user) return { success: false, error: "UserDoesNotExist" };

    const hasRecentUnusedToken =
      await this.authByTokenRequestRepository.hasRecentUnusedTokenForUser(
        user.id,
        subMinutes(this.dateProvider.now(), 1),
      );

    if (hasRecentUnusedToken) return { success: false, error: "TooManyRequests" };

    const authToken = this.tokenGenerator.generate();
    const expirationDate = addMinutes(this.dateProvider.now(), 15);

    await this.authByTokenRequestRepository.save({
      userId: user.id,
      token: authToken,
      email: user.email,
      createdAt: this.dateProvider.now(),
      completedAt: null,
      expiresAt: expirationDate,
    });

    const webappUrl = this.configService.getOrThrow<string>("WEBAPP_URL");
    const authLink = new URL(`${webappUrl}/authentification/token`);
    authLink.searchParams.set("token", authToken);
    if (postLoginRedirectTo) {
      authLink.searchParams.set("redirectTo", postLoginRedirectTo);
    }

    await this.mailService.sendAuthLink(email, authLink.toString());

    return { success: true };
  }
}
