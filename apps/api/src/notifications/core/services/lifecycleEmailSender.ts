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

// Rendered lazily: called only once the send is allowed (kill switch on, recipient subscribed,
// and, for send(), no prior delivery) and its ledger row is written or claimed, so a skipped
// send or retry never pays for it. Used by retry() and by the { render } variant of send().
export type RenderLifecycleEmail = (
  recipient: LifecycleEmailRecipient,
) => Promise<LifecycleEmailMessage>;

export const STRANDED_AT_CAP_ERROR_MESSAGE = "Stranded in pending after the last allowed attempt";

const toErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;

export type SendLifecycleEmailRequest = {
  userId: string;
  emailType: LifecycleEmailType;
  relatedEntityId?: string;
} & (
  | { message: LifecycleEmailMessage }
  // The project impacts summary computes the project's impacts to render: lazy so that a
  // disabled, unsubscribed or already-sent case computes nothing. A throw is recorded like a
  // mailer failure ("failed"), which the retry sweeper picks up.
  | { render: RenderLifecycleEmail }
);

/**
 * The single choke point every lifecycle email must go through. No lifecycle email
 * path may bypass this service — it is what guarantees the opt-out check (and the
 * delivery ledger) cannot be forgotten by a future email type.
 *
 * `send()` takes either an already-rendered `message` or a lazy `render(recipient)`: the
 * latter runs only after every check and the pending row, so an expensive render (the project
 * impacts summary's impacts computation) is skipped along with the send, and its failure is a
 * "failed" delivery like a mailer failure.
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

    // A render needs the recipient, so a missing one throws before any write. (A `message`
    // send for an unknown user throws too, later, on the ledger's user_id foreign key.)
    let resolveMessage: () => Promise<LifecycleEmailMessage>;
    if ("render" in request) {
      if (!recipient) {
        throw new Error(`Lifecycle email recipient ${request.userId} not found`);
      }
      const { render } = request;
      resolveMessage = () => render(recipient);
    } else {
      const { message } = request;
      resolveMessage = () => Promise.resolve(message);
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
      const message = await resolveMessage();
      await this.mailer.send(message);
    } catch (error) {
      const errorMessage = toErrorMessage(error, "Unknown send error");
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
    render: RenderLifecycleEmail,
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
