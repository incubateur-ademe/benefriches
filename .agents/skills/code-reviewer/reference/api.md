# API Review Lenses

Applies to changes under `apps/api/**`. Each lens links to the canonical rule for full detail and examples — the rule also auto-loads when you Read the changed file. This file is the review checklist (what to flag); the rule is the spec (how to write it).

## Contents
- Clean Architecture (CRITICAL)
- UseCase / Result pattern (CRITICAL)
- Controller (CRITICAL)
- CQS — Repository vs Query (HIGH)
- Database (CRITICAL)
- Dependency Injection (HIGH)
- Naming (HIGH)
- Testing mechanics (CRITICAL)

## Clean Architecture (CRITICAL)
*Why:* the dependency rule is what keeps domain logic testable and swappable — a `core → adapters` import welds business rules to infrastructure and is the hardest violation to unwind later.
Full: [`apps/api/AGENTS.md`](../../../../apps/api/AGENTS.md) (layers), [`rules/api/api-core.md`](../../../../.claude/rules/api/api-core.md)
- ❌ `core/` importing from `adapters/`
- ❌ UseCases depending on concrete implementations (e.g. `SqlRepository`) instead of interfaces
- ❌ Domain models importing infrastructure code
- ❌ Controllers containing business logic (should be HTTP → UseCase → HTTP only)
- ❌ Business logic in repositories/queries (belongs in UseCases)
- ❌ Direct database access in controllers
- ✅ Core imports only from `core/`, `shared-kernel/`, or `"shared"`

## UseCase / Result pattern (CRITICAL)
*Why:* explicit `Result` types turn every failure into a typed, handled outcome instead of a thrown surprise a caller can silently forget.
Full: [`rules/api/api-core.md`](../../../../.claude/rules/api/api-core.md)
- ❌ Not implementing `UseCase<Request, TResult<Response, Error>>` / not returning `TResult<Data, Error>`
- ❌ `throw` for domain errors instead of `fail("ErrorType")`
- ❌ Action-based error types (`"CreateFailed"`) instead of state-based (`"AlreadyExists"`, `"NotFound"`)
- ❌ Depending on concrete classes instead of `core/gateways/` interfaces

## Controller (CRITICAL)
*Why:* the controller is the HTTP boundary — leaking DTOs, validation, or domain entities through it spreads coupling and auth gaps across the app.
Full: [`rules/api/api-http.md`](../../../../.claude/rules/api/api-http.md)
- ❌ Body/query parameter typed with a plain type instead of a `createZodDto` class (the global `ZodValidationPipe` skips it) and no explicit `new ZodValidationPipe(schema)`; business-logic validation in DTOs
- ❌ Routes missing `@UseGuards(JwtAuthGuard)` without clear justification
- ❌ Not handling Result errors (missing `if (result.isFailure())`)
- ❌ Inconsistent HTTP status mapping (`*NotFound` should throw `NotFoundException`)
- ❌ Returning domain entities or `Sql*` rows instead of the shared response DTO

## CQS — Repository vs Query (HIGH)
Full: [`rules/api/api-persistence.md`](../../../../.claude/rules/api/api-persistence.md)
- ❌ Repository interfaces mixing reads and writes; Query interfaces with write methods
- ❌ Write UseCases using Query interfaces for data modification

## Database (CRITICAL)
*Why:* schema changes without migrations break environments silently, and table-type mismatches surface as runtime errors far from their cause.
Full: [`rules/api/api-db-migrations.md`](../../../../.claude/rules/api/api-db-migrations.md), [`api-persistence.md`](../../../../.claude/rules/api/api-persistence.md)
- ❌ Schema change without migration; missing `down()`
- ❌ Missing indexes on foreign keys / frequently queried columns
- ❌ `any` for SQL operations
- ❌ `camelCase` DB columns (use `snake_case`); optional `?:` instead of `| null`; `string` for timestamp columns (use `Date`)
- ❌ Multi-table operations without `sqlConnection.transaction()`

## Dependency Injection (HIGH)
Full: [`rules/api/api-core.md`](../../../../.claude/rules/api/api-core.md)
- ❌ Not using factory pattern (`useFactory`); missing `inject` array
- ❌ Injection tokens for UseCases (inject `RealEventPublisher` directly)
- ❌ New feature module not added to the `imports` of `app.module.ts`

## Naming (HIGH)
Full: [`apps/api/AGENTS.md`](../../../../apps/api/AGENTS.md)
- ❌ Test file not matching source name with `.spec.ts` / `.integration-spec.ts`
- ❌ Relative `../../../` for cross-module (use `src/`); anything but `"shared"` for the shared package

## Testing mechanics (CRITICAL)
*Why:* without InMemory implementations and deterministic services, unit tests become slow, flaky, or simply absent — the exact failure modes the test rules exist to prevent.
Full: [`rules/api/api-testing.md`](../../../../.claude/rules/api/api-testing.md), [`rules/testing.md`](../../../../.claude/rules/testing.md). For design smells (behaviour vs implementation) see [`reference/cross-cutting.md`](cross-cutting.md).
- ❌ New Repository/Query interface without an InMemory implementation (with `_`-prefixed test helpers)
- ❌ Unit tests accessing the real database (use InMemory)
- ❌ UseCase instantiation in `beforeEach()` (instantiate in each `it()`)
- ❌ `toMatchObject()`/`partialDeepStrictEqual` for shape checks where an exhaustive `deepStrictEqual`/`assertShapeEquals` applies
- ❌ Missing failure-path tests; not verifying side effects (saved / not saved on failure)
- ❌ Real services (random IDs, current dates) instead of deterministic ones
- ❌ Success paths not asserting published events; error paths not asserting NO events published
- ❌ SQL Repository/Query or Controller without a `*.integration-spec.ts`
