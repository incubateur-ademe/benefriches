import { DomainEvent } from "src/shared-kernel/domainEvent";

export interface DomainEventsRepository {
  save(event: DomainEvent): Promise<void>;
}
