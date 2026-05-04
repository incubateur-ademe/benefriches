import type { CRMGateway } from "src/marketing/core/CRMGateway";
import type { MarketingUsersQuery } from "src/marketing/core/gateways/MarketingUsersQuery";
import type { MarketingUsersRepository } from "src/marketing/core/gateways/MarketingUsersRepository";
import type { AppLogger } from "src/shared-kernel/logger";
import { success, type TResult } from "src/shared-kernel/result";
import type { UseCase } from "src/shared-kernel/usecase";

type Request = { dryRun: boolean };

export type SyncNewsletterSubscriptionsSummary = {
  totalUsers: number;
  updated: number;
  unchanged: number;
  missingInCrm: number;
  errored: number;
  dryRun: boolean;
};

type Result = TResult<SyncNewsletterSubscriptionsSummary, never>;

export class SyncNewsletterSubscriptionsUseCase implements UseCase<Request, Result> {
  constructor(
    private readonly usersQuery: MarketingUsersQuery,
    private readonly usersRepository: MarketingUsersRepository,
    private readonly crm: CRMGateway,
    private readonly logger: AppLogger,
  ) {}

  async execute(request: Request = { dryRun: false }): Promise<Result> {
    const dryRun = request.dryRun;
    const prefix = dryRun ? "[DRY RUN] " : "";
    const startedAt = Date.now();

    this.logger.info(`${prefix}Newsletter subscription sync started`);

    const users = await this.usersQuery.listAll();
    const summary: SyncNewsletterSubscriptionsSummary = {
      totalUsers: users.length,
      updated: 0,
      unchanged: 0,
      missingInCrm: 0,
      errored: 0,
      dryRun,
    };

    for (const user of users) {
      try {
        const contact = await this.crm.findContactByEmail(user.email);

        if (contact === null) {
          this.logger.warn(`Contact missing in CRM: email=${user.email}, userId=${user.id}`);
          summary.missingInCrm++;
          if (user.subscribedToNewsletter) {
            if (!dryRun) {
              await this.usersRepository.updateSubscriptionStatus(user.id, false);
            }
          }
          continue;
        }

        if (contact.subscribedToNewsletter === user.subscribedToNewsletter) {
          summary.unchanged++;
          continue;
        }

        this.logger.info(
          `${prefix}Drift detected: email=${user.email}, db=${user.subscribedToNewsletter}, crm=${contact.subscribedToNewsletter}`,
        );

        if (!dryRun) {
          await this.usersRepository.updateSubscriptionStatus(
            user.id,
            contact.subscribedToNewsletter,
          );
        }
        summary.updated++;
      } catch (error) {
        this.logger.error(`CRM call failed: email=${user.email}, userId=${user.id}`, error);
        summary.errored++;
      }
    }

    const durationMs = Date.now() - startedAt;
    this.logger.info(
      `${prefix}Newsletter subscription sync summary (durationMs=${durationMs}): total=${summary.totalUsers}, updated=${summary.updated}, unchanged=${summary.unchanged}, missingInCrm=${summary.missingInCrm}, errored=${summary.errored}`,
    );

    return success(summary);
  }
}
