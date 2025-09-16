import { DomainEvent } from "./domainEvent";

export const DOMAIN_EVENT_PUBLISHER_INJECTION_TOKEN = "DomainEventPublisher";

export interface DomainEventPublisher {
  publish(event: DomainEvent): Promise<void>;
}
