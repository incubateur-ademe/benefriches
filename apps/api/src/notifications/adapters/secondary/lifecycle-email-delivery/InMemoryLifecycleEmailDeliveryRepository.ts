import type { LifecycleEmailDeliveryRepository } from "src/notifications/core/gateways/LifecycleEmailDeliveryRepository";
import type { LifecycleEmailDelivery } from "src/notifications/core/models/lifecycleEmail";

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
}
