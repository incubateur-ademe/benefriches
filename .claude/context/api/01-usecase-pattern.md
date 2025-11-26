# UseCase Pattern

> **Core business logic pattern** with Result type for type-safe error handling.

## Overview

UseCases encapsulate business actions and orchestrate domain logic. They represent the application layer in Clean Architecture, coordinating between domain models, repositories, queries, and external services.

## Core Principles

1. **Single Responsibility**: Each UseCase handles one business action
2. **Result Pattern**: All UseCases return `TResult<Data, Error>` for type-safe error handling
3. **Command-Query Separation**: Use Repository for writes, Query for reads
4. **Dependency Inversion**: UseCases depend on gateway interfaces (ports), not implementations
5. **Domain Event Emission**: UseCases emit events for audit and cross-module communication (when relevant)
6. **No Infrastructure**: UseCases never import from `adapters/` - only from `core/`

## Structure

All UseCases follow this structure:

```typescript
import { UseCase } from "src/shared-kernel/usecase";
import { success, fail, type TResult } from "src/shared-kernel/result";

type Request = {
  // Input parameters
};

type Response = {
  // Success data
};

type Errors = "ErrorType1" | "ErrorType2";

export class MyUseCase implements UseCase<Request, TResult<Response, Errors>> {
  constructor(
    private readonly gateway1: Gateway1,
    private readonly gateway2: Gateway2,
  ) {}

  async execute(request: Request): Promise<TResult<Response, Errors>> {
    // Business logic here

    if (errorCondition) {
      return fail("ErrorType1");
    }

    return success({ data: "value" });
  }
}
```

## Result Pattern (Critical)

**All UseCases MUST return `TResult<Data, Error>`** - Compiler enforces this via `UseCase<TRequest, TResult<...>>` interface.

### Core Concept

Every UseCase returns either:
- **Success**: `success(data)` - Operation completed successfully
- **Failure**: `fail("ErrorType")` - Domain error occurred

### Available Imports

```typescript
import {
  fail,          // Create failure: fail("ErrorType")
  success,       // Create success: success(data)
  type TResult,  // Result<SuccessType, ErrorType>
  type SuccessResult,  // Success variant only
  type FailureResult,  // Failure variant only
} from "src/shared-kernel/result";
```

### Quick Examples

```typescript
// Simple success
return success({ userId: "123" });

// Simple failure
return fail("UserNotFound");

// Validation failure with structured issues (optional 3rd generic)
type CreateExampleResult = TResult<
  { exampleId: string },
  "ValidationFailed",
  { fieldErrors: Record<string, string[]> }
>;

return fail("ValidationFailed", { fieldErrors: { email: ["Invalid format"] } });
```

## Request Type Validation Strategy

**Choose based on validation complexity:**

### Simple Types (Internal Data)

```typescript
type Request = {
  name: string;
  age: number;
};
```

Use when: Data comes from trusted internal sources.

### Complex Validation (External Input)

```typescript
import { z } from "zod";

const createExampleRequestSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
});

type Request = z.infer<typeof createExampleRequestSchema>;
```

Use when: Data comes from external sources (HTTP, files).

### Validation Responsibility Split

- **Controller**: Validates HTTP input shape (use `ZodValidationPipe`)
- **UseCase**: Validates business rules (use Result pattern failures)
- **Rule**: Don't duplicate validation in both layers

## Domain Events (Optional)

UseCases can emit domain events when business-significant actions occur. This is **optional** and should be used when:
- Cross-module communication is needed (avoid direct dependencies)
- Audit logging, analytics are required
- Side effects need to be triggered (emails, notifications)

**See**: [10-domain-events-pattern.md](10-domain-events-pattern.md) for complete pattern.

## Real-World Examples

| UseCase | Location | Pattern Demonstrated |
|---------|----------|---------------------|
| CreateUserUseCase | [auth/core/createUser.usecase.ts](../../../apps/api/src/auth/core/createUser.usecase.ts) | Simple Result pattern |
| AuthenticateWithTokenUseCase | [auth/core/authenticateWithToken.usecase.ts](../../../apps/api/src/auth/core/authenticateWithToken.usecase.ts) | Authorization errors |
| CreateNewExpressSiteUseCase | [sites/core/usecases/createNewExpressSite.usecase.ts](../../../apps/api/src/sites/core/usecases/createNewExpressSite.usecase.ts) | Multiple gateways |
| GetSiteByIdUseCase | [sites/core/usecases/getSiteById.usecase.ts](../../../apps/api/src/sites/core/usecases/getSiteById.usecase.ts) | Query pattern |
| CreateReconversionProjectUseCase | [reconversion-projects/core/usecases/createReconversionProject.usecase.ts](../../../apps/api/src/reconversion-projects/core/usecases/createReconversionProject.usecase.ts) | Complex business logic |

## Gateway Dependencies

UseCases depend on **gateway interfaces** (ports), not concrete implementations:

```typescript
// ✅ CORRECT - Depend on interface
export class MyUseCase implements UseCase<Request, TResult<Response, Errors>> {
  constructor(
    private readonly repository: MyRepository,  // Interface type
    private readonly query: MyQuery,             // Interface type
  ) {}
}

// ❌ WRONG - Depend on concrete class
export class MyUseCase implements UseCase<Request, TResult<Response, Errors>> {
  constructor(
    private readonly repository: SqlMyRepository,  // Concrete class
  ) {}
}
```

**Why**: Allows InMemory implementations for unit testing without database.

## Related Patterns

- **Testing**: [05-unit-testing-pattern.md](05-unit-testing-pattern.md)
- **Controllers**: [02-controller-pattern.md](02-controller-pattern.md) (handling Result in HTTP layer)
- **Gateways**: [03-repository-pattern.md](03-repository-pattern.md), [04-query-pattern.md](04-query-pattern.md)
- **Domain Events**: [10-domain-events-pattern.md](10-domain-events-pattern.md) (emitting events from UseCases)