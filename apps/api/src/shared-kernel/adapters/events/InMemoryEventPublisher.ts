import { DomainEvent } from "src/shared-kernel/domainEvent";
import { DomainEventPublisher } from "src/shared-kernel/domainEventPublisher";

export class InMemoryEventPublisher implements DomainEventPublisher {
  readonly events: DomainEvent[] = [];

  async publish(event: DomainEvent): Promise<void> {
    this.events.push(event);
    return Promise.resolve();
  }
}
