# [ADR-0003] Use a shared package for cross-app types and DTOs

- **Date**: 2026-02-23 (retroactive)
- **Status**: Accepted

## Context

The Benefriches monorepo contains a NestJS API and a React web app that communicate via REST endpoints. Both apps need to agree on:

- API request/response shapes (DTOs)
- Domain value objects (SoilType, SiteNature, DevelopmentPlanType)
- Validation schemas (Zod)

Without a shared source of truth, types diverge between apps, leading to runtime errors and maintenance burden.

## Decision

Create a `packages/shared` package containing:

- **API DTOs** (`src/api-dtos/`): Zod schemas and inferred TypeScript types for all API endpoints
- **Domain value objects** (`src/soils/`, `src/site/`, etc.): Shared domain vocabulary
- **Pure utility functions**: Date formatting, area calculations, etc.

The package is framework-agnostic (no React, no NestJS dependencies) and must be manually rebuilt after changes (`pnpm --filter shared build`).

## Options Considered

### Option 1: Shared package in monorepo

- **Pros**: Single source of truth for types, compile-time guarantees that API and web agree on shapes, Zod schemas provide both runtime validation and TypeScript types
- **Cons**: Manual rebuild step required, changes can break both apps simultaneously, no auto-rebuild (no Turborepo/Nx)

### Option 2: RPC (e.g., tRPC)

- **Pros**: End-to-end type safety without manual sync, auto-generated client from server definitions
- **Cons**: The project was already well advanced with a REST API when the need for shared types emerged, so migrating to RPC would have been costly. Also doesn't solve the need for shared production code (domain value objects, utility functions) beyond API contracts

### Option 3: Duplicate types in each app

- **Pros**: No cross-app dependency, each app evolves independently
- **Cons**: Types drift over time, runtime errors from mismatched shapes, double maintenance effort

## Consequences

### Positive

- API and web always agree on request/response shapes at compile time
- Zod schemas provide both TypeScript types and runtime validation
- Domain vocabulary is consistent across the entire codebase
- Changes to shared types surface errors in both apps immediately (via typecheck)

### Negative

- Manual `pnpm --filter shared build` step is easy to forget (causes confusing errors)
- Breaking changes to shared types require updating both apps in the same PR
- No watch mode integration with app dev servers (must use `pnpm --filter shared dev` separately)

## Links

- Related ADRs: [ADR-0001](0001-clean-hexagonal-architecture.md)
