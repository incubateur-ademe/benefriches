---
name: to-tickets
description: Break a task's DESIGN.md (or the current conversation) into vertical-slice tickets with blocking edges, written as one file per ticket under .agents/tasks/<slug>/issues/. Invoke only when the user explicitly runs /to-tickets.
effort: medium
allowed-tools: Bash, Read, Write, Grep, Glob, Agent
user-invocable: true
disable-model-invocation: true
---

# To Tickets

Break a task's spec into **tickets** — tracer-bullet vertical slices, each declaring the tickets that **block** it — published as local files under `.agents/tasks/<slug>/issues/`. There is no external issue tracker in this project; the files themselves are the tracker.

## Process

### 1. Gather context

Find the task: if a slug is obvious from the conversation, use `.agents/tasks/<slug>/DESIGN.md`. If ambiguous, list `.agents/tasks/*/` and ask. Read the full spec. If no spec exists yet, work from the current conversation directly (and suggest the user run `/to-spec` first if the discussion is still unsettled).

### 2. Explore the codebase

If you haven't already, explore the relevant code. Ticket titles and descriptions should use the project's domain vocabulary and respect any ADRs (`docs/adr/`) in the area touched.

Look for prefactoring opportunities that would make the real change easier — "make the change easy, then make the easy change." A prefactor step, if needed, comes first and blocks everything else.

### 3. Draft vertical slices

Break the work into tracer-bullet tickets:

- Each ticket cuts a narrow but **complete** path through every layer it touches (schema → API → UI → tests) — vertical, not a horizontal slice of one layer.
- A completed ticket is demoable or independently verifiable (e.g. `pnpm --filter web test` plus a manual check, not "half a feature").
- Each ticket is sized to fit in a single fresh agent context window.
- Any prefactoring is its own ticket, done first.

Give each ticket its **blocking edges** — the other ticket IDs that must be done before it can start. A ticket with no blockers can start immediately.

**Wide refactors are the exception to vertical slicing.** A wide refactor is one mechanical change (rename a column, retype a shared symbol) whose blast radius fans across the whole codebase — no vertical slice can land green. Don't force it into a tracer bullet; sequence it as **expand → migrate → contract**:

1. **Expand**: add the new form beside the old so nothing breaks.
2. **Migrate**: move call sites over in batches sized by blast radius (per app, per directory), each batch its own ticket blocked by the expand ticket, keeping `pnpm -r typecheck && pnpm -r lint && pnpm -r format && pnpm -r test` green batch to batch.
3. **Contract**: delete the old form once no caller remains, blocked by every migrate batch.

### 4. Quiz the user

Present the proposed breakdown as a numbered list. For each ticket show:

- **Title**
- **Blocked by**: other ticket numbers, or "None — can start immediately"
- **What it delivers**: the end-to-end behavior this ticket makes work

Ask whether the granularity feels right (too coarse / too fine), whether the blocking edges are correct, and whether any tickets should merge or split. Iterate until approved.

### 5. Publish

Write one file per ticket to `.agents/tasks/<slug>/issues/<NN>-<slug>.md`, numbered from `01` in dependency order (blockers first), using the template below. Never combine tickets into a single file.

<ticket-template>

# `<NN>` — `<Ticket title>`

**Blocked by:** ticket numbers/titles this depends on, or "None — can start immediately".

**Status:** `ready` | `blocked`

## What to build

The end-to-end behavior this ticket makes work, from the user's perspective — not a layer-by-layer implementation list. No file paths or code snippets, unless a prototype snippet encodes a decision (schema shape, state machine) more precisely than prose — then inline it, trimmed, noted as coming from a prototype.

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Validation

The commands that must pass before this ticket is done, per the `Required Tests by Change Type` table in the root `CLAUDE.md` (e.g. `pnpm --filter api test`, `pnpm --filter web typecheck && pnpm --filter web lint && pnpm --filter web test`, or the full `pnpm --filter shared build && pnpm -r typecheck && pnpm -r test` sequence if `shared` is touched).

</ticket-template>

### 6. Hand off

Report the published ticket paths. Work the **frontier**: the next actionable ticket is any one whose blockers are all `done`. Implementing a ticket is a separate step, not part of this skill — when the user is ready, point them at the ticket file and let them (or an agent) drive it following this project's normal TDD/testing conventions (`.claude/rules/testing.md`), gated by the `code-reviewer` skill and `/generate-commit-message` before committing.

Do not close, modify, or reorder existing ticket files beyond what the user approved in step 4.
