import { subMinutes } from "date-fns";

import type { LifecycleEmailDeliveryQuery } from "src/notifications/core/gateways/LifecycleEmailDeliveryQuery";
import type { LifecycleEmailRecipient } from "src/notifications/core/gateways/LifecycleEmailRecipientQuery";
import type { LifecycleEmailMessage } from "src/notifications/core/gateways/Mailer";
import type { UnsubscribeTokenService } from "src/notifications/core/gateways/UnsubscribeTokenService";
import type { LifecycleEmailDelivery } from "src/notifications/core/models/lifecycleEmail";
import type { LifecycleEmailContact } from "src/notifications/core/models/lifecycleEmailContact";
import type {
  LifecycleEmailRetryOutcome,
  LifecycleEmailSender,
} from "src/notifications/core/services/lifecycleEmailSender";
import { buildFirstSiteReminderEmail } from "src/notifications/core/templates/firstSiteReminderEmail";
import { buildUnsubscribeUrl } from "src/notifications/core/templates/unsubscribeUrl";
import { buildWelcomeEmail } from "src/notifications/core/templates/welcomeEmail";
import type { DateProvider } from "src/shared-kernel/dateProvider";
import type { AppLogger } from "src/shared-kernel/logger";
import { success, type TResult } from "src/shared-kernel/result";
import type { UseCase } from "src/shared-kernel/usecase";

// A "pending" row is only stranded once no in-flight send can still be working on it.
// SmtpMailer's timeouts (connectionTimeout 5s, greetingTimeout 5s, socketTimeout 10s) cap
// an inline send at ~20s; 15 minutes is ~45x that, and short enough for a stranded row
// to be retried on the next hourly run. Measured from last_attempted_at, not created_at.
export const STALE_PENDING_THRESHOLD_MINUTES = 15;

export type RetryLifecycleEmailDeliveriesSummary = {
  candidates: number;
  sent: number;
  failed: number;
  abandoned: number;
  skippedDisabled: number;
  skippedUnsubscribed: number;
  skippedRecipientNotFound: number;
  skippedAlreadyClaimed: number;
  errored: number;
};

type Result = TResult<RetryLifecycleEmailDeliveriesSummary, never>;

const SUMMARY_KEY_BY_OUTCOME = {
  sent: "sent",
  failed: "failed",
  abandoned: "abandoned",
  "skipped-disabled": "skippedDisabled",
  "skipped-unsubscribed": "skippedUnsubscribed",
  "skipped-recipient-not-found": "skippedRecipientNotFound",
  "skipped-already-claimed": "skippedAlreadyClaimed",
} as const satisfies Record<LifecycleEmailRetryOutcome, keyof RetryLifecycleEmailDeliveriesSummary>;

export class RetryLifecycleEmailDeliveriesUseCase implements UseCase<void, Result> {
  private readonly deliveryQuery: LifecycleEmailDeliveryQuery;
  private readonly sender: LifecycleEmailSender;
  private readonly dateProvider: DateProvider;
  private readonly webappUrl: string;
  private readonly unsubscribeTokenService: UnsubscribeTokenService;
  private readonly contact: LifecycleEmailContact | undefined;
  private readonly logger: AppLogger;

  constructor(
    deliveryQuery: LifecycleEmailDeliveryQuery,
    sender: LifecycleEmailSender,
    dateProvider: DateProvider,
    webappUrl: string,
    unsubscribeTokenService: UnsubscribeTokenService,
    contact: LifecycleEmailContact | undefined,
    logger: AppLogger,
  ) {
    this.deliveryQuery = deliveryQuery;
    this.sender = sender;
    this.dateProvider = dateProvider;
    this.webappUrl = webappUrl;
    this.unsubscribeTokenService = unsubscribeTokenService;
    this.contact = contact;
    this.logger = logger;
  }

  async execute(): Promise<Result> {
    const candidates = await this.deliveryQuery.findRetryCandidates({
      stalePendingBefore: subMinutes(this.dateProvider.now(), STALE_PENDING_THRESHOLD_MINUTES),
    });

    const summary: RetryLifecycleEmailDeliveriesSummary = {
      candidates: candidates.length,
      sent: 0,
      failed: 0,
      abandoned: 0,
      skippedDisabled: 0,
      skippedUnsubscribed: 0,
      skippedRecipientNotFound: 0,
      skippedAlreadyClaimed: 0,
      errored: 0,
    };

    // Sequential on purpose: ~20 lifecycle emails a month, no need to hammer SMTP.
    for (const delivery of candidates) {
      try {
        const outcome = await this.sender.retry(delivery, (recipient) =>
          Promise.resolve(this.renderMessage(delivery, recipient)),
        );
        summary[SUMMARY_KEY_BY_OUTCOME[outcome]]++;
      } catch (error) {
        this.logger.error(`Retry failed for lifecycle email delivery ${delivery.id}`, error);
        summary.errored++;
      }
    }

    this.logger.info(
      `Lifecycle email retry summary: candidates=${summary.candidates}, sent=${summary.sent}, failed=${summary.failed}, abandoned=${summary.abandoned}, skippedDisabled=${summary.skippedDisabled}, skippedUnsubscribed=${summary.skippedUnsubscribed}, skippedRecipientNotFound=${summary.skippedRecipientNotFound}, skippedAlreadyClaimed=${summary.skippedAlreadyClaimed}, errored=${summary.errored}`,
    );

    return success(summary);
  }

  // The ledger stores no rendered message, so a retry re-renders it from the row and the
  // recipient's current address and names. A throw here is recorded by the sender as a
  // failed attempt. Exhaustive switch with no default: adding a value to
  // lifecycleEmailTypeSchema fails the typecheck here until its retry case is written.
  // Each case calls the same template builder as the type's send use case.
  private renderMessage(
    delivery: LifecycleEmailDelivery,
    recipient: LifecycleEmailRecipient,
  ): LifecycleEmailMessage {
    switch (delivery.emailType) {
      case "welcome":
        return {
          to: recipient.email,
          ...buildWelcomeEmail({
            recipientEmail: recipient.email,
            webappUrl: this.webappUrl,
            unsubscribeUrl: buildUnsubscribeUrl(
              this.webappUrl,
              this.unsubscribeTokenService.sign(delivery.userId),
            ),
          }),
        };
      case "first-site-reminder":
        // A row only exists if the contact was set when it was first sent, so this only
        // happens if someone removed it since.
        if (!this.contact) {
          throw new Error("Lifecycle email contact is not configured");
        }
        return {
          to: recipient.email,
          ...buildFirstSiteReminderEmail({
            firstName: recipient.firstName,
            lastName: recipient.lastName,
            contact: this.contact,
            webappUrl: this.webappUrl,
            unsubscribeUrl: buildUnsubscribeUrl(
              this.webappUrl,
              this.unsubscribeTokenService.sign(delivery.userId),
            ),
          }),
        };
    }
  }
}
