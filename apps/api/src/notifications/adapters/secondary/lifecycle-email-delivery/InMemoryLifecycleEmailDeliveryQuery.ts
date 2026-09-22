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
}
