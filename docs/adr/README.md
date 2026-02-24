# Architecture Decision Records

This directory contains Architecture Decision Records (ADR) for the Benefriches project.

## What is an ADR?

An ADR is a short document that captures an important architectural decision made along with its context and consequences.

## How to create a new ADR

1. Copy the template: `docs/adr/0000-template.md`
2. Name it `NNNN-kebab-case-title.md` (next sequential number)
3. Fill in all sections, including Options Considered with pros/cons
4. Set status to `Proposed`, then update to `Accepted` once agreed upon
5. Add it to the index below

## Statuses

- **Proposed**: Under discussion
- **Accepted**: Agreed upon and in effect
- **Deprecated**: No longer relevant
- **Superseded**: Replaced by a newer ADR (link to it)

## Index

| #    | Title                                      | Status   | Date       |
| ---- | ------------------------------------------ | -------- | ---------- |
| 0001 | [Clean/Hexagonal Architecture](0001-clean-hexagonal-architecture.md) | Accepted | 2026-02-23 |
| 0002 | [Redux event-based state management](0002-redux-event-based-state-management.md) | Accepted | 2026-02-23 |
| 0003 | [Shared package for cross-app types](0003-shared-package-for-cross-app-types.md) | Accepted | 2026-02-23 |
| 0004 | [Colocate urban project step definitions](0004-colocate-urban-project-step-definitions.md) | Accepted | 2026-02-23 |
