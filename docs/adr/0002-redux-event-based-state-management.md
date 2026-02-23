# [ADR-0002] Use Redux as event-based state management for the web app

- **Date**: 2026-02-23 (retroactive)
- **Status**: Accepted

## Context

The Benefriches web app features complex multi-step forms (site creation, project creation) with interdependent state, async API calls, and derived computations. We needed a state management solution that could handle:

- Complex state transitions across many form steps
- Predictable, traceable state changes (important for debugging multi-step workflows)
- Middleware for side effects (async thunks, listener middleware)
- Easy testability of state logic in isolation

## Decision

Use Redux Toolkit as the state management layer, treating actions as domain events rather than imperative commands:

- **Actions as events**: Named in passive tense (`stepCompleted`, `dataFetched`) describing what happened, not what to do
- **`createReducer`** for new reducers (not `createSlice`, which is legacy/maintenance-only)
- **Async thunks** for API calls, with gateway interfaces injected via `extraArgument`
- **Listener middleware** for cross-cutting side effects
- **Single ViewData selector** per container component, composing all needed state

## Options Considered

### Option 1: Redux Toolkit (event-based)

- **Pros**: Mature ecosystem, excellent DevTools for debugging, predictable state flow, middleware system for side effects, great TypeScript support, well-suited for complex form workflows, dependency injection via `extraArgument` enables clean architecture with gateway interfaces
- **Cons**: More boilerplate than simpler alternatives, learning curve for event-based patterns, can be verbose for simple state

### Option 2: XState

- **Pros**: First-class state machines and statecharts, explicit modeling of states and transitions, visual editor for designing flows, well-suited for complex multi-step workflows
- **Cons**: Steeper learning curve, heavier abstraction for simple state, less mainstream adoption (smaller ecosystem), integrating with React can add complexity

### Option 3: React Context + useReducer

- **Pros**: No external dependency, built into React, simple for small state
- **Cons**: Performance issues with large state trees, no middleware, no DevTools, poor ergonomics for complex async flows

## Consequences

### Positive

- State changes are fully traceable via Redux DevTools (critical for debugging multi-step forms)
- Event-based actions create a clear audit trail of user interactions
- Gateway injection via `extraArgument` enables clean testing with InMemory services
- Consistent patterns across all features reduce cognitive load

### Negative

- More code required for each feature (reducer, actions, selectors, thunks)
- Redux has a learning curve, and thinking in events can be a new paradigm for frontend developers
- Using Redux as the DI mechanism can incite developers to route everything through it (analytics, simple fetch requests) even when plain React patterns would suffice

## Links

- Related ADRs: [ADR-0001](0001-clean-hexagonal-architecture.md)
- References: [Redux Toolkit](https://redux-toolkit.js.org/), [Redux Style Guide](https://redux.js.org/style-guide/)
