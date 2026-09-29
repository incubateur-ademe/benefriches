import type { LifecycleEmailDeliveryQuery } from "src/notifications/core/gateways/LifecycleEmailDeliveryQuery";
import type {
  LifecycleEmailDelivery,
  LifecycleEmailType,
} from "src/notifications/core/models/lifecycleEmail";

export class InMemoryLifecycleEmailDeliveryQuery implements LifecycleEmailDeliveryQuery {
  private readonly deliveries: LifecycleEmailDelivery[];

  constructor(deliveries: LifecycleEmailDelivery[]) {
    this.deliveries = deliveries;
  }

  hasDelivery(input: {
    userId: string;
    emailType: LifecycleEmailType;
    relatedEntityId: string | null;
  }): Promise<boolean> {
    return Promise.resolve(
      this.deliveries.some(
        (d) =>
          d.userId === input.userId &&
          d.emailType === input.emailType &&
          d.relatedEntityId === input.relatedEntityId,
      ),
    );
  }

  // No users here, so no unsubscribe filter: LifecycleEmailSender.retry() covers it.
  findRetryCandidates(input: { stalePendingBefore: Date }): Promise<LifecycleEmailDelivery[]> {
    return Promise.resolve(
      this.deliveries
        .filter(
          (d) =>
            d.status === "failed" ||
            (d.status === "pending" &&
              d.lastAttemptedAt.getTime() < input.stalePendingBefore.getTime()),
        )
        .toSorted((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        // Snapshots, like rows read from SQL: later ledger writes must not mutate them.
        .map((d) => structuredClone(d)),
    );
  }
}
