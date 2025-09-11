import { DomainEvent } from "./domainEvent";

export interface DomainEventPublisher {
  publish(event: DomainEvent): Promise<void>;
}
