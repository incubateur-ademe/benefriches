# [ADR-0018] Validate API requests with Nest's built-in Standard Schema support

- **Date**: 2026-10-07
- **Status**: Accepted

## Context

The API validated requests with `nestjs-zod`: a global `ZodValidationPipe` (`APP_PIPE`) that only validated parameters typed with a `createZodDto` class, plus `new ZodValidationPipe(schema)` passed per parameter on older routes. Two problems came up with the NestJS 12 upgrade.

- **A third-party library behind every request.** `nestjs-zod` 5.5 declares `@nestjs/common` 10–11 and `@nestjs/swagger` 7–11 as peers. After the upgrade, all request validation ran on an unsupported combination, and each Nest major means waiting for the library to catch up.
- **Two ways to validate, one of them silent.** Whether a parameter was validated depended on its TypeScript type: a `createZodDto` class was, a plain `z.infer` type was not unless the route also passed a pipe. Each validated route also needed an empty `class XDto extends createZodDto(schema) {}`.

NestJS 12 validates [Standard Schema](https://github.com/standard-schema/standard-schema) objects natively, and Zod 4 implements Standard Schema. A route parameter can declare its schema (`@Body({ schema })`, `@Query({ schema })`, `@Param("id", { schema })`), and `StandardSchemaValidationPipe` from `@nestjs/common` validates it. `@nestjs/swagger` 12 builds the OpenAPI description from the same schema.

## Decision

- **Declare the schema on the decorator.** Each validated parameter passes its schema, imported from `shared` for new routes, and is typed with the schema's `z.infer` type: `@Body({ schema: createCustomSiteDtoSchema }) body: CreateCustomSiteDto`. `createZodDto` classes and per-parameter pipes are removed.
- **One global pipe.** `APP_PIPE` is a `StandardSchemaValidationPipe` built by `createRequestValidationPipe()` (`src/shared-kernel/adapters/http/requestValidationPipe.ts`). It validates every parameter that declares a schema and hands the handler the parsed value, so coercions and defaults apply. A parameter without a schema is not validated.
- **The 400 body is unchanged.** The pipe's `exceptionFactory` returns `{ statusCode: 400, message: "Validation failed", errors }`, the body `nestjs-zod` returned. `errors` are the Zod issues, each with its `path`, which Zod returns unchanged through Standard Schema. Nest's default body, a list of message strings, would have broken this contract.
- **Swagger reads the schema.** A schema overrides a hand-written `@ApiBody`/`@ApiQuery` for the same parameter. Swagger-only details go in the schema with `.meta({ example })`, which does not change validation.

## Options Considered

### Nest's built-in Standard Schema validation (chosen)

- **Pros**: no third-party dependency to wait for on each Nest major. One way to validate, visible at the parameter. No empty DTO classes. Any Standard Schema library would work.
- **Cons**: forgetting `schema` still leaves a parameter unvalidated, as a plain type did before (covered by the rules and review checklist, not by a lint rule). Swagger documentation now depends on Zod's JSON Schema output.

### Keep `nestjs-zod` and wait for a release supporting Nest 12

- **Pros**: no code change.
- **Cons**: validation keeps running on an unsupported combination until then, and the problem returns with every Nest major. The two validation styles and the empty DTO classes stay.

## Consequences

- `nestjs-zod` is removed from `apps/api`.
- The rules (`.claude/rules/api/api-http.md`), the security notes, the code-review reference and the `api-conventions/no-local-dto-schema` lint message describe `@Body({ schema })`.
- The public Swagger document is unchanged, except that `since` on `GET /api/stats` is now documented as a positive integer, as the schema requires.
