# E2E Tests - Quick Reference

> Playwright end-to-end tests with Page Object pattern

---

## Structure

```
apps/e2e-tests/
├── pages/           # Page Objects (one per page/screen)
├── fixtures/        # Base fixtures (auth, etc.)
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
