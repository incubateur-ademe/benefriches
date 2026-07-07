import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { DomainEvent } from "src/shared-kernel/domainEvent";
import { DomainEventPublisher } from "src/shared-kernel/domainEventPublisher";

@Injectable()
export class RealEventPublisher implements DomainEventPublisher {
  private readonly eventEmitter: EventEmitter2;
  constructor(eventEmitter: EventEmitter2) {
    this.eventEmitter = eventEmitter;
  }

  async publish(event: DomainEvent): Promise<void> {
    await this.eventEmitter.emitAsync(event.name, event);
  }
}
