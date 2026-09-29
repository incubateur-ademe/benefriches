import type { LifecycleEmailDeliveryQuery } from "src/notifications/core/gateways/LifecycleEmailDeliveryQuery";
import type { LifecycleEmailDeliveryRepository } from "src/notifications/core/gateways/LifecycleEmailDeliveryRepository";
import type {
  LifecycleEmailRecipient,
  LifecycleEmailRecipientQuery,
} from "src/notifications/core/gateways/LifecycleEmailRecipientQuery";
import type { LifecycleEmailMessage, Mailer } from "src/notifications/core/gateways/Mailer";
import {
  LIFECYCLE_EMAIL_MAX_ATTEMPTS,
  type LifecycleEmailDelivery,
  type LifecycleEmailType,
} from "src/notifications/core/models/lifecycleEmail";
import type { DateProvider } from "src/shared-kernel/dateProvider";
import type { UidGenerator } from "src/shared-kernel/uidGenerator";

export type LifecycleEmailSendOutcome =
  "sent" | "failed" | "skipped-disabled" | "skipped-unsubscribed" | "skipped-already-sent";

export type LifecycleEmailRetryOutcome =
  | "sent"
  | "failed"
  | "abandoned"
  | "skipped-disabled"
  | "skipped-unsubscribed"
  | "skipped-recipient-not-found"
  | "skipped-already-claimed";

// Lazy: called only once the row is claimed, so skipped rows are never rendered.
export type RenderLifecycleEmailForRetry = (
  recipient: LifecycleEmailRecipient,
) => Promise<LifecycleEmailMessage>;

export const STRANDED_AT_CAP_ERROR_MESSAGE = "Stranded in pending after the last allowed attempt";

const toErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;

export type SendLifecycleEmailRequest = {
  userId: string;
  emailType: LifecycleEmailType;
  relatedEntityId?: string;
  message: LifecycleEmailMessage;
};

/**
 * The single choke point every lifecycle email must go through. No lifecycle email
 * path may bypass this service — it is what guarantees the opt-out check (and the
 * delivery ledger) cannot be forgotten by a future email type.
 */
export class LifecycleEmailSender {
  private readonly deliveryRepository: LifecycleEmailDeliveryRepository;
  private readonly deliveryQuery: LifecycleEmailDeliveryQuery;
  private readonly recipientQuery: LifecycleEmailRecipientQuery;
  private readonly mailer: Mailer;
  private readonly dateProvider: DateProvider;
  private readonly uidGenerator: UidGenerator;
  private readonly isEnabled: boolean;

  constructor(
    deliveryRepository: LifecycleEmailDeliveryRepository,
    deliveryQuery: LifecycleEmailDeliveryQuery,
    recipientQuery: LifecycleEmailRecipientQuery,
    mailer: Mailer,
    dateProvider: DateProvider,
    uidGenerator: UidGenerator,
    isEnabled: boolean,
  ) {
    this.deliveryRepository = deliveryRepository;
    this.deliveryQuery = deliveryQuery;
    this.recipientQuery = recipientQuery;
    this.mailer = mailer;
    this.dateProvider = dateProvider;
    this.uidGenerator = uidGenerator;
    this.isEnabled = isEnabled;
  }

  async send(request: SendLifecycleEmailRequest): Promise<LifecycleEmailSendOutcome> {
    // Checked first, before any ledger write: a disabled system must leave no rows,
    // otherwise the unique index would permanently block the email once re-enabled.
    if (!this.isEnabled) {
      return "skipped-disabled";
    }

    const relatedEntityId = request.relatedEntityId ?? null;

    const recipient = await this.recipientQuery.getById(request.userId);
    if (recipient?.unsubscribedAt) {
      return "skipped-unsubscribed";
    }

    const alreadyHasDelivery = await this.deliveryQuery.hasDelivery({
      userId: request.userId,
      emailType: request.emailType,
      relatedEntityId,
    });
    if (alreadyHasDelivery) {
      return "skipped-already-sent";
    }

    const deliveryId = this.uidGenerator.generate();
    const now = this.dateProvider.now();
    await this.deliveryRepository.save({
      id: deliveryId,
      userId: request.userId,
      emailType: request.emailType,
      relatedEntityId,
      status: "pending",
      createdAt: now,
      sentAt: null,
      errorMessage: null,
      attempts: 1,
      lastAttemptedAt: now,
    });

    try {
      await this.mailer.send(request.message);
    } catch (error) {
      const errorMessage = toErrorMessage(error, "Unknown mailer error");
      await this.deliveryRepository.markFailed(deliveryId, errorMessage);
      return "failed";
    }

    await this.deliveryRepository.markSent(deliveryId, this.dateProvider.now());
    return "sent";
  }

  /**
   * Tries an existing delivery again (the retry sweeper's path). Updates that same
   * ledger row, never inserts one. Never throws on a render or mailer failure.
   */
  async retry(
    delivery: LifecycleEmailDelivery,
    render: RenderLifecycleEmailForRetry,
  ): Promise<LifecycleEmailRetryOutcome> {
    if (!this.isEnabled) {
      return "skipped-disabled";
    }

    // Only a "pending" row stranded by a crash during its last allowed attempt gets here
    // (a failed last attempt is written "abandoned"). We can't know whether that attempt
    // went out, so give up rather than risk a duplicate.
    if (delivery.attempts >= LIFECYCLE_EMAIL_MAX_ATTEMPTS) {
      await this.deliveryRepository.markAbandoned(delivery.id, STRANDED_AT_CAP_ERROR_MESSAGE);
      return "abandoned";
    }

    const recipient = await this.recipientQuery.getById(delivery.userId);
    if (!recipient) {
      return "skipped-recipient-not-found";
    }
    if (recipient.unsubscribedAt) {
      return "skipped-unsubscribed";
    }

    const claimed = await this.deliveryRepository.claimForRetry({
      id: delivery.id,
      expectedStatus: delivery.status,
      expectedAttempts: delivery.attempts,
      attemptedAt: this.dateProvider.now(),
    });
    if (!claimed) {
      return "skipped-already-claimed";
    }

    try {
      const message = await render(recipient);
      await this.mailer.send(message);
    } catch (error) {
      const errorMessage = toErrorMessage(error, "Unknown retry error");
      if (delivery.attempts + 1 >= LIFECYCLE_EMAIL_MAX_ATTEMPTS) {
        await this.deliveryRepository.markAbandoned(delivery.id, errorMessage);
        return "abandoned";
      }
      await this.deliveryRepository.markFailed(delivery.id, errorMessage);
      return "failed";
    }

    // error_message is kept on purpose: the row then reads "failed with X, then sent".
    await this.deliveryRepository.markSent(delivery.id, this.dateProvider.now());
    return "sent";
  }
}
