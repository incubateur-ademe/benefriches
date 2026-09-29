import type { LifecycleEmailSubscriptionRepository } from "src/notifications/core/gateways/LifecycleEmailSubscriptionRepository";
import type { UnsubscribeTokenService } from "src/notifications/core/gateways/UnsubscribeTokenService";
import type { DateProvider } from "src/shared-kernel/dateProvider";
import { fail, success, type TResult } from "src/shared-kernel/result";
import type { UseCase } from "src/shared-kernel/usecase";

type Request = {
  token: string;
};

type UnsubscribeFromLifecycleEmailsResult = TResult<void, "InvalidUnsubscribeToken">;

/**
 * Global opt-out from every lifecycle email, from the link in their footer. Idempotent: a
 * second use of the same link succeeds and keeps the first unsubscribe date.
 *
 * A valid token for a user that no longer exists (deleted account) succeeds without writing,
 * rather than failing with a *NotFound error: the signature proves we issued the link, and
 * the confirmation page's promise ("you will no longer receive these emails") holds.
 */
export class UnsubscribeFromLifecycleEmailsUseCase implements UseCase<
  Request,
  UnsubscribeFromLifecycleEmailsResult
> {
  private readonly unsubscribeTokenService: UnsubscribeTokenService;
  private readonly subscriptionRepository: LifecycleEmailSubscriptionRepository;
  private readonly dateProvider: DateProvider;

  constructor(
    unsubscribeTokenService: UnsubscribeTokenService,
    subscriptionRepository: LifecycleEmailSubscriptionRepository,
    dateProvider: DateProvider,
  ) {
    this.unsubscribeTokenService = unsubscribeTokenService;
    this.subscriptionRepository = subscriptionRepository;
    this.dateProvider = dateProvider;
  }

  async execute({ token }: Request): Promise<UnsubscribeFromLifecycleEmailsResult> {
    const userId = this.unsubscribeTokenService.verify(token);
    if (!userId) {
      return fail("InvalidUnsubscribeToken");
    }

    await this.subscriptionRepository.markUnsubscribed(userId, this.dateProvider.now());

    return success();
  }
}
