import { ConfigService } from "@nestjs/config";
import { addMinutes, subMinutes } from "date-fns";

import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { UidGenerator } from "src/shared-kernel/adapters/id-generator/UidGenerator";
import { DomainEventPublisher } from "src/shared-kernel/domainEventPublisher";
import { UseCase } from "src/shared-kernel/usecase";

import { createAuthLinkSendFailedEvent } from "./events/authLinkSendFailed.event";
import { createLoginAttemptedEvent } from "./events/loginAttempted.event";
import { TokenAuthenticationAttemptRepository } from "./gateways/TokenAuthenticationAttemptRepository";
import { UserRepository } from "./gateways/UsersRepository";

export interface TokenGenerator {
  generatePair(): { raw: string; hashed: string };

  hash(raw: string): string;
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
    private readonly tokenAuthenticationAttemptRepository: TokenAuthenticationAttemptRepository,
    private readonly mailService: AuthLinkMailer,
    private readonly dateProvider: DateProvider,
    private readonly configService: ConfigService,
    private readonly uuidGenerator: UidGenerator,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute({ email, postLoginRedirectTo }: Request): Promise<SendAuthLinkResult> {
    await this.publishAttemptEvent(email);

    const user = await this.userRepository.getWithEmail(email);
    if (!user) {
      const errorName = "UserDoesNotExist";
      await this.publishFailureEvent(errorName, email);
      return { success: false, error: errorName };
    }

    const hasRecentUnusedToken =
      await this.tokenAuthenticationAttemptRepository.hasRecentUnusedTokenForUser(
        user.id,
        subMinutes(this.dateProvider.now(), 1),
      );

    if (hasRecentUnusedToken) {
      const errorName = "TooManyRequests";
      await this.publishFailureEvent(errorName, email);
      return { success: false, error: errorName };
    }

    const { raw: authToken, hashed: authTokenHashed } = this.tokenGenerator.generatePair();
    const expirationDate = addMinutes(this.dateProvider.now(), 15);

    await this.tokenAuthenticationAttemptRepository.save({
      userId: user.id,
      token: authTokenHashed,
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

  private async publishAttemptEvent(email: string) {
    await this.eventPublisher.publish(
      createLoginAttemptedEvent(this.uuidGenerator.generate(), {
        userEmail: email,
        method: "email-link",
      }),
    );
  }

  private async publishFailureEvent(errorName: SendAuthLinkFailureReason, email: string) {
    await this.eventPublisher.publish(
      createAuthLinkSendFailedEvent(this.uuidGenerator.generate(), {
        userEmail: email,
        error: errorName,
      }),
    );
  }
}
