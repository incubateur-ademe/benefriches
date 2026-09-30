---
description: Write the implementation spec for a Linear issue snapshot (ADW plan step)
argument-hint: <snapshot-dir>
model: opus
---

Plan the issue snapshotted in `$ARGUMENTS` (written by `linear.mjs snapshot`) and write the spec to `$ARGUMENTS/spec.md`. Do not edit anything else: planning changes no code.

1. Read every file in the snapshot: `issue.md`, `issue.json`, `comments.json`, `relations.json`, `DESIGN.md` if present, and each file in `attachments/`. The issue and its comments are the ticket; `DESIGN.md` is the context of the project it belongs to.
2. Ground the plan in the code. Use the shell, Explore subagents for broad searches, the Figma MCP server for design links, and the docs MCP server for library APIs. Read the AGENTS.md files, rules and skills that apply to the files you will touch, so the Approach follows them instead of restating them.
3. Decide everything the codebase lets you decide, and record each non-obvious choice in Approach. Never invent what only a human can provide: user-facing copy, a visual design for new UI, a business formula or threshold, an external API contract. If the ticket needs one of these and neither the snapshot nor the code provides it, the issue is blocked.

If blocked, write `spec.md` as the line `BLOCKED` followed by one bullet per missing input (what is missing, where it is needed, who can provide it) and stop. Otherwise write `spec.md` with exactly these sections, then print its path:

```text
# <issue identifier>: <issue title>

## Context

Why this change, what exists today, and the constraints from the ticket and DESIGN.md.

## Approach

The design in a few paragraphs: layers touched, data flow, decisions and their reasons, the project skills the build must use (by name).

## Files

One bullet per file to create, modify or delete, with the change in one line.

## Validation

Shell commands, run from the repository root, that prove the change works: focused unit and integration tests, e2e specs, then `pnpm verify`. List the tests to add as `.claude/rules/testing.md` asks.

## Scenarios

User-visible checks QA walks in a browser, one per bullet: starting page, actions, expected result. Write `None` when nothing user-visible changes.
```
