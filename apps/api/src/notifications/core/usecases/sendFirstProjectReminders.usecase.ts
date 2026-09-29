import type { LifecycleEmailCohortQuery } from "src/notifications/core/gateways/LifecycleEmailCohortQuery";
import type { UnsubscribeTokenService } from "src/notifications/core/gateways/UnsubscribeTokenService";
import type { LifecycleEmailContact } from "src/notifications/core/models/lifecycleEmailContact";
import { computeReminderWindow } from "src/notifications/core/models/reminderWindow";
import type {
  LifecycleEmailSender,
  LifecycleEmailSendOutcome,
} from "src/notifications/core/services/lifecycleEmailSender";
import { buildFirstProjectReminderEmail } from "src/notifications/core/templates/firstProjectReminderEmail";
import { buildUnsubscribeUrl } from "src/notifications/core/templates/unsubscribeUrl";
import type { DateProvider } from "src/shared-kernel/dateProvider";
import type { AppLogger } from "src/shared-kernel/logger";
import { success, type TResult } from "src/shared-kernel/result";
import type { UseCase } from "src/shared-kernel/usecase";

type Request = {
  dryRun: boolean;
};

// Same shape as SendFirstSiteRemindersSummary; `eligible` counts sites, not users.
// Duplicated rather than extracted while there are only two reminders.
export type SendFirstProjectRemindersSummary = {
  eligible: number;
  sent: number;
  failed: number;
  skippedDisabled: number;
  skippedUnsubscribed: number;
  skippedAlreadySent: number;
  skippedContactNotConfigured: number;
  errored: number;
  dryRun: boolean;
};

type Result = TResult<SendFirstProjectRemindersSummary, never>;

const SUMMARY_KEY_BY_OUTCOME = {
  sent: "sent",
  failed: "failed",
  "skipped-disabled": "skippedDisabled",
  "skipped-unsubscribed": "skippedUnsubscribed",
  "skipped-already-sent": "skippedAlreadySent",
} as const satisfies Record<LifecycleEmailSendOutcome, keyof SendFirstProjectRemindersSummary>;

const CONTACT_NOT_CONFIGURED_WARNING =
  "Lifecycle email contact is not configured (LIFECYCLE_EMAILS_CONTACT_*): first project reminders not sent";

/**
 * Sends the first project reminder for every site the cohort query finds eligible (custom or
 * express, active, created 24–72 h ago, no project, no reminder row for that site yet, owner
 * not unsubscribed). One email per site, not per user: each ledger row is scoped to its site
 * (related_entity_id). Run by the daily job. The kill switch is not read here: with it off,
 * every `send()` returns "skipped-disabled" before any write. A dry run never calls the
 * sender, so it writes no ledger row and sends nothing, whatever the kill switch.
 */
export class SendFirstProjectRemindersUseCase implements UseCase<Request, Result> {
  private readonly cohortQuery: LifecycleEmailCohortQuery;
  private readonly sender: LifecycleEmailSender;
  private readonly dateProvider: DateProvider;
  private readonly webappUrl: string;
  private readonly unsubscribeTokenService: UnsubscribeTokenService;
  private readonly contact: LifecycleEmailContact | undefined;
  private readonly logger: AppLogger;

  constructor(
    cohortQuery: LifecycleEmailCohortQuery,
    sender: LifecycleEmailSender,
    dateProvider: DateProvider,
    webappUrl: string,
    unsubscribeTokenService: UnsubscribeTokenService,
    contact: LifecycleEmailContact | undefined,
    logger: AppLogger,
  ) {
    this.cohortQuery = cohortQuery;
    this.sender = sender;
    this.dateProvider = dateProvider;
    this.webappUrl = webappUrl;
    this.unsubscribeTokenService = unsubscribeTokenService;
    this.contact = contact;
    this.logger = logger;
  }

  async execute({ dryRun }: Request): Promise<Result> {
    const prefix = dryRun ? "[DRY RUN] " : "";
    const window = computeReminderWindow(this.dateProvider.now());
    this.logger.info(
      `${prefix}First project reminders: sites created after ${window.createdAfter.toISOString()} and at or before ${window.createdAtOrBefore.toISOString()}`,
    );

    const sites = await this.cohortQuery.findFirstProjectReminderSites(window);

    const summary: SendFirstProjectRemindersSummary = {
      eligible: sites.length,
      sent: 0,
      failed: 0,
      skippedDisabled: 0,
      skippedUnsubscribed: 0,
      skippedAlreadySent: 0,
      skippedContactNotConfigured: 0,
      errored: 0,
      dryRun,
    };

    if (dryRun) {
      for (const site of sites) {
        this.logger.info(
          `${prefix}Eligible for first project reminder: siteId=${site.siteId}, siteName=${site.siteName}, siteNature=${site.siteNature}, userId=${site.userId}, email=${site.email}, siteCreatedAt=${site.siteCreatedAt.toISOString()}`,
        );
      }
      if (!this.contact) {
        this.logger.warn(`${prefix}${CONTACT_NOT_CONFIGURED_WARNING}`);
      }
      this.logSummary(prefix, summary);
      return success(summary);
    }

    // Nothing is written, so the 72 h window catches the same sites on the next run once
    // the contact is set.
    const contact = this.contact;
    if (!contact) {
      this.logger.warn(CONTACT_NOT_CONFIGURED_WARNING);
      summary.skippedContactNotConfigured = sites.length;
      this.logSummary(prefix, summary);
      return success(summary);
    }

    // Sequential on purpose: under one reminder a day on average, no need to hammer SMTP.
    for (const site of sites) {
      try {
        const outcome = await this.sender.send({
          userId: site.userId,
          emailType: "first-project-reminder",
          relatedEntityId: site.siteId,
          message: {
            to: site.email,
            ...buildFirstProjectReminderEmail({
              firstName: site.firstName,
              lastName: site.lastName,
              site: { id: site.siteId, name: site.siteName, nature: site.siteNature },
              contact,
              webappUrl: this.webappUrl,
              unsubscribeUrl: buildUnsubscribeUrl(
                this.webappUrl,
                this.unsubscribeTokenService.sign(site.userId),
              ),
            }),
          },
        });
        summary[SUMMARY_KEY_BY_OUTCOME[outcome]]++;
      } catch (error) {
        // A DB error, or a concurrent run's unique violation: no email went out for this
        // site, and the rest of the cohort still gets theirs.
        this.logger.error(
          `First project reminder failed for site ${site.siteId} (user ${site.userId})`,
          error,
        );
        summary.errored++;
      }
    }

    this.logSummary(prefix, summary);
    return success(summary);
  }

  private logSummary(prefix: string, summary: SendFirstProjectRemindersSummary): void {
    this.logger.info(
      `${prefix}First project reminder summary: eligible=${summary.eligible}, sent=${summary.sent}, failed=${summary.failed}, skippedDisabled=${summary.skippedDisabled}, skippedUnsubscribed=${summary.skippedUnsubscribed}, skippedAlreadySent=${summary.skippedAlreadySent}, skippedContactNotConfigured=${summary.skippedContactNotConfigured}, errored=${summary.errored}`,
    );
  }
}
