import type {
  LifecycleEmailDelivery,
  LifecycleEmailDeliveryStatus,
} from "src/notifications/core/models/lifecycleEmail";

export interface LifecycleEmailDeliveryRepository {
  save(delivery: LifecycleEmailDelivery): Promise<void>;
  markSent(deliveryId: string, sentAt: Date): Promise<void>;
  markFailed(deliveryId: string, errorMessage: string): Promise<void>;
  markAbandoned(deliveryId: string, errorMessage: string): Promise<void>;
  // Optimistic claim: moves the row back to "pending" with one more attempt, but only if
  // it still has the status and attempt count the caller read. Returns false when another
  // run claimed it first (nothing is written then).
  claimForRetry(input: {
    id: string;
    expectedStatus: LifecycleEmailDeliveryStatus;
    expectedAttempts: number;
    attemptedAt: Date;
  }): Promise<boolean>;
}
