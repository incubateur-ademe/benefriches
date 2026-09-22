import type { LifecycleEmailDeliveryQuery } from "src/notifications/core/gateways/LifecycleEmailDeliveryQuery";
import type { LifecycleEmailDeliveryRepository } from "src/notifications/core/gateways/LifecycleEmailDeliveryRepository";
import type { LifecycleEmailRecipientQuery } from "src/notifications/core/gateways/LifecycleEmailRecipientQuery";
import type { LifecycleEmailMessage, Mailer } from "src/notifications/core/gateways/Mailer";
import type { LifecycleEmailType } from "src/notifications/core/models/lifecycleEmail";
import type { DateProvider } from "src/shared-kernel/dateProvider";
import type { UidGenerator } from "src/shared-kernel/uidGenerator";

export type LifecycleEmailSendOutcome =
  "sent" | "failed" | "skipped-disabled" | "skipped-unsubscribed" | "skipped-already-sent";

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
    await this.deliveryRepository.save({
      id: deliveryId,
      userId: request.userId,
      emailType: request.emailType,
      relatedEntityId,
      status: "pending",
      createdAt: this.dateProvider.now(),
      sentAt: null,
      errorMessage: null,
    });

    try {
      await this.mailer.send(request.message);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown mailer error";
      await this.deliveryRepository.markFailed(deliveryId, errorMessage);
      return "failed";
    }

    await this.deliveryRepository.markSent(deliveryId, this.dateProvider.now());
    return "sent";
  }
}
