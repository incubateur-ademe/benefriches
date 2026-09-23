# Benefriches

Bénéfriches (ADEME incubator, beta.gouv) helps land-development project managers ("chargés d'opération d'aménagement") assess the economic, social and environmental impacts of reconverting a site, so that more brownfields get reconverted. The UI and all user-facing copy are in French.

Core flow: describe a **site** → describe a **reconversion project** on it → view the project's **impacts** over an evaluation period, compared with leaving the site as is.

- Site natures (`siteNatureSchema`): `FRICHE` (brownfield), `AGRICULTURAL_OPERATION`, `NATURAL_AREA`, `URBAN_ZONE`
- Project types (`developmentPlanTypeSchema`): `URBAN_PROJECT`, `PHOTOVOLTAIC_POWER_PLANT`
- Creation modes: `express` (generated from defaults) or `custom` (step-by-step wizard); sites can also come from `csv-import`, projects can be `duplicated`
- `soilsDistribution`: surface area per soil type, the input to most impact calculations
- Economic impact formulas (in French): [documentation-calculs-impacts.md](packages/shared/src/reconversion-project-impacts/documentation-calculs-impacts.md)

## Workspaces

pnpm monorepo; each workspace has its own AGENTS.md:

- `apps/api`: NestJS REST API, PostgreSQL/Knex, Clean Architecture — [apps/api/AGENTS.md](apps/api/AGENTS.md)
- `apps/web`: React SPA, Vite + Redux, Clean Architecture — [apps/web/AGENTS.md](apps/web/AGENTS.md)
- `apps/e2e-tests`: Playwright end-to-end tests — [apps/e2e-tests/AGENTS.md](apps/e2e-tests/AGENTS.md)
- `packages/shared`: framework-free TypeScript used by api and web — [packages/shared/AGENTS.md](packages/shared/AGENTS.md)

Full-stack feature walkthrough: [docs/feature-example.md](docs/feature-example.md).

Skills live in `.agents/skills/` (canonical); `.claude/skills/<name>` are symlinks maintained by `pnpm agent-skills:sync` — edit under `.agents/skills/` and run it after adding a skill.

## Conventions

- Run scripts with pnpm, not npm: `pnpm --filter <api|web|shared|e2e-tests> <script>`.
- Keep `packages/shared` free of framework dependencies: it runs in both Node and the browser.
- Before writing a Zod schema, look for one to reuse in `packages/shared` (e.g. `surfaceAreaSchema`, `soilsDistributionSchema`).
- Enum-like types: `z.enum([...])` + `z.infer`; read the values with `.options`.
- Dates: use `date-fns`.
- New env var: add it to the app's `.env.example` (empty/off), to the root `.env.e2e` (the value the e2e stack needs) and to the service's `environment:` block in `docker-compose.e2e.yml`.
- Database schema changes: use the `/create-database-migration` skill.
- To silence a lint rule on one line, use `// eslint-disable-next-line <rule>` (oxlint honours it).

## Changing `packages/shared`

The apps only pick up a change once shared is rebuilt and reinstalled:

```bash
pnpm --filter shared build
pnpm --filter api install && pnpm --filter web install
```

While iterating, `pnpm --filter shared dev` rebuilds on every change.

## Testing

How we design tests (what to test, structure, placement): [.claude/rules/testing.md](.claude/rules/testing.md). Read it when planning or brainstorming tests, not only when editing spec files.

- Unit (`*.spec.ts`): no real I/O, next to the code under test. HTTP adapter tests with a mocked transport (e.g. `mock.fn()` on `HttpService`) are unit tests.
- Integration (`*.integration-spec.ts`, in `adapters/`): real database via testcontainers, or real network calls.
- E2E (`apps/e2e-tests/tests/`): full user flows against the running stack; run them with the `/run-e2e-tests` skill.

The pre-commit hook runs Talisman (secret scan), lint and format checks, not tests. Run these yourself:

| Change            | Run                                                                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/shared` | `pnpm --filter shared test`, `pnpm --filter api test`, `pnpm --filter web test`, `pnpm --filter e2e-tests typecheck` (page objects import shared types) |
| `apps/api`        | `pnpm --filter api test` (unit + integration)                                                                                                           |
| `apps/web`        | `pnpm --filter web test`                                                                                                                                |

Single file (paths are relative to the app directory):

- api unit, from `apps/api`: `node --import ./test/swc-esm-loader.mjs --test src/path/to/file.spec.ts` (`test:unit` appends the path to its glob, so it would run the whole suite)
- api integration: `pnpm --filter api test:integration:file src/path/to/file.integration-spec.ts`
- web: `pnpm --filter web test src/path/to/file.spec.ts`

## Git

Trunk-based: every push to `main` runs CI and deploys to staging; production deploy is manual. Don't bypass the pre-commit hook with `--no-verify`.
