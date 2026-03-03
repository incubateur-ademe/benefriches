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
│       ├── api-client.ts          # Direct API calls for test data seeding
│       ├── cookie.helpers.ts      # Cookie manipulation
│       └── site-creation.helpers.ts  # Site creation shortcuts
└── tests/
    └── [feature]/
        ├── [feature].fixtures.ts  # Feature-specific fixtures
        └── [feature].spec.ts      # Test specifications
```

---

## Commands

```bash
# Start e2e stack (required before running tests)
docker compose --env-file .env.e2e -f docker-compose.e2e.yml up -d

# Run tests
pnpm --filter e2e-tests test:e2e                              # All tests (headless)
pnpm --filter e2e-tests test:e2e tests/[feature]/             # Specific feature
pnpm --filter e2e-tests test:headed tests/[feature]/          # With browser visible

# Quality checks
pnpm --filter e2e-tests typecheck
pnpm --filter e2e-tests lint
```

---

## Key Patterns

### Page Objects (`pages/*.ts`)

- One class per page/screen
- Methods: `goto()`, `expect*()` (assertions), action verbs (`click*`, `fill*`, `select*`)
- Use accessibility-first selectors: `getByRole()` > `getByLabel()` > `getByText()` > `locator()`

### Fixtures (`tests/[feature]/[feature].fixtures.ts`)

- Extend `authTest` for authenticated flows, `base` test otherwise
- Compose page objects into feature fixtures

### Test Files (`tests/[feature]/[feature].spec.ts`)

- Import `test` from local fixtures
- Descriptive test names: "allows user to..." / "shows error when..."

---

## Reference

For complete patterns and examples, see the skill: `.claude/skills/create-e2e-test/SKILL.md`

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
