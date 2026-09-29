import type { LifecycleEmailDeliveryRepository } from "src/notifications/core/gateways/LifecycleEmailDeliveryRepository";
import type {
  LifecycleEmailDelivery,
  LifecycleEmailDeliveryStatus,
} from "src/notifications/core/models/lifecycleEmail";

// Takes the same backing array as InMemoryLifecycleEmailDeliveryQuery, so unit tests
// keep the CQS split at the interface without maintaining two separate stores.
export class InMemoryLifecycleEmailDeliveryRepository implements LifecycleEmailDeliveryRepository {
  private readonly deliveries: LifecycleEmailDelivery[];

  constructor(deliveries: LifecycleEmailDelivery[]) {
    this.deliveries = deliveries;
  }

  save(delivery: LifecycleEmailDelivery): Promise<void> {
    this.deliveries.push(delivery);
    return Promise.resolve();
  }

  markSent(deliveryId: string, sentAt: Date): Promise<void> {
    const delivery = this.deliveries.find((d) => d.id === deliveryId);
    if (delivery) {
      delivery.status = "sent";
      delivery.sentAt = sentAt;
    }
    return Promise.resolve();
  }

  markFailed(deliveryId: string, errorMessage: string): Promise<void> {
    const delivery = this.deliveries.find((d) => d.id === deliveryId);
    if (delivery) {
      delivery.status = "failed";
      delivery.errorMessage = errorMessage;
    }
    return Promise.resolve();
  }

  markAbandoned(deliveryId: string, errorMessage: string): Promise<void> {
    const delivery = this.deliveries.find((d) => d.id === deliveryId);
    if (delivery) {
      delivery.status = "abandoned";
      delivery.errorMessage = errorMessage;
    }
    return Promise.resolve();
  }

  claimForRetry(input: {
    id: string;
    expectedStatus: LifecycleEmailDeliveryStatus;
    expectedAttempts: number;
    attemptedAt: Date;
  }): Promise<boolean> {
    const delivery = this.deliveries.find(
      (d) =>
        d.id === input.id &&
        d.status === input.expectedStatus &&
        d.attempts === input.expectedAttempts,
    );
    if (!delivery) {
      return Promise.resolve(false);
    }
    delivery.status = "pending";
    delivery.attempts += 1;
    delivery.lastAttemptedAt = input.attemptedAt;
    return Promise.resolve(true);
  }
}
