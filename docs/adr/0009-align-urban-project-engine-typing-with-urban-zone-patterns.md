# [ADR-0009] Align urban project engine typing with urban zone patterns

- **Date**: 2026-03-23
- **Status**: Accepted

## Context

The urban project wizard engine was built months ago as the first multi-step form engine in the codebase. The urban zone engine was created much more recently and adopted stronger typing patterns from the start: correlated mapped types, `satisfies` on handler declarations, and focused domain reader files.

The ultimate goal is a **generic shared engine** powering all site and project creation/update wizards. Before extracting that shared foundation, both existing engines need to converge on the same conventions.

The urban project engine had four gaps relative to urban zone:

1. **Loose registry typing** — The registry lost the correlation between a step ID and its handler's generic parameter.
2. **Widened handler types** — Explicit type annotations (`: AnswerStepHandler<...>`) widened `stepId` to the full union instead of a specific literal.
3. **Broken discriminated union in shortcuts** — Shortcut completion destructured `{ stepId, answers }` before passing them separately, breaking the correlation.
4. **Monolithic `ReadStateHelper`** — 11 methods mixing generic step accessors with domain-specific reads like `willHaveBuildings` and `getProjectData`.

## Decision

Four incremental refactors, each a self-contained commit with all tests green:

1. **Correlated `AnswerStepHandlerMap`** — New `answerStepHandlers` export typed as `{ [K in AnswerStepId]: AnswerStepHandler<K> }`. The combined `stepHandlerRegistry` spreads it.
2. **`satisfies` on all 40 handlers** — Replaces explicit type annotations, preserving narrow literal types while checking structural conformance.
3. **`completeStepFromPayload`** — Accepts the discriminated union directly instead of destructured arguments.
4. **Domain reader extraction** — 8 domain methods moved from `ReadStateHelper` into 4 focused files (`buildingsReaders`, `siteResaleReaders`, `soilsReaders`, `projectDataReaders`). `ReadStateHelper` retains only 3 generic accessors.

## Options Considered

### Option 1: Incremental alignment (chosen)

Apply the 4 refactors as independent commits.

- **Pros**: Low risk, each commit revertible, directly mirrors urban zone patterns, test suite validates each step
- **Cons**: Multiple commits for a conceptually unified goal

### Option 2: Full engine unification now

Merge both engines into a single generic engine immediately.

- **Pros**: Reaches end-state in one step
- **Cons**: Massive scope (60+ steps), high regression risk, premature — the engines have different step dependency models

### Option 3: Keep engines divergent

- **Pros**: No work
- **Cons**: Growing divergence makes future unification harder, misses proven type safety benefits

## Consequences

### Positive

- Correlated types + `satisfies` catch handler mismatches at compile time
- Domain readers are smaller, testable, and match the urban zone convention
- Both engines now share the same patterns, reducing cognitive overhead and enabling future extraction of a generic engine

### Negative

- 4 new reader files + 4 test files; developers must know which reader to import
- ~16 consumer files had import changes (one-time cost)
- Two registry exports coexist (`answerStepHandlers` for type-safe lookup, `stepHandlerRegistry` for combined access)

## Links

- Related: [ADR-0004 — Colocate urban project step definitions](0004-colocate-urban-project-step-definitions.md)
- Related: [ADR-0008 — Static per-parcel-type step IDs for urban zone](0008-static-per-parcel-type-step-ids-for-urban-zone.md)
