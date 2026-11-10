# [ADR-0019] Record client-side user actions as server domain events

- **Date**: 2026-11-10
- **Status**: Accepted

## Context

The team wants to know which users download a project's impacts as a PDF, to contact them. The download happens entirely in the browser (`@react-pdf/renderer` builds the file, a plain anchor saves it), so the API never sees it. Matomo already counts the clicks, but anonymously: attaching a user id to Matomo events would require a cookie consent banner, which the team wants to avoid.

The API already stores every domain event in `domain_events` (`DomainEventsHandler`, `@OnEvent("**")`), and the admin reads login events from that table to build a user's activity timeline.

## Decision

The web app reports an action that only happens in the browser to **one explicit API route per action**, e.g. `POST /reconversion-projects/:id/report-impacts-exported`. The route is authenticated and takes the user from the session, never from the body. A use case checks what it must (here, that the project exists) and publishes a domain event (`reconversion-project.impacts-exported`); the existing handler stores it in `domain_events`, like every other event.

`domain_events` therefore also serves as the user activity log read by the admin. The web call is fire-and-forget: the user action never waits for it and a failure is swallowed.

## Options Considered

### Option 1: Explicit route + use case + domain event stored in `domain_events` (chosen)

- **Pros**: no migration, no new table; same path as server-side events (use case, event, handler); the admin reads it the way it already reads logins; one route per action keeps validation (Zod schema in `shared`) and authorization precise.
- **Cons**: `domain_events` mixes domain facts with activity tracking; payloads are untyped `jsonb`, so reads depend on payload keys; best-effort data (ad blockers, network failures, closed tabs lose events).

### Option 2: Dedicated table (e.g. `impacts_exports`)

- **Pros**: typed columns, foreign keys to users and projects, simple aggregations.
- **Cons**: migration and repository for data that is only read by the admin; a second place to record user activity next to `domain_events`. Worth revisiting if this data ever drives product behaviour rather than admin reading.

### Option 3: Generic "write any event" endpoint

- **Pros**: one route for every future client-side action.
- **Cons**: lets the browser write arbitrary event names and payloads into the event log; no per-action validation or business check; events would no longer come from use cases.

### Option 4: Identified Matomo events

- **Pros**: no API change.
- **Cons**: storing a user id in Matomo requires a cookie consent banner; the data would live outside our database, out of reach of the admin.

## Consequences

### Positive

- Each new browser-only action to record costs a shared DTO, a use case, an event and a route, with no schema change.
- Admin views read user activity from a single table.

### Negative

- The data is best effort and must not be used for accounting or product logic.
- Identified activity is personal data: the privacy policy must cover it.

## Links

- Related ADRs: [ADR-0001](0001-clean-hexagonal-architecture.md), [ADR-0005](0005-gateway-pattern-for-third-party-browser-sdks.md), [ADR-0018](0018-validate-api-requests-with-nest-standard-schema-support.md)
