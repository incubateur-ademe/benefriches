---
paths:
  - "apps/api/src/**/*.controller.ts"
  - "apps/api/src/**/*.controller.integration-spec.ts"
---

# Controller Pattern

> **HTTP layer pattern** for handling requests, validating input, and mapping Result to HTTP responses.

## Overview

Controllers are primary adapters (inbound) that handle HTTP requests in the hexagonal architecture. They translate HTTP requests into UseCase commands and map UseCase results back to HTTP responses.

## Core Principles

1. **Thin Layer**: Controllers contain NO business logic - only HTTP concerns
2. **Input Validation**: Validate request shape (Zod DTOs), not business rules
3. **Result Mapping**: Map `TResult` to appropriate HTTP status codes
4. **Intent-Driven Routes**: Route paths express intent clearly, not strict REST
5. **Authentication by Default**: All routes protected by `JwtAuthGuard` unless explicitly public
6. **Return ViewModels**: Never expose domain entities directly

## Structure

Controllers are thin adapters that:
1. Validate HTTP input **shape** (DTOs + Zod) - NOT business logic
2. Call UseCases (business logic lives there)
3. Handle Result → HTTP response mapping
4. NEVER contain business logic

```typescript
import { JwtAuthGuard } from "src/auth/adapters/primary/guards/jwt-auth.guard";
import { CreateExampleUseCase } from "src/examples/core/usecases/createExample.usecase";
import type { FailureResult, SuccessResult } from "src/shared-kernel/result";
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { ZodValidationPipe } from "nestjs-zod";

@Controller("examples")
export class ExampleController {
  private readonly createExampleUseCase: CreateExampleUseCase;
  private readonly getExampleByIdUseCase: GetExampleByIdUseCase;

  constructor(
    createExampleUseCase: CreateExampleUseCase,
    getExampleByIdUseCase: GetExampleByIdUseCase,
  ) {
    this.createExampleUseCase = createExampleUseCase;
    this.getExampleByIdUseCase = getExampleByIdUseCase;
  }

  @Post()
  @UseGuards(JwtAuthGuard)  // ✅ Always protect routes unless explicitly public
  async create(@Body(new ZodValidationPipe(createExampleSchema)) dto: CreateExampleDto) {
    const result = await this.createExampleUseCase.execute(dto);

    // Handle Result → HTTP mapping
    if (result.isFailure()) {
      switch ((result as FailureResult).getError()) {
        case "ExampleAlreadyExists":
          throw new ConflictException("Example with this name already exists");
        case "ValidationFailed":
          throw new BadRequestException("Invalid example data");
      }
    }

    // Return success data (ViewModel)
    return { exampleId: (result as SuccessResult).getData().exampleId };
  }
}
```

## DTO Pattern

**CRITICAL**: All controller route DTOs (input and output) MUST be in `/packages/shared/src/api-dtos/` for frontend-backend type safety.

### Organization in Shared Package

```
packages/shared/src/api-dtos/
├── index.ts                                    # Barrel export
├── sites/
│   ├── index.ts
│   ├── createCustomSite.dto.ts                # Input DTO for custom site creation
│   ├── createExpressSite.dto.ts               # Input DTO for express site creation
│   ├── getSiteFeatures.dto.ts                 # Output DTO for site features
│   └── getSiteView.dto.ts                     # Output DTO for site view
├── site-actions/
│   ├── index.ts
│   └── updateSiteActionStatus.dto.ts          # Input DTO for status update
└── [feature]/
    ├── index.ts
    └── [operation].dto.ts                      # One file per route operation
```

### File & Export Pattern

**File Naming**:
- `[verb][Noun].dto.ts` for inputs: `createExample.dto.ts`, `updateUser.dto.ts`
- `get[Noun][Response].dto.ts` for outputs: `getSiteView.dto.ts`, `getUserProfile.dto.ts`

**Always export both schema (for validation) and type (for IDE/frontend)**:

```typescript
// packages/shared/src/api-dtos/examples/createExample.dto.ts
export const createExampleSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().optional(),
});
export type CreateExampleDto = z.infer<typeof createExampleSchema>;
```

### Usage in Controllers

Import from shared and use with `ZodValidationPipe`:

```typescript
// apps/api/src/examples/adapters/primary/examples.controller.ts
import { createExampleSchema, type CreateExampleDto } from "shared";
import { ZodValidationPipe } from "nestjs-zod";

@Controller("examples")
export class ExampleController {
  @Post()
  async create(@Body(new ZodValidationPipe(createExampleSchema)) dto: CreateExampleDto) {
    // DTO validation already happened via pipe
  }
}
```

### Why Shared DTOs

**Benefits**:
- **Frontend-Backend Type Safety**: Frontend imports the exact same types backend uses
- **Single Source of Truth**: No duplication of type definitions
- **Type-Safe HTTP Client**: Frontend builds type-safe API calls
- **Better Organization**: DTOs grouped by feature
- **Easier Maintenance**: Changes to API contracts visible to both teams

