# [ADR-0005] Use gateway pattern for third-party browser SDKs

- **Date**: 2026-02-26
- **Status**: Accepted

## Context

Third-party browser SDKs (Matomo analytics, Crisp chat) were integrated directly in React views — components called `window._paq` or imported SDK functions directly. This created tight coupling between views and infrastructure, made unit testing impossible without mocking globals, and provided no fallback when services were disabled.

## Decision

Third-party browser SDKs must follow the gateway pattern established in Clean Architecture:

1. **Gateway interface** in `core/gateways/` — defines what the domain needs
2. **Real implementation** in `infrastructure/` — wraps the SDK calls
3. **InMemory mock** in `infrastructure/` — records calls for test assertions
4. **Noop fallback** in `infrastructure/` — used when the service is disabled
5. **Registered in `AppDependencies`** — injected via Redux store's `extraArgument`
6. **Views dispatch thunks** that call `extra.service` — no direct SDK imports in views

SDK initialization (script injection) happens eagerly in `appDependencies.ts` via `service.init()`, not via React components.

## Options Considered

### Option 1: Gateway pattern with thunks (chosen)

- **Pros**: Fully testable with InMemory mocks, clean separation of concerns, consistent with existing Crisp pattern, Noop fallback for disabled services, SDK init decoupled from React lifecycle
- **Cons**: More files per integration (gateway + 3 implementations + thunks), dispatch ceremony for fire-and-forget calls

### Option 2: Keep direct SDK calls in views with global mocks in tests

- **Pros**: Fewer files, simpler call sites (`trackEvent(...)` directly)
- **Cons**: Views depend on infrastructure, global mocking is fragile, no Noop fallback, violates Clean Architecture, no test assertions on what was tracked

## Consequences

### Positive

- Analytics calls are fully unit-testable via InMemory service
- Views have zero dependency on Matomo or any analytics SDK
- Swapping analytics providers requires only a new implementation class
- Disabled analytics silently no-ops (or logs in dev) instead of failing

### Negative

- Each new third-party integration requires 4+ files (gateway, real, mock, noop)
- Analytics events require `dispatch(eventTracked(...))` instead of a direct function call

## Links

- Related ADRs: [ADR-0001](0001-clean-hexagonal-architecture.md)
- Reference implementations: `features/analytics/` (Matomo), `features/support/` (Crisp)
