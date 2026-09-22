import type { LifecycleEmailDelivery } from "src/notifications/core/models/lifecycleEmail";

export interface LifecycleEmailDeliveryRepository {
  save(delivery: LifecycleEmailDelivery): Promise<void>;
  markSent(deliveryId: string, sentAt: Date): Promise<void>;
  markFailed(deliveryId: string, errorMessage: string): Promise<void>;
}