**Real Examples**:
- Input: [sites/createCustomSite.dto.ts](../../../packages/shared/src/api-dtos/sites/createCustomSite.dto.ts)
- Output: [sites/getSiteView.dto.ts](../../../packages/shared/src/api-dtos/sites/getSiteView.dto.ts)
- Controller: [sites.controller.ts:13-21](../../../apps/api/src/sites/adapters/primary/sites.controller.ts#L13-L21)

### DTO Validation Responsibility

**CRITICAL**: DTOs validate **input shape only**, NOT business logic.

```typescript
// ✅ CORRECT - Shape validation in DTO
const createUserSchema = z.object({
  email: z.string().email(),        // Shape: valid email format
  age: z.number().int().positive(), // Shape: positive integer
});

// ✅ CORRECT - Business validation in UseCase
export class CreateUserUseCase {
  async execute(request: Request): Promise<TResult<Response, Errors>> {
    // Business rule: user email must not already exist
    const existingUser = await this.userQuery.getByEmail(request.email);
    if (existingUser) {
      return fail("UserEmailAlreadyExists");
    }

    // Business rule: user must be 18+
    if (request.age < 18) {
      return fail("UserTooYoung");
    }
    // ...
  }
}

// ❌ WRONG - Business validation in DTO
const createUserSchema = z.object({
  email: z.string().email().refine(async (email) => {
    // DON'T check database in DTO!
    const exists = await checkEmailExists(email);
    return !exists;
  }),
  age: z.number().refine((age) => age >= 18, {
    // DON'T validate business rules in DTO!
    message: "User must be 18 or older",
  }),
});
```

**Rule**: DTOs validate data shape, UseCases validate business rules.

## Route Naming Convention

**IMPORTANT**: Routes should express **intent clearly**, NOT strictly follow REST patterns.

### Intent-Driven Routes (Preferred)

```typescript
// ✅ GOOD - Intent is crystal clear
@Post("start-evaluation")           // Start an evaluation
@Post("complete-evaluation")        // Complete an evaluation
@Post("add-project-creation")       // Add project creation to evaluation
```

**Real Example**: [reconversionCompatibility.controller.ts:51](../../../apps/api/src/reconversion-compatibility/adapters/primary/reconversionCompatibility.controller.ts#L51)

### Avoid Strict REST When It Obscures Intent

```typescript
// ❌ LESS CLEAR - Requires understanding REST semantics
@Post("evaluations")                // Is this starting? completing? what?
@Patch("evaluations/:id")           // What kind of update?
@Put("evaluations/:id/projects")    // What's the intent?

// ✅ BETTER - Intent-driven
@Post("start-evaluation")
@Post("complete-evaluation")
@Post("add-project-to-evaluation")
```

**Why**:
- Makes API self-documenting
- Reduces ambiguity
- Easier to understand for frontend developers
- Clearer in logs and monitoring

## Authentication & Authorization

### Always Protect Routes

**RULE**: All routes MUST use `@UseGuards(JwtAuthGuard)` unless explicitly public.

```typescript
import { JwtAuthGuard } from "src/auth/adapters/primary/guards/jwt-auth.guard";

@Controller("examples")
export class ExampleController {
  // ✅ CORRECT - Protected by default
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateExampleDto) { }

  // ⚠️ EXPLICIT - Only if intentionally public
  @Get("public-examples")
  async getPublicExamples() {
    // No JwtAuthGuard - explicitly public
  }
}
```

### Extracting User from Request

```typescript
import { RequestWithAuthenticatedUser } from "src/auth/adapters/primary/JwtAuthGuard";

@Post("my-examples")
@UseGuards(JwtAuthGuard)
async create(
  @Body() dto: CreateExampleDto,
  @Req() req: RequestWithAuthenticatedUser,
) {
  const userId = req.accessTokenPayload.userId;
  const result = await this.createExampleUseCase.execute({
    ...dto,
    userId,  // Pass to UseCase
  });
}
```

## Result → HTTP Status Mapping

**Standard mapping**:

| Result Error | HTTP Exception | Status Code |
|--------------|----------------|-------------|
| `*NotFound` | `NotFoundException` | 404 |
| `*AlreadyExists` | `ConflictException` | 409 |
| `ValidationFailed` | `BadRequestException` | 400 |
| `Unauthorized` | `UnauthorizedException` | 401 |
| `Forbidden` | `ForbiddenException` | 403 |

```typescript
if (result.isFailure()) {
  switch ((result as FailureResult).getError()) {
    case "UserNotFound":
      throw new NotFoundException("User not found");
    case "UserAlreadyExists":
      throw new ConflictException("User already exists");
    case "ValidationFailed":
      throw new BadRequestException("Invalid input");
  }
}
```

## Response Types

**CRITICAL**: Controllers MUST return **ViewModels**, never domain entities.

```typescript
// ✅ CORRECT - Return ViewModel
@Get(":id")
async getById(@Param("id") id: string): Promise<ExampleViewModel> {
  const result = await this.getExampleByIdUseCase.execute({ exampleId: id });
  return (result as SuccessResult).getData();  // ExampleViewModel
}

// ❌ WRONG - Return domain entity
@Get(":id")
async getById(@Param("id") id: string): Promise<Example> {
  // Domain entity should NOT be exposed to HTTP layer
}
```

**Why**: ViewModels control API contract. Domain models can change without breaking API.

## Summary: Controller Responsibilities

### DO:
- ✅ Use DTOs from `/packages/shared/src/api-dtos/` for all routes
- ✅ Validate input **shape** with Zod DTOs via `ZodValidationPipe`
- ✅ Protect routes with `@UseGuards(JwtAuthGuard)` by default
- ✅ Use intent-driven route names
- ✅ Map Result errors to HTTP exceptions
- ✅ Return ViewModels only
- ✅ Define both input (request body) and output (response) DTOs in shared

### DON'T:
- ❌ Validate business logic in DTOs
- ❌ Leave routes unprotected without explicit reason
- ❌ Use strict REST when it obscures intent
- ❌ Return domain entities from controllers

## Related Patterns

- **UseCases**: [api-usecase.md](api-usecase.md) (Result pattern)
- **Integration Tests**: [api-integration-testing.md](api-integration-testing.md)
- **NestJS Modules**: [api-modules-and-di.md](api-modules-and-di.md)
- **Domain Events** (rare): [api-domain-events.md](api-domain-events.md#in-controllers-rare-cases-only)
