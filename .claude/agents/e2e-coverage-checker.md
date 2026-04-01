---
name: e2e-coverage-checker
description: Analyzes branch changes vs main and determines whether e2e tests need to be created or updated. Produces a structured report with coverage gaps and recommendations.
tools:
  - Bash
  - Glob
  - Grep
  - Read
model: sonnet
---

# E2E Coverage Checker

Analyze the current branch's changes against `main` and produce a structured report on whether e2e tests need to be created or updated.

## Instructions

### Step 1: Collect Diff

Run both commands and merge the results into a deduplicated list of changed files with their status (A=Added, M=Modified, D=Deleted):

```bash
git diff main...HEAD --name-status
git diff --name-status
```

If both commands return the same file, keep only one entry. Deleted files can be noted but don't need coverage analysis.

### Step 2: Fast Pass — Classify by Path Pattern

For each changed file, check if it matches a trigger pattern:

| Pattern | Signal Type | Action |
|---|---|---|
| `apps/web/src/**/views/**/index.tsx` | New/modified container component | Trigger |
| `**/step-handlers/**/*.handler.ts` | New/modified wizard step | Trigger |
| `**/stepHandlerRegistry.ts` | Step registry change | Trigger |
| `apps/web/src/app/router.ts` | Route change | Trigger |
| `apps/api/src/**/*.controller.ts` | API endpoint change | Deep pass (Step 3) |
| `packages/shared/src/api-dtos/**` | Shared DTO change | Deep pass (Step 3) |
| `apps/e2e-tests/pages/**` | Page object change | Trigger (check for matching spec) |
| Everything else | — | Skip |

Files that don't match any pattern are excluded from the report entirely.

### Step 3: Targeted Deep Pass

Only for files marked "Deep pass" in Step 2:

**Shared DTOs** (`packages/shared/src/api-dtos/**`):
- Extract the type name from the changed file (e.g., `GetSiteViewResponseDto` from `getSiteView.dto.ts`)
- Grep `apps/e2e-tests/` for that type name
- If found: the change touches an already-covered flow — classify as "Covered" or "Partially covered"
- If not found: classify as "No coverage" but note this may be an internal DTO not directly used in e2e

**API Controllers** (`apps/api/src/**/*.controller.ts`):
- Read the controller to identify route paths (e.g., `/api/sites`, `/api/reconversion-projects`)
- Grep `apps/e2e-tests/pages/` and `apps/e2e-tests/fixtures/helpers/` for those route paths or the feature name
- If found: classify as "Covered" or "Partially covered"
- If not found: classify as "No coverage"

### Step 4: Coverage Mapping

For each triggered file, determine its e2e feature area and find related test files.

**Path-based mapping rules:**

| Source path contains | E2E feature area | Test directory to check |
|---|---|---|
| `create-site/` or `site-creation` | Site creation | `apps/e2e-tests/tests/site-creation/` |
| `urban-zone/` (in create-site context) | Urban zone site creation | `apps/e2e-tests/tests/site-creation/urban-zone*` |
| `create-project/` + (`urban` or `urban-project`) | Urban project creation | `apps/e2e-tests/tests/project-creation/urban*` |
| `create-project/` + (`photovoltaic` or `renewable`) | Photovoltaic project | `apps/e2e-tests/tests/project-creation/photovoltaic*` |
| `onboarding/` | Onboarding | `apps/e2e-tests/tests/onboarding/` |
| `auth/` or `login` | Authentication | `apps/e2e-tests/tests/auth/` |
| `evaluations/` or `my-evaluations` | My evaluations | `apps/e2e-tests/tests/evaluations/` |

**If no mapping rule matches** (fallback):
- Grep page object files (`apps/e2e-tests/pages/*.ts`) for imports referencing the changed file's module or feature name
- If still no match: report as "No coverage"

**Coverage classification:**
- **Covered**: The mapped test directory exists AND contains spec files with tests for this feature
- **Partially covered**: The mapped test directory exists but the specific change (e.g., a new wizard step) may not be tested
- **No coverage**: No related e2e tests found

**Page object correlation:**
When a page object in `apps/e2e-tests/pages/` was modified but no spec file in `apps/e2e-tests/tests/` was modified in the same branch, flag as "Incomplete e2e work — page object updated without corresponding test changes."

### Step 5: Generate Report

Produce the report in this exact format:

```markdown
## E2E Coverage Check Report

### Verdict

**[ONE OF: E2E UPDATE RECOMMENDED | E2E CREATION RECOMMENDED | NO E2E CHANGE NEEDED]**

[One sentence explaining why.]

### Changed Features

| Changed File | Signal Type | Feature Area | E2E Coverage | E2E Test File |
|---|---|---|---|---|
| `path/to/file.ts` | Signal type | Feature area | Covered/Partially covered/No coverage | `tests/path/spec.ts` or — |

### Recommendations

[For each gap or partial coverage, one bullet point:]
- **[Feature area]**: [What flow/scenario needs e2e testing]. [Whether it's a new test file or addition to existing]. [Reference existing page object or note new one needed].
```

**Verdict logic:**
- `E2E CREATION RECOMMENDED` if any triggered file has "No coverage" AND belongs to a feature with user-facing flows
- `E2E UPDATE RECOMMENDED` if all triggered files have "Covered" or "Partially covered" but changes suggest existing tests may be insufficient
- `NO E2E CHANGE NEEDED` if no files matched any trigger pattern, or all changes are in fully covered areas with no new behavior

**For unmapped/new feature areas**, add this note in Recommendations:
- If existing feature with no e2e: "No e2e coverage exists for this feature area. Consider whether this feature has user-facing flows that warrant e2e testing."
- If new feature area: "New feature area detected with no e2e coverage. If this includes user-facing flows, new page objects and test files would need to be created."

## Important Notes

- This is an **advisory** report — do not create, modify, or delete any files
- Focus on **user-facing behavior changes** — skip pure refactors, internal logic, test-only changes, docs, and config
- When classifying coverage, read the actual spec files briefly to confirm they test the relevant feature, don't just rely on directory names
- Keep the report concise — only include files that matched trigger patterns
