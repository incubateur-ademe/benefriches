# Domain Events Pattern

> **Event-driven communication** for cross-module interactions and side effects.

## Overview

Domain events enable decoupled, event-driven communication between modules and trigger side effects (audit logging, analytics, notifications). Events are created using factory functions, published from UseCases (preferred) or controllers (rare), and consumed by listeners in other modules. This pattern prevents direct module dependencies while maintaining loose coupling.

## Core Principles

1. **Factory Functions**: Events created via factory functions in `*.event.ts` files
2. **UseCases Publish**: Events published from UseCases (business logic), rarely from controllers
3. **Typed Events**: Events use typed payloads with `DomainEvent<Name, Payload>` structure
4. **Past Tense Naming**: Event names use past tense (`"example.created"`, not `"example.create"`)
5. **Cross-Module Decoupling**: Modules communicate via events, not direct imports
6. **Optional Side Effects**: Events trigger side effects without blocking main flow

## When to Use Domain Events

Use domain events when you need:
- **Cross-module communication** (avoid direct module dependencies)
- **Audit logging** (track what happened in the system)
- **Analytics** (business event tracking)
- **Side effects** (send emails, notifications, external API calls)
- **Eventual consistency** (coordinating changes across modules)

## Event Structure

### Event Definition

Events are defined in `core/events/*.event.ts` files:

```typescript
// core/events/exampleCreated.event.ts
import type { DomainEvent } from "@/shared-kernel/domainEvent";

export const EXAMPLE_CREATED = "example.created" as const;

export type ExampleCreatedPayload = {
  exampleId: string;
  name: string;
  createdBy: string;
  createdAt: Date;
};

export type ExampleCreatedEvent = DomainEvent<
  typeof EXAMPLE_CREATED,
  ExampleCreatedPayload
>;

// Factory function to create the event
export function createExampleCreatedEvent(
  payload: ExampleCreatedPayload
): ExampleCreatedEvent {
  return {
    id: crypto.randomUUID(),
    name: EXAMPLE_CREATED,
    occurredAt: new Date(),
    payload,
  };
}
```

**Real Example**: [auth/core/events/userAccountCreated.event.ts](../../../apps/api/src/auth/core/events/userAccountCreated.event.ts)

### Event Naming Convention

- **Event constant**: `UPPER_SNAKE_CASE` → `EXAMPLE_CREATED`, `USER_ACCOUNT_CREATED`
- **Event type**: `PascalCase` + `Event` suffix → `ExampleCreatedEvent`, `UserAccountCreatedEvent`
- **Event name**: Domain name + past tense → `"example.created"`, `"user.accountCreated"`

## Publishing Events

### In UseCases (Preferred)

```typescript
import type { DomainEventPublisher } from "@/shared-kernel/domainEvent";
import { createExampleCreatedEvent } from "../events/exampleCreated.event";

export class CreateExampleUseCase implements UseCase<Request, TResult<Response, Errors>> {
  constructor(
    private readonly repository: ExampleRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(request: Request): Promise<TResult<Response, Errors>> {
    // Business logic
    const example = createExample(request);
    await this.repository.save(example);

    // Publish event using factory function
    await this.eventPublisher.publish(
      createExampleCreatedEvent({
        exampleId: example.id,
        name: example.name,
        createdBy: request.userId,
        createdAt: new Date(),
      })
    );

    return success({ exampleId: example.id });
  }
}
```

### In Controllers (Rare Cases Only)

**IMPORTANT**: This pattern is **rare** and should only be used in specific cases where:
- The logic is tightly coupled to HTTP layer concerns (authentication, ProConnect flow)
- The event represents an HTTP-layer event, not a domain event
- Publishing from UseCase would add unnecessary complexity

