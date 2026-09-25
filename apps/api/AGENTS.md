# Benefriches API

NestJS REST API on PostgreSQL (Knex), organised in Clean/Hexagonal Architecture. Each feature lives in `src/<feature>/`:

- `core/`: the domain, in plain TypeScript: `models/`, gateway interfaces in `gateways/`, `usecases/`, `events/`. The `architecture-boundaries` lint rule rejects imports from `adapters/`.
- `adapters/primary/`: what drives the domain: controllers, the NestJS module, event handlers.
- `adapters/secondary/`: what the domain drives: database, HTTP clients, mailers.

`auth` predates this layout: its use cases sit directly in `auth/core/` and its adapters in `auth/adapters/`. Cross-feature building blocks (date, id, event and logger ports with their implementations, the Knex connection, migrations) are in `src/shared-kernel/`.

The details live in path-scoped rules in `.claude/rules/api/`, which Claude loads when it reads a matching file. Before creating a new file, read an existing file of the same kind (e.g. a `*.usecase.ts`) so the matching rule loads.

## Conventions

- Imports: `src/…` across features, relative paths only inside a feature, `"shared"` for the shared package.
- Don't use `import type` for a class Nest injects by its type (a use case or adapter in a constructor): Nest reads constructor types from decorator metadata, a type-only import erases them, and DI fails at boot. That's why `typescript/consistent-type-imports` is off in api.
- Logging: core code depends on the `AppLogger` port ([src/shared-kernel/logger.ts](src/shared-kernel/logger.ts)), wired in the module with `new NestJsAppLogger(SomeUseCase.name)`; adapters use Nest's `Logger`.
- Name controllers `<feature>.controller.ts` and modules `<feature>.module.ts`: rules attach to these suffixes. Lint enforces the use case, event, `Sql*` and `InMemory*` file names.
- Seed reference datasets (ALDO carbon storage, DVF commune stats, France Ruralités): [data/README.md](data/README.md).

## Commands

- `pnpm --filter api dev`: NestJS in watch mode.
- `pnpm --filter api typecheck` and `pnpm --filter api lint` (oxlint, type-aware). `tsc` only type-checks; SWC compiles ([swc.config.json](swc.config.json)).

## Building a feature

Inside out, one failing test at a time: the use case and its unit tests, then the SQL adapters and their integration tests, then the controller and module wiring with a controller integration test.
