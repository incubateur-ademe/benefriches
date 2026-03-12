# Shared Wizard Engine

## What This Is

A shared step-by-step wizard engine extracted from the three existing wizard implementations in the Benefriches web app (urban project, renewable energy project, urban zone site creation). It provides a unified, type-safe framework for building multi-step forms with support for creation and update flows, step dependencies, shortcuts, and recomputation.

## Core Value

One wizard engine that all step-by-step flows use, so new wizards (economic activity zone) and new capabilities (update flows for renewable energy and sites) are built on a proven, well-tested foundation instead of yet another copy.

## Requirements

### Validated

<!-- Existing capabilities in the codebase -->

- ✓ Step handler registry pattern mapping step IDs to handler objects — existing (urban project, RE, urban zone site)
- ✓ AnswerStepHandler for data-entry steps with `getNextStepId()`, `getDefaultAnswers()`, `updateAnswersMiddleware()` — existing
- ✓ InfoStepHandler for navigation-only steps — existing
- ✓ Generic `stepCompletionRequested({ stepId, answers })` action replacing per-step actions — existing
- ✓ Colocated step files (handler, schema, selectors, stepperConfig) — existing
- ✓ Dependency rules (`getDependencyRules()`) for cascading delete/invalidate/recompute — existing (urban project)
- ✓ Shortcuts (`getShortcut()`) auto-completing multiple steps — existing (urban project)
- ✓ Recomputation (`getRecomputedStepAnswers()`) preserving user edits — existing (urban project)
- ✓ Confirmation dialogs for cascading changes — existing (urban project)
- ✓ Factory actions supporting both create and update modes — existing (urban project)
- ✓ Stepper config with labels and groups for UI progress display — existing

### Active

<!-- New scope for this project -->

- [ ] Shared wizard engine with strict typed step IDs (union types, not loose strings)
- [ ] Engine supports all urban project capabilities (dependencies, shortcuts, recomputation, create+update)
- [ ] Urban project wizard migrated to shared engine
- [ ] Urban zone site creation wizard migrated to shared engine
- [ ] All existing step handler tests pass after migration
- [ ] New wizards can be created by defining step handlers and plugging into the engine

### Out of Scope

- Renewable energy wizard migration — deferred to future work
- Economic activity zone wizard — will use the engine but is a separate project
- Update flows for renewable energy projects and sites — will use the engine but is separate work
- UI/view layer changes — engine is core logic only, views remain feature-specific

## Context

- Three existing implementations with increasing sophistication: RE (simplest), urban zone site (better types), urban project (full features with create+update)
- Urban project step handlers live in `src/shared/core/reducers/project-form/urban-project/step-handlers/`
- Urban zone site handlers live in `src/features/create-site/core/urban-zone/step-handlers/`
- RE handlers live in `src/features/create-project/core/renewable-energy/step-handlers/`
- The web app uses Redux with `createReducer` pattern and Clean Architecture
- Step handlers are core logic (no framework dependencies)

## Constraints

- **Location**: Engine goes in `src/shared/core/wizard/` in the web app
- **Type safety**: Step IDs must be typed unions (carry forward urban zone site's approach)
- **Testing**: All existing step handler tests must pass throughout migration
- **Architecture**: Must follow Clean Architecture — engine is core logic with no infrastructure dependencies
- **Node.js compatibility**: Code must be erasable (no enums, no namespaces)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Extract from urban project as primary reference | Has the most complete feature set (deps, shortcuts, recompute, create+update) | — Pending |
| Use strict typed step IDs from urban zone site | Better type safety catches step ID typos at compile time | — Pending |
| Place in `src/shared/core/wizard/` | Core logic shared across features, not views or infrastructure | — Pending |
| Migrate urban project + urban zone site first | Proves the engine with both simple and complex wizards, RE deferred | — Pending |

---
*Last updated: 2026-03-12 after initialization*
