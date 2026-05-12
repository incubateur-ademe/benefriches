---
paths:
  - "apps/api/**/*.ts"
---

# API Architecture Overview

> **Quick reference** for understanding the Benefriches API architecture.

## Architecture Pattern

**Clean/Hexagonal Architecture + CQS (Command-Query Separation)**

### Dependency Rule

**CRITICAL**: `core/` NEVER imports from `adapters/`

```
module/
├── core/                        # Domain layer (Pure TypeScript)
│   ├── models/                  # Domain entities, ViewModels
│   ├── gateways/                # Port interfaces (Repository, Query)
│   ├── usecases/                # Business logic
│   └── events/                  # Domain events
└── adapters/                    # Infrastructure layer
    ├── primary/                 # Inbound (Controllers, Modules)
    └── secondary/               # Outbound (SQL, InMemory implementations)
```

## Core Principles

1. **CQS Separation**:
   - Write operations → `Repository` interfaces
   - Read operations → `Query` interfaces
   - NEVER mix reads and writes in same interface

2. **Result Pattern**:
   - All UseCases return `TResult<Data, Error>`
   - Type-safe error handling at compile-time
   - See [api-usecase.md](api-usecase.md)

3. **Dependency Injection**:
   - Gateway interfaces defined in core
   - Concrete implementations in adapters
   - NestJS modules wire dependencies with factory pattern
   - See [api-modules-and-di.md](api-modules-and-di.md)

4. **Testing Strategy**:
   - Unit tests with InMemory implementations (no database)
   - Integration tests with real database (SQL repositories/queries)
   - Controller integration tests (full HTTP → UseCase → DB flow)

## Key Patterns

| Pattern | File Reference |
|---------|---------------|
| UseCase + Result Pattern | [api-usecase.md](api-usecase.md) |
| Controllers + DTOs | [api-controller.md](api-controller.md) |
| SQL Repositories (Write) | [api-repository.md](api-repository.md) |
| SQL Queries (Read) | [api-query.md](api-query.md) |
| Unit Testing | [api-unit-testing.md](api-unit-testing.md) |
| Integration Testing | [api-integration-testing.md](api-integration-testing.md) |
| Database (Migrations, Types) | [api-migrations.md](api-migrations.md) |
| NestJS Modules + DI | [api-modules-and-di.md](api-modules-and-di.md) |
| Naming Conventions | [api-naming.md](api-naming.md) |
| Domain Events | [api-domain-events.md](api-domain-events.md) |

## Related Documentation

- [Root CLAUDE.md](../../../CLAUDE.md) - Monorepo setup, pnpm commands
- [API CLAUDE.md](../../../apps/api/CLAUDE.md) - API quick reference
