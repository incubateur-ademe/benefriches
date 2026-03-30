---
name: plan-feature
description: >
  Create a detailed implementation plan for a new feature in the Benefriches project.
  Use this skill whenever the user wants to plan, spec, or design the implementation of a feature —
  even if they just say "I want to implement X", "let's add Y", "how should we build Z", or
  "write a plan for...". Don't wait for explicit "plan" or "spec" keywords. This skill explores
  the codebase, loads relevant architecture patterns, and produces a structured markdown plan
  with TDD-ordered tasks, file lists, and validation commands.
effort: high
allowed-tools: Read, Write, Glob, Grep, Bash
user-invocable: true
---

# Feature Planning

Create a plan in `specs/<YYYY-MM-DD>-<feature-name>.md` for the `Feature` below.
Example: `specs/2026-01-30-user-authentication-refactoring.md`

## Instructions

1. **Declare scope first** - Determine if this is API-only, Web-only, Full-stack, or Shared
2. **Load only relevant context** based on scope:
   - API: `<root>/.claude/context/api/00-overview.md` + specific patterns needed
   - Web: `<root>/apps/web/CLAUDE.md` + specific patterns needed
   - Full-stack: Both overviews + specific patterns as needed
   - Shared: `<root>/packages/shared/CLAUDE.md` + check both API and Web CLAUDE.md for impact
3. **Explore targeted directories** - Don't explore everything:
   - API: `<root>/apps/api/src/[relevant-module]/`
   - Web: `<root>/apps/web/src/features/[relevant-feature]/`
   - Shared: `<root>/packages/shared/src/`
   - E2E: `<root>/apps/e2e-tests/tests/[relevant-feature]/` (if E2E tests are affected)
4. **Testing principles** - Each test should verify a distinct behavior:
   - Ask: "If test A passes, would test B always pass?" → If yes, test B is redundant
   - Ask: "What unique failure mode does this test catch?"
   - Avoid redundant tests (e.g., "response validation" covered by happy path)
5. Follow existing patterns. Report new library needs in Notes.
6. **Feature flags** - If the feature is behind an env flag, include `.env.example` and `.env.e2e` in Files to Deliver.
7. **Database changes** - If the feature requires schema changes, note that the `/create-database-migration` skill must be used (never create migration files manually).

## Plan Format

````md
# Feature: <name>

## Feature Overview
<describe the feature in detail, including its purpose and value to users>
<How does the solution work? 2-3 sentences.>

## User Story
As a <user type>, I want to <goal> so that <benefit>.

## Scope
- [ ] API-only
- [ ] Web-only
- [ ] Full-stack
- [ ] Shared package

## Solution Statement
<describe the proposed solution approach and how it solves the problem>

## Relevant Files
Use these files to implement the feature:

<find and list the files that are relevant to the feature — pattern references, files to modify,
test helpers. Group by concern (e.g. "Step Definition & Registration", "Pattern References", "Tests").>

## Files to Deliver

### Test Files
<!-- List ALL test files that must be created or modified. These are implemented FIRST. -->
| File Path | Tests | Verifies |
|-----------|-------|----------|
| `path/to/file.spec.ts` | test case 1, test case 2 | `path/to/production-file.ts` |

### Production Files
<!-- List ALL production files to create or modify. Implemented AFTER tests. -->
| File Path | Purpose |
|-----------|---------|
| `path/to/new-file.ts` | Description of what this file does |
| `path/to/existing-file.ts` | What modifications are needed |

## Step by Step Tasks
<list step by step tasks as h3 headers plus bullet points. Order matters: start with foundational
shared/API changes, then web, then E2E updates.

For each step that creates new functionality:
1. First list the test file(s) to create with their test cases
2. Then list the production code to implement
3. End with the specific test command to run for that step

Do NOT add a final "run Validation Commands" step — that section stands on its own.>

## Acceptance Criteria
<list specific, measurable criteria that must be met for the feature to be considered complete>

## Testing Strategy

### Unit Tests
<describe unit tests needed - each should test a distinct behavior>

### Integration Tests
<describe integration tests needed - typically: happy path, error cases, edge cases.
Write "None required" if this is a web-only feature with no API changes.>

### E2E Tests
<describe whether existing E2E tests need updating or new ones are needed.
Write "None required" if no user-visible flow changes.>

### Edge Cases
<list edge cases that need to be tested - only if they catch distinct failure modes>

## Validation Commands
<Specific commands to validate with 100% confidence the feature is implemented with zero regressions. Start with the most specific commands and end with broader ones.>

## Notes
<Optional: list any additional notes, future considerations, or context>
````

## Feature
$ARGUMENTS
