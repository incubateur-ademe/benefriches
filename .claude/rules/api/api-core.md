---
paths:
  - "apps/api/src/**/*.usecase.ts"
  - "apps/api/src/**/*.usecase.spec.ts"
  - "apps/api/src/**/core/events/*.event.ts"
  - "apps/api/src/**/*.module.ts"
  - "apps/api/src/**/*.handler.ts"
  - "apps/api/src/**/adapters/primary/*Handler.ts"
  - "apps/api/src/shared-kernel/adapters/events/**/*.ts"
---

# API core: use cases, domain events, modules

## Use cases

- A use case is a plain class (no Nest decorator) implementing [`UseCase<Request, TResult<…>>`](../../../apps/api/src/shared-kernel/usecase.ts) with a single `execute()`. Models: [getSiteById.usecase.ts](../../../apps/api/src/sites/core/usecases/getSiteById.usecase.ts) (read), [updateCustomSite.usecase.ts](../../../apps/api/src/sites/core/usecases/updateCustomSite.usecase.ts) (write with several failures). [startReconversionCompatibilityEvaluation.usecase.ts](../../../apps/api/src/reconversion-compatibility/core/usecases/startReconversionCompatibilityEvaluation.usecase.ts) is a legacy exception with `@Injectable()`.
- Return expected failures instead of throwing them: `fail("SiteNotFound")` / `success(data)` from [result.ts](../../../apps/api/src/shared-kernel/result.ts). Throw only for bugs and broken invariants.
- Name a failure after the state it reports (`SiteNotFound`, `UserNotAuthorized`, `SiteNotEditable`), not after the action that failed ("find site failed"). The error union is the contract the controller maps to HTTP statuses.
- Details the caller needs go in the optional third generic, `TResult<Data, Errors, Issues>`, passed as the second argument of `fail()`: `{ fieldErrors }` in [createReconversionProject.usecase.ts](../../../apps/api/src/reconversion-projects/core/usecases/createReconversionProject.usecase.ts), `SiteNotEditableIssues` in updateCustomSite.usecase.ts.
- Business rules are validated here, e.g. a Zod `safeParseAsync` of the domain props that returns `fail("ValidationError", fieldErrors)` (createReconversionProject.usecase.ts).
- Type constructor parameters with gateway interfaces (`SitesRepository`, `SitesQuery`), never with `Sql*` classes, so unit tests can pass `InMemory*` implementations.
- Take the time and the ids a test must predict from the injected `DateProvider` and `UidGenerator`, not from `new Date()` or `uuid()`.

## Domain events

- One file per event in `core/events/`: a name constant, a `DomainEvent<typeof NAME, Payload>` type and a `create…Event(id, payload)` factory, as in [siteCreated.event.ts](../../../apps/api/src/sites/core/events/siteCreated.event.ts). Event names are past tense (`site.created`, `user.account-created`).
- The event id comes from the use case's injected `UidGenerator`, never from the factory, so tests can predict it: `createSiteCreatedEvent(this.uuidGenerator.generate(), …)` in [createNewExpressSite.usecase.ts](../../../apps/api/src/sites/core/usecases/createNewExpressSite.usecase.ts).
- Publish domain events from use cases.
- Every event is also saved to the `domain_events` table by `DomainEventsHandler` (`@OnEvent("**")` in [app.module.ts](../../../apps/api/src/app.module.ts)): keep secrets and tokens out of payloads.
- [`RealEventPublisher`](../../../apps/api/src/shared-kernel/adapters/events/publisher/RealEventPublisher.ts) awaits every listener (`emitAsync`), so a slow handler slows the request. `@OnEvent` swallows and logs listener errors (`suppressErrors ?? true`): `publish()` never rejects, so a failed side effect never fails the use case. Catch in the handler only to log with context, as [loginSucceeded.handler.ts](../../../apps/api/src/marketing/adapters/primary/loginSucceeded.handler.ts) does.
- A module reacts to another module's event with a handler in its own `adapters/primary/`, e.g. `@OnEvent(SITE_CREATED)` in [SiteCreatedHandler.ts](../../../apps/api/src/site-actions/adapters/primary/SiteCreatedHandler.ts).

## Modules and dependency injection

- Register each use case with `useFactory` + `inject:`: the factory's parameters are typed with interfaces, `inject:` lists the concrete providers. Classes Nest can build on its own (`SqlSiteRepository`, `RealDateProvider`, `RandomUuidGenerator`, `RealEventPublisher`) are listed as plain providers of the same module. Model: [sites.module.ts](../../../apps/api/src/sites/adapters/primary/sites.module.ts).
- A use case that publishes events gets `RealEventPublisher` and `RandomUuidGenerator` in its `inject:` (parameters typed `DomainEventPublisher` and `UidGenerator`). There is no event-publisher module to import: `EventEmitterModule` is registered globally in app.module.ts.
- `SqlConnectionModule` is `@Global()`: feature modules don't import it.
- Add a new feature module to the `imports` of app.module.ts. Export only what another module injects (`exports:` in [marketing.module.ts](../../../apps/api/src/marketing/adapters/primary/marketing.module.ts)).
