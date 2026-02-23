# [ADR-0001] Use Clean/Hexagonal Architecture across the monorepo

- **Date**: 2026-02-23 (retroactive)
- **Status**: Accepted

## Context

Benefriches is a public-interest application for evaluating the socio-economic and environmental benefits of brownfield reconversion projects. The codebase is a monorepo with a NestJS API and a React SPA. Both apps need to be maintainable long-term, testable in isolation, and adaptable to infrastructure changes (e.g., switching databases, API providers).

We needed an architecture that enforces separation of concerns and makes the domain logic independent of frameworks and infrastructure.

## Decision

Adopt Clean/Hexagonal Architecture for both the API and the web app:

- **Core layer** (`core/`): Domain logic, use cases, gateway interfaces (ports). No dependencies on infrastructure or frameworks.
- **Adapters layer** (`adapters/`): Infrastructure implementations (SQL repositories, HTTP services, controllers). Depends on core, never the reverse.
- **Dependency rule**: Dependencies always point inward (adapters -> core).

On the API side, this is combined with Command-Query Separation (CQS): write operations go through Repositories, read operations through dedicated Query services.

On the web side, Redux serves as the core state management with gateway interfaces for external services, injected via the store's `extraArgument`.

## Options Considered

### Option 1: Clean/Hexagonal Architecture

- **Pros**: Framework-agnostic core, highly testable with InMemory implementations, clear boundaries, enforced dependency rule
- **Cons**: More boilerplate (interfaces, ports, adapters), steeper learning curve for new contributors

### Option 2: Layered Architecture (traditional MVC)

- **Pros**: Simpler structure, familiar to most developers, less boilerplate
- **Cons**: Business logic tends to leak into controllers/services, harder to test in isolation, tighter coupling to frameworks

### Option 3: No enforced architecture

- **Pros**: Maximum flexibility, fast initial development
- **Cons**: Inconsistent patterns, harder to maintain as the team and codebase grow

## Consequences

### Positive

- Core logic is fully testable with fast InMemory implementations (no database or HTTP needed)
- Switching infrastructure (e.g., database, external APIs) only requires new adapter implementations
- Clear code organization makes it easier for contributors (and AI assistants) to navigate the codebase
- Consistent patterns across API and web reduce cognitive load

### Negative

- More files and indirection for each feature (interface + implementation + InMemory mock)
- New contributors need to understand the architecture before contributing effectively
- Simple CRUD operations require the same ceremony as complex business logic

## Links

- References: [Clean Architecture (Robert C. Martin)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html), [Hexagonal Architecture (Alistair Cockburn)](https://alistair.cockburn.us/hexagonal-architecture/)
