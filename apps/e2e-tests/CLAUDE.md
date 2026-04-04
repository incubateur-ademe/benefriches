# E2E Tests - Quick Reference

> Playwright end-to-end tests with Page Object pattern

---

## Structure

```
apps/e2e-tests/
├── pages/           # Page Objects (one per page/screen)
├── fixtures/
│   ├── auth.fixtures.ts   # Base auth fixture
│   └── helpers/           # Shared test helpers
│       ├── api-client.ts          # Seed DB state via direct API calls (bypasses UI; use in beforeEach for pre-conditions)
│       ├── cookie.helpers.ts      # Cookie manipulation
│       └── site-creation.helpers.ts  # Site creation shortcuts
└── tests/
    └── [feature]/
        ├── fixtures.ts              # Shared feature fixtures (when sub-types exist)
        ├── [feature].fixtures.ts    # Feature fixtures (simple features, no sub-types)
        ├── [feature].spec.ts        # Single spec (simple features)
        └── [type]/                  # Sub-type folder (when feature has multiple types/modes)
            └── [mode]-[type].spec.ts  # e.g. create-custom-friche.spec.ts
```

---

## Commands

```bash
# Start e2e stack (required before running tests)
docker compose --env-file .env.e2e -f docker-compose.e2e.yml up -d

# Run tests
pnpm --filter e2e-tests test:headless                              # All tests (headless)
pnpm --filter e2e-tests test:headless tests/[feature]/             # Specific feature
pnpm --filter e2e-tests test:headless tests/[feature]/[type]/      # Specific sub-type (e.g. site-creation/friche/)
pnpm --filter e2e-tests test:headed tests/[feature]/          # With browser visible

# Quality checks
pnpm --filter e2e-tests typecheck
pnpm --filter e2e-tests lint
pnpm --filter e2e-tests format:check
```

---

## Key Patterns

### Page Objects (`pages/*.ts`)

- One class per page/screen
- Methods: `goto()`, `expect*()` (assertions), action verbs (`click*`, `fill*`, `select*`)
- Use accessibility-first selectors: `getByRole()` > `getByLabel()` > `getByText()` > `locator()`

### Fixtures

- Simple features: `tests/[feature]/[feature].fixtures.ts`
- Features with sub-types: shared `tests/[feature]/fixtures.ts`
- Extend `authTest` for authenticated flows, `base` test otherwise
- Compose page objects into feature fixtures

### Test Files

- Sub-type specs: `tests/[feature]/[type]/[mode]-[type].spec.ts`
- Simple specs: `tests/[feature]/[feature].spec.ts`
- Import `test` from local fixtures
- Descriptive test names: "allows user to..." / "shows error when..."

### API Client (pre-condition seeding)

- Use `api-client.ts` in `beforeEach` to seed DB state without going through the UI
- Use for pre-conditions only (e.g. create a site before testing project creation)
- Don't use for the flow under test — that must go through the UI

---

## Reference

**Adding a new test?** Use the `/create-e2e-test` skill — it covers page objects, fixtures, and spec structure.
**Debugging a failing test?** Run with `--headed` or add `--debug` for step-by-step Playwright inspector.

---

## Critical Rules

- **Always use Page Objects** - No direct selectors in test files
- **Accessibility-first selectors** - Prefer `getByRole()` over CSS selectors
- **One fixture file per feature** - Compose page objects there
- **Import shared types** - Use `import type { SiteNature } from "shared"` when needed

---

## Gotchas

- **DSFR radio/checkbox inputs require `{ force: true }`** - DSFR labels overlay native inputs, causing "intercepts pointer events" errors with `.check()`
- **`test.describe` titles must start with lowercase** - oxlint rule `playwright/prefer-lowercase-title`
- **`CreateCustomSiteDto` is a discriminated union** - Use `Extract<CreateCustomSiteDto, { nature: "AGRICULTURAL_OPERATION" }>` to narrow, not `Omit<>` on the full union
- **Custom `MonthYearInput` needs `pressSequentially`** - Formats as you type, so `fill()` doesn't work; use `pressSequentially("092027")` for "09/2027"
- **Form buttons depend on pre-filled values** - Many wizard forms (expenses, revenue) are pre-filled with calculated defaults, showing "Valider" instead of "Passer"
- **Read actual component files for exact French labels** - Don't guess form labels; check the `.tsx` source for the exact `label` prop text
- **Feature flags must be explicitly forwarded** - `docker-compose.e2e.yml` must list each `WEBAPP_ENABLE_*` var under the web service `environment:` block; vars in `.env.e2e` are not automatically passed to the container
