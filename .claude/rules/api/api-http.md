---
paths:
  - "apps/api/src/**/*.controller.ts"
  - "apps/api/src/**/*.controller.integration-spec.ts"
---

# API HTTP layer: controllers

Reference controller: [sites.controller.ts](../../../apps/api/src/sites/adapters/primary/sites.controller.ts).

## Requests and responses

- A route calls one use case and maps its `TResult` to HTTP. Business rules stay in the use case; the controller only checks the request shape.
- Request and response contracts are Zod schemas and types in `packages/shared/src/api-dtos/`, imported from `"shared"` (e.g. [createCustomSite.dto.ts](../../../packages/shared/src/api-dtos/sites/createCustomSite.dto.ts)). Type a route's return with the shared response DTO (`Promise<GetSiteViewResponseDto>`), never with a domain entity or a `Sql*` row.
- `ZodValidationPipe` is registered globally as `APP_PIPE` in [app.module.ts](../../../apps/api/src/app.module.ts), and it only validates a parameter whose type is a `createZodDto` class. Declare the class in the controller file from a schema imported from `"shared"` and type `@Body()` / `@Query()` with it, like `RegisterUserBodyDto` in [auth.controller.ts](../../../apps/api/src/auth/adapters/auth.controller.ts). A parameter typed with a plain `z.infer` type is not validated unless the route passes `new ZodValidationPipe(schema)`, as the older routes of sites.controller.ts do.

## Errors

- After `if (result.isFailure())`, `switch (result.getError())` narrows to the use case's error union: no `as FailureResult` casts.
- Map failures the same way everywhere: `*NotFound` → `NotFoundException` (404), `UserNotAuthorized` → `ForbiddenException` (403), `ValidationError` → `BadRequestException` (400), `*AlreadyExists` and state conflicts → `ConflictException` (409).
- Error payloads are `{ error, message }`: an upper-snake-case code the web app can branch on, and a sentence for humans, e.g. `new ConflictException({ error: "SITE_ALREADY_EXISTS", message: "A site with this ID already exists" })`. Some older routes still throw bare strings; don't copy them. The auth-link and token routes return `{ code }`, which the web app switches on: leave them as they are.

## Auth and routes

- Decide auth route by route. A route that reads or changes a user's data uses `@UseGuards(JwtAuthGuard)` and takes the acting user from `req.accessTokenPayload.userId` (`RequestWithAuthenticatedUser` in [JwtAuthGuard.ts](../../../apps/api/src/auth/adapters/JwtAuthGuard.ts)), not from the body; the use case checks ownership and returns `UserNotAuthorized`. Public computation and reference-data routes, such as [territory.controller.ts](../../../apps/api/src/territory/adapters/primary/territory.controller.ts), have no guard.
- A module whose controller uses `@UseGuards(JwtAuthGuard)` must import [`AuthModule`](../../../apps/api/src/auth/adapters/auth.module.ts) (it exports `ACCESS_TOKEN_SERVICE_INJECTION_TOKEN`), or Nest fails at boot: see [sites.module.ts](../../../apps/api/src/sites/adapters/primary/sites.module.ts).
- A global `ThrottlerGuard` (app.module.ts) limits each IP to 5 requests per second, and is off when `NODE_ENV` is `test`. Tighten sensitive routes with `@Throttle`, as the auth-link routes of [auth.controller.ts](../../../apps/api/src/auth/adapters/auth.controller.ts) do.
- Name a route after its intent when a REST verb would hide it: `POST start-evaluation` in [reconversionCompatibility.controller.ts](../../../apps/api/src/reconversion-compatibility/adapters/primary/reconversionCompatibility.controller.ts), `POST :reconversionProjectId/duplicate`.
- A controller publishes only HTTP-layer events (login attempts and successes in auth.controller.ts), through `@Inject(DOMAIN_EVENT_PUBLISHER_INJECTION_TOKEN)` and `@Inject(UUID_GENERATOR_INJECTION_TOKEN)`, which [auth.module.ts](../../../apps/api/src/auth/adapters/auth.module.ts) provides. Domain events come from use cases.
