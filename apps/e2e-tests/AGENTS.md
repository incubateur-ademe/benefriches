# E2E tests

Playwright tests of full user flows, run against the e2e docker-compose stack (web on `http://localhost:3001`, see [playwright.config.ts](playwright.config.ts)). To start the stack and run tests, use the `run-e2e-tests` skill. To write a test (page object, fixtures, spec), use the `create-e2e-test` skill.

## Checks

Run `pnpm --filter e2e-tests typecheck && pnpm --filter e2e-tests lint && pnpm --filter e2e-tests format:check`. They don't need the stack.

## Layout

- `pages/`: page objects, one per page or wizard. Specs hold no selectors.
- [fixtures/auth.fixtures.ts](fixtures/auth.fixtures.ts): `authenticatedPage` registers a fresh user (unique email) through the API for each test, so tests share no data and run in parallel; `authenticatedApiClient` is an API client logged in as that user.
- `fixtures/helpers/`: API seeding ([site-creation.helpers.ts](fixtures/helpers/site-creation.helpers.ts), [reconversion-project-creation.helpers.ts](fixtures/helpers/reconversion-project-creation.helpers.ts)), fr-FR formats ([format.helpers.ts](fixtures/helpers/format.helpers.ts)), emails caught by the stack's mail catcher ([mail-catcher.ts](fixtures/helpers/mail-catcher.ts)).
- `tests/<feature>/`: a single-flow feature has `<feature>.fixtures.ts` and `<feature>.spec.ts`. A feature with several site natures or project types has one `fixtures.ts` and a folder per type holding `<mode>-<type>.spec.ts`, e.g. [tests/site-creation/](tests/site-creation/) with `friche/create-custom-friche.spec.ts`.

## Seed preconditions through the API, not the flow under test

- Only the flow under test goes through the UI. Create the site or project it starts from in a feature fixture, with `authenticatedApiClient` and the `create*ViaApi` helpers: [tests/project-update/urban/fixtures.ts](tests/project-update/urban/fixtures.ts).
- Never use the API client to perform or check the flow under test.

## Gotchas

- DSFR labels overlay native radio and checkbox inputs, so `.check()` fails with "intercepts pointer events": use `.check({ force: true })`.
- `CreateCustomSiteDto` is a discriminated union on `nature`: narrow it with `Extract<CreateCustomSiteDto, { nature: "AGRICULTURAL_OPERATION" }>`, not `Omit<>` on the whole union.
- `MonthYearInput` formats as you type, so `fill()` doesn't work: `pressSequentially("092027")` for "09/2027".
- Many wizard steps (expenses, revenue) are pre-filled with computed defaults, so their button reads "Valider" instead of "Passer": match `/Valider|Passer/` when both can happen.
- Don't guess French labels: read the exact `label` prop in the component's `.tsx`.
- Match fr-FR numbers exactly: the app's `formatMoney` and `formatSurfaceArea` ([formatNumber.ts](../web/src/shared/core/format-number/formatNumber.ts)) use a narrow no-break space as thousands separator. Build the expected string with `asEuroAmount`, `asSquareMeters` and the other helpers of `format.helpers.ts` instead of a loose regex like `/5\s?000/`.
- Site creation and update specs assert the accessibility tree of `<main>` against committed baselines (`expectWizardAriaSnapshot` in [SiteCreationPage.ts](pages/SiteCreationPage.ts) and [SiteUpdatePage.ts](pages/SiteUpdatePage.ts), files in `*.spec.ts-snapshots/*.aria.yml`). A deliberate UI change on those steps fails them: rerun with Playwright's `--update-snapshots` and review the `.aria.yml` diff.
