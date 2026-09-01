import { TokenAuthenticationAttemptRepository } from "src/auth/core/gateways/TokenAuthenticationAttemptRepository";
import { DateProvider } from "src/shared-kernel/dateProvider";
import { AppLogger } from "src/shared-kernel/logger";
import { TResult, success } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";

type Result = TResult<{ revokedCount: number }, never>;

export class RevokePendingAuthTokensUseCase implements UseCase<void, Result> {
  private readonly tokenAuthenticationAttemptRepository: TokenAuthenticationAttemptRepository;
  private readonly dateProvider: DateProvider;
  private readonly logger: AppLogger;

  constructor(
    tokenAuthenticationAttemptRepository: TokenAuthenticationAttemptRepository,
    dateProvider: DateProvider,
    logger: AppLogger,
  ) {
    this.tokenAuthenticationAttemptRepository = tokenAuthenticationAttemptRepository;
    this.dateProvider = dateProvider;
    this.logger = logger;
  }

  async execute(): Promise<Result> {
    const revokedCount = await this.tokenAuthenticationAttemptRepository.revokePendingAttempts(
      this.dateProvider.now(),
    );

    this.logger.info(`Pending auth tokens revoked: revokedCount=${revokedCount}`);

    return success({ revokedCount });
  }
}