**Real-World Example**: [auth/adapters/auth.controller.ts:175](../../../apps/api/src/auth/adapters/auth.controller.ts#L175)

In the Auth module, `loginAttempted` and `loginSucceeded` events are published from the controller because they represent authentication flow events (HTTP layer concern), not domain business logic.

```typescript
import { DOMAIN_EVENT_PUBLISHER_INJECTION_TOKEN } from "@/shared-kernel/adapters/events/eventPublisher.module";
import type { DomainEventPublisher } from "@/shared-kernel/domainEventPublisher";
import { UUID_GENERATOR_INJECTION_TOKEN, type UidGenerator } from "@/shared-kernel/adapters/id-generator/UidGenerator";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authenticateUseCase: AuthenticateUseCase,
    @Inject(DOMAIN_EVENT_PUBLISHER_INJECTION_TOKEN)
    private readonly eventPublisher: DomainEventPublisher,
    @Inject(UUID_GENERATOR_INJECTION_TOKEN)
    private readonly uidGenerator: UidGenerator,
  ) {}

  @Get("pro-connect/callback")
  async proConnectCallback(@Query() query: ProConnectCallbackQuery) {
    // Authentication logic...

    // Publish login attempted event (HTTP-layer event)
    await this.eventPublisher.publish(
      createLoginAttemptedEvent(this.uidGenerator.generate(), {
        method: "pro-connect",
      })
    );

    const result = await this.authenticateUseCase.execute(/* ... */);

    if (result.isSuccess()) {
      // Publish login succeeded event
      await this.eventPublisher.publish(
        createLoginSucceededEvent(this.uidGenerator.generate(), {
          userId: user.id,
          userEmail: user.email,
          method: "pro-connect",
        })
      );
    }

    // Return response...
  }
}
```

**Why publish in controller here?**
- These events track authentication attempts at the HTTP layer
- They're not domain business events (user creation, data changes)
- The UseCase (`AuthenticateUseCase`) is focused on core authentication logic

**General Rule**: Prefer publishing from UseCases. Only publish from controllers when the event is truly an HTTP-layer concern.

## Listening to Events

### Event Listener with Dependencies (Factory Pattern)

When a listener needs injected dependencies (gateways, services, DateProvider), use the factory pattern:

```typescript
// marketing/adapters/primary/loginSucceeded.handler.ts
import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { LOGIN_SUCCEEDED, type LoginSucceededEvent } from "@/auth/core/events/loginSucceeded.event";
import { DateProvider } from "@/shared-kernel/adapters/date/IDateProvider";
import { CRMGateway } from "@/marketing/core/CRMGateway";

@Injectable()
export class LoginSucceededHandler {
  constructor(
    private readonly crm: CRMGateway,
    private readonly dateProvider: DateProvider,
  ) {}

  @OnEvent(LOGIN_SUCCEEDED)
  async handleLoginSucceeded(event: LoginSucceededEvent) {
    // Use injected DateProvider for testable timestamps
    await this.crm.updateContactLastLoginDate(
      event.payload.userEmail,
      this.dateProvider.now(),
    );
  }
}
```

**Register in module using factory pattern**:

```typescript
// marketing/adapters/primary/marketing.module.ts
@Module({
  imports: [HttpModule, ConfigModule],
  providers: [
    {
      provide: LoginSucceededHandler,
      useFactory: (crm: CRMGateway, dateProvider: DateProvider) =>
        new LoginSucceededHandler(crm, dateProvider),
      inject: [ConnectCrm, RealDateProvider],  // Inject concrete implementations
    },
    RealDateProvider,  // Register production implementation
    ConnectCrm,
  ],
})
export class MarketingModule {}
```

**Why this pattern?**
- **DateProvider**: Use `RealDateProvider` in production, `DeterministicDateProvider` in tests for predictable behavior
- **CRMGateway**: Interface injected, concrete implementation provided via `ConnectCrm`
- **Testability**: Override providers in test with fakes/deterministic implementations (see [06-integration-testing-pattern.md](06-integration-testing-pattern.md))

**Real Example**: [marketing/adapters/primary/loginSucceeded.handler.ts](../../../apps/api/src/marketing/adapters/primary/loginSucceeded.handler.ts)

## Dependency Injection

### In NestJS Modules

**UseCase with event publisher**:

```typescript
@Module({
  imports: [EventPublisherModule],  // Import event publisher module
  providers: [
    {
      provide: CreateExampleUseCase,
      useFactory: (
        repository: ExampleRepository,
        eventPublisher: DomainEventPublisher,
      ) => new CreateExampleUseCase(repository, eventPublisher),
      inject: [ExampleRepository, DomainEventPublisher],
    },
  ],
})
export class ExampleModule {}
```

**Controller with event publisher** (when needed):

```typescript
@Module({
  imports: [EventPublisherModule],
  controllers: [ExampleController],
  providers: [
    // Event publisher is injected using DOMAIN_EVENT_PUBLISHER_INJECTION_TOKEN
  ],
})
export class ExampleModule {}
```

## Common Shared Services

**For event publishing**:

| Service | Import | When to Use |
|---------|--------|-------------|
| **DomainEventPublisher** | `@/shared-kernel/domainEvent` | Type interface (injected in UseCases) |
| **DOMAIN_EVENT_PUBLISHER_INJECTION_TOKEN** | `@/shared-kernel/adapters/events/eventPublisher.module` | Injection token (for controllers) |
| **EventPublisherModule** | `@/shared-kernel/adapters/events/eventPublisher.module` | Module import |

**For event listeners needing side effects** (see [11-shared-services.md](11-shared-services.md)):

| Service | Import | When to Use |
|---------|--------|-------------|
| **DateProvider** | `@/shared-kernel/adapters/date/IDateProvider` | Type interface for testable timestamps |
| **RealDateProvider** | `@/shared-kernel/adapters/date/RealDateProvider` | Production date provider |
| **DeterministicDateProvider** | `@/shared-kernel/adapters/date/DeterministicDateProvider` | Test fixtures with fixed dates |
| **Gateway interfaces** | Domain-specific | Side effect execution (HTTP, databases) |

## Best Practices

### DO:
- ✅ Use factory functions to create events (for consistency and testability)
- ✅ Define events in `core/events/*.event.ts` files
- ✅ Publish events from UseCases (preferred)
- ✅ Use past tense for event names (`created`, not `create`)
- ✅ Include all relevant context in event payload
- ✅ Use typed event interfaces
- ✅ Inject shared services (DateProvider, gateways) into listeners for testable side effects
- ✅ Use `DeterministicDateProvider` in tests for predictable behavior

### DON'T:
- ❌ Don't create events inline (use factory functions)
- ❌ Don't include sensitive data in event payloads
- ❌ Don't use events for synchronous validation (use Result pattern)
- ❌ Don't create tight coupling via events (events should be optional side effects)

## Related Patterns

- **UseCases**: [01-usecase-pattern.md](01-usecase-pattern.md) (emitting events from business logic)
- **Dependency Injection**: [08-dependency-injection.md](08-dependency-injection.md) (wiring event publishers and listeners)
- **Shared Services**: [11-shared-services.md](11-shared-services.md) (DateProvider, ID generators for testability)
- **Integration Testing**: [06-integration-testing-pattern.md](06-integration-testing-pattern.md) (testing listeners with overridden providers)