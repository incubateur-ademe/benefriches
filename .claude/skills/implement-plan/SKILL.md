---
name: implement-plan
description: >
  Implement a feature plan from a spec file, following test-first methodology and tracking all
  deliverables. Use this skill whenever the user says "implement this plan", "start working on
  specs/...", "let's build the feature from the spec", "execute the plan", or points at a plan
  file and says to build it. Don't wait for explicit "implement-plan" keywords.
user-invocable: true
---

# Implement Plan

Follow the phases below to implement the `Plan`, then `Report` the completed work.

IMPORTANT: If no plan is provided (i.e., $ARGUMENTS is empty or blank), STOP immediately and ask the user to provide one. Example usage: `/implement-plan specs/new-feature.md`

## Plan
$ARGUMENTS

---

## Phase 1: Understand Before Acting

Before writing any code:

1. **Read the ENTIRE plan** from start to finish
2. **Determine scope** from the plan's Scope section (API-only / Web-only / Full-stack / Shared)
3. **Load relevant context** based on scope — this is critical to implementing patterns correctly:
   - API scope: read `<root>/.claude/context/api/00-overview.md` + any specific pattern files the plan references
   - Web scope: read `<root>/apps/web/CLAUDE.md`
   - Full-stack: read both
   - Shared: read `<root>/packages/shared/CLAUDE.md`
4. **Detect database work**: if the plan mentions migrations, new tables, schema changes, or `tableTypes.d.ts` — flag this now. You'll need to invoke `/create-database-migration` at the appropriate step (never create migration files manually).
5. **Build a todo inventory** using TodoWrite, based on the "Step by Step Tasks" section (preferred) or "Files to Deliver" as fallback:
   - One todo per step from the plan (not per file — preserve the plan's ordering intent)
   - Add a final todo: "Final verification"

---

## Phase 2: Implement Step by Step

Work through the plan's **Step by Step Tasks** in order. For each step:

1. Mark the step todo as `in_progress`
2. **If the step introduces new functionality:**
   - Write the test(s) first — they should fail initially (no production code yet)
   - Implement the production code to make the tests pass
   - Run the step's specific test command from the plan
3. **If the step is structural** (adding types, registering handlers, updating config with no new logic):
   - Implement directly, no test file needed
4. Run the incremental quality check for the affected app after each step:
   - Web: `pnpm --filter web typecheck && pnpm --filter web lint`
   - API: `pnpm --filter api typecheck && pnpm --filter api lint`
   - Shared: `pnpm --filter shared build && pnpm --filter api typecheck && pnpm --filter web typecheck`
5. Fix any type or lint errors before moving to the next step
6. Mark the step todo as `completed`

The reason to work step by step (rather than writing all tests then all production code) is that the plan's ordering encodes real dependencies — implementing out of order causes cascading failures that are harder to debug.

---

## Phase 3: Final Verification

1. Re-read the plan's "Files to Deliver" section
2. Cross-check: does every listed file exist?
3. Cross-check: does every listed test case exist and pass?
4. Run ALL validation commands from the plan's "Validation Commands" section
5. If anything is missing, go back and complete it
6. Invoke the `code-reviewer` skill

---

## Report

Only after Phase 3 is complete:

1. Summarize the work in a concise bullet point list
2. Show files and lines changed: `git diff --stat`
3. Confirm: "All tests pass" and "All validation commands pass"
