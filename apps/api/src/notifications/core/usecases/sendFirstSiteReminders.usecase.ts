import type { LifecycleEmailCohortQuery } from "src/notifications/core/gateways/LifecycleEmailCohortQuery";
import type { UnsubscribeTokenService } from "src/notifications/core/gateways/UnsubscribeTokenService";
import type { LifecycleEmailContact } from "src/notifications/core/models/lifecycleEmailContact";
import { computeReminderWindow } from "src/notifications/core/models/reminderWindow";
import type {
  LifecycleEmailSender,
  LifecycleEmailSendOutcome,
} from "src/notifications/core/services/lifecycleEmailSender";
import { buildFirstSiteReminderEmail } from "src/notifications/core/templates/firstSiteReminderEmail";
import { buildUnsubscribeUrl } from "src/notifications/core/templates/unsubscribeUrl";
import type { DateProvider } from "src/shared-kernel/dateProvider";
import type { AppLogger } from "src/shared-kernel/logger";
import { success, type TResult } from "src/shared-kernel/result";
import type { UseCase } from "src/shared-kernel/usecase";

type Request = {
  dryRun: boolean;
};

export type SendFirstSiteRemindersSummary = {
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

type Result = TResult<SendFirstSiteRemindersSummary, never>;

const SUMMARY_KEY_BY_OUTCOME = {
  sent: "sent",
  failed: "failed",
  "skipped-disabled": "skippedDisabled",
  "skipped-unsubscribed": "skippedUnsubscribed",
  "skipped-already-sent": "skippedAlreadySent",
} as const satisfies Record<LifecycleEmailSendOutcome, keyof SendFirstSiteRemindersSummary>;

const CONTACT_NOT_CONFIGURED_WARNING =
  "Lifecycle email contact is not configured (LIFECYCLE_EMAILS_CONTACT_*): first site reminders not sent";

/**
 * Sends the first site reminder to everyone the cohort query finds eligible (registered
 * 24–72 h ago, no site at all, no reminder row yet, not unsubscribed). Run by the daily
 * job. The kill switch is not read here: with it off, every `send()` returns
 * "skipped-disabled" before any write. A dry run never calls the sender, so it writes no
 * ledger row and sends nothing, whatever the kill switch.
 */
export class SendFirstSiteRemindersUseCase implements UseCase<Request, Result> {
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
      `${prefix}First site reminders: registered after ${window.createdAfter.toISOString()} and at or before ${window.createdAtOrBefore.toISOString()}`,
    );

    const recipients = await this.cohortQuery.findFirstSiteReminderRecipients(window);

    const summary: SendFirstSiteRemindersSummary = {
      eligible: recipients.length,
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
      for (const recipient of recipients) {
        this.logger.info(
          `${prefix}Eligible for first site reminder: userId=${recipient.userId}, email=${recipient.email}, registeredAt=${recipient.registeredAt.toISOString()}`,
        );
      }
      if (!this.contact) {
        this.logger.warn(`${prefix}${CONTACT_NOT_CONFIGURED_WARNING}`);
      }
      this.logSummary(prefix, summary);
      return success(summary);
    }

    // Nothing is written, so the 72 h window catches the same users on the next run once
    // the contact is set.
    const contact = this.contact;
    if (!contact) {
      this.logger.warn(CONTACT_NOT_CONFIGURED_WARNING);
      summary.skippedContactNotConfigured = recipients.length;
      this.logSummary(prefix, summary);
      return success(summary);
    }

    // Sequential on purpose: under one reminder a day on average, no need to hammer SMTP.
    for (const recipient of recipients) {
      try {
        const outcome = await this.sender.send({
          userId: recipient.userId,
          emailType: "first-site-reminder",
          message: {
            to: recipient.email,
            ...buildFirstSiteReminderEmail({
              firstName: recipient.firstName,
              lastName: recipient.lastName,
              contact,
              webappUrl: this.webappUrl,
              unsubscribeUrl: buildUnsubscribeUrl(
                this.webappUrl,
                this.unsubscribeTokenService.sign(recipient.userId),
              ),
            }),
          },
        });
        summary[SUMMARY_KEY_BY_OUTCOME[outcome]]++;
      } catch (error) {
        // A DB error, or a concurrent run's unique violation: no email went out for this
        // user, and the rest of the cohort still gets theirs.
        this.logger.error(`First site reminder failed for user ${recipient.userId}`, error);
        summary.errored++;
      }
    }

    this.logSummary(prefix, summary);
    return success(summary);
  }

  private logSummary(prefix: string, summary: SendFirstSiteRemindersSummary): void {
    this.logger.info(
      `${prefix}First site reminder summary: eligible=${summary.eligible}, sent=${summary.sent}, failed=${summary.failed}, skippedDisabled=${summary.skippedDisabled}, skippedUnsubscribed=${summary.skippedUnsubscribed}, skippedAlreadySent=${summary.skippedAlreadySent}, skippedContactNotConfigured=${summary.skippedContactNotConfigured}, errored=${summary.errored}`,
    );
  }
}
