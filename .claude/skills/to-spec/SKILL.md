---
name: to-spec
description: Turn the current conversation into a design spec for a task and write it to .agents/tasks/<slug>/DESIGN.md — no interview, just synthesis of what's already been discussed. Invoke only when the user explicitly runs /to-spec.
effort: medium
allowed-tools: Bash, Read, Write, Grep, Glob, Agent
user-invocable: true
disable-model-invocation: true
---

# To Spec

Turn the current conversation and codebase understanding into a design spec, written to `.agents/tasks/<slug>/DESIGN.md`. Do **not** interview the user — just synthesize what you already know from the conversation. If something genuine is missing (not just detail you could reasonably infer), ask a single targeted question rather than guessing.

`.agents/tasks/` is gitignored scratch space for in-flight work — this is not `docs/adr/` (durable architectural decisions) or `docs/specs/` (curated, committed feature docs for large multi-week efforts). Use this skill for the everyday "I want to build X" spec, not as a replacement for those.

## Process

### 1. Pick the task slug

Derive a short kebab-case slug from the feature being discussed (e.g. `optional-reinstatement`, `newsletter-subscription-sync`). If a `.agents/tasks/<slug>/` directory already exists for this work, reuse it. Otherwise this is a new task — confirm the slug reads naturally before creating the directory.

### 2. Explore the codebase

If you haven't already in this conversation, explore the repo to understand the current state of the code relevant to this task:

- Which app(s) are affected: `apps/api` (NestJS, Clean Architecture: `core/` + `adapters/`), `apps/web` (React/Redux, ViewData + step-handler patterns for wizards), `packages/shared` (framework-agnostic types/Zod schemas).
- The project's domain vocabulary already established in code (e.g. "reconversion project", "friche", "step handler", "impacts") — use it throughout the spec instead of inventing new terms.
- Any relevant ADRs under `docs/adr/` that constrain this area — respect them, and call out if this spec appears to need a new one (suggest running `/adr` after implementation, don't create it yourself here).

### 3. Sketch test seams

Identify the seams at which this feature will be tested. Prefer existing seams over new ones, and the highest seam possible (fewer seams across the codebase is better — one is ideal):

- Unit (`.spec.ts`, no I/O): domain logic in `core/` (api) or reducers/selectors/handlers (web).
- Integration (`.integration-spec.ts`): real DB/network — repositories, controllers.
- E2E (Playwright, `apps/e2e-tests`): full wizard/user flows, only when the change is user-visible end-to-end.

If a new seam looks necessary, propose it at the highest point you can, and check with the user that it matches their expectations before writing the spec.

### 4. Write the spec

Use the template below. Do **not** include specific file paths or code snippets — they go stale fast.

Exception: if a prototype or exploration produced a snippet that encodes a decision more precisely than prose can (a state machine, a reducer, a Zod schema shape), inline it within the relevant decision, trimmed to the decision-rich part, and note it came from a prototype.

<spec-template>

# `<Feature Name>` — Design Spec

## Problem Statement

The problem, from the user's (product) perspective.

## Solution

The solution, from the user's perspective.

## User Stories

A long, numbered list covering all aspects of the feature:

1. As a `<actor>`, I want `<capability>`, so that `<benefit>`.

## Implementation Decisions

What will change, using the project's domain vocabulary and architecture layers (not file paths):

- Modules/layers touched (e.g. "a new step handler in the urban project wizard", "a new column on `reconversion_projects`", "a new Zod schema in `shared`").
- Interfaces of those modules that change.
- Architectural or schema decisions, API contracts, specific interaction rules.
- Technical clarifications made during the conversation.

## Testing Decisions

- What makes a good test here (test external behavior at the seams identified above, not implementation details — see `.claude/rules/testing.md`).
- Which seams/modules get unit vs. integration vs. e2e coverage, and why.
- Prior art: similar tests already in the codebase to model these on.

## Out of Scope

What this spec deliberately does not cover.

## Further Notes

Anything else worth recording (open questions, follow-up ideas, risks).

</spec-template>

### 5. Publish

Create `.agents/tasks/<slug>/` if it doesn't exist, and write the spec to `.agents/tasks/<slug>/DESIGN.md`. Report the path to the user. Do not proceed to breaking it into tickets — that's a separate step the user drives explicitly with `/to-tickets`.
