import type { LifecycleEmailSubscriptionRepository } from "src/notifications/core/gateways/LifecycleEmailSubscriptionRepository";

export class InMemoryLifecycleEmailSubscriptionRepository implements LifecycleEmailSubscriptionRepository {
  private readonly unsubscribedAtByUserId = new Map<string, Date | null>();

  _setUnsubscribedAt(userId: string, unsubscribedAt: Date | null): void {
    this.unsubscribedAtByUserId.set(userId, unsubscribedAt);
  }

  _getUnsubscribedAt(userId: string): Date | null | undefined {
    return this.unsubscribedAtByUserId.get(userId);
  }

  markUnsubscribed(userId: string, unsubscribedAt: Date): Promise<void> {
    if (this.unsubscribedAtByUserId.get(userId) === null) {
      this.unsubscribedAtByUserId.set(userId, unsubscribedAt);
    }
    return Promise.resolve();
  }
}
