# Shared package

Framework-free TypeScript used by both `apps/api` and `apps/web`, published to them as `"shared"` through [src/index.ts](src/index.ts). The apps consume the built `dist/`: after a change, follow "Changing `packages/shared`" in the root [AGENTS.md](../../AGENTS.md).

## Shared or app?

Put code here only when both apps need it:

- request and response DTOs of an API endpoint (Zod schema + inferred type);
- domain vocabulary: enums such as `soilTypeSchema` or `siteNatureSchema`, field schemas such as `surfaceAreaSchema` or `soilsDistributionSchema`;
- pure functions (no I/O, no framework): impact calculations, French labels (`getLabelForNaturalAreaType`), `typedObjectKeys` / `typedObjectEntries`;
- port interfaces both apps implement, e.g. [IDateProvider.ts](src/adapters/IDateProvider.ts).

Keep it in the app when only one app uses it, when it needs React or NestJS, when it is infrastructure (database rows, HTTP clients, env config), or when it is business logic that one app owns.

Runtime dependencies are only `zod`, `date-fns` and `uuid`: a new one ships to both the browser bundle and the API.

## API DTOs

- One file per endpoint in `src/api-dtos/<domain>/`, named `{operation}{Entity}.dto.ts`: [getSiteView.dto.ts](src/api-dtos/sites/getSiteView.dto.ts) (response), [register.dto.ts](src/api-dtos/auth/register.dto.ts) (request).
- Export the schema and the type inferred from it, same name without `Schema`: `getSiteViewResponseDtoSchema` / `GetSiteViewResponseDto`, `registerUserRequestDtoSchema` / `RegisterUserRequestDto`. Several request schemas drop `Request` (`createCustomSiteDtoSchema`).
- Compose from the domain schemas instead of retyping fields: [createCustomSite.dto.ts](src/api-dtos/sites/createCustomSite.dto.ts) is a `z.discriminatedUnion("nature", …)` built with `siteNatureSchema.extract(["FRICHE"])` and `soilsDistributionSchema`.
- Exports are explicit: add each new name to the folder's `index.ts` and to [src/api-dtos/index.ts](src/api-dtos/index.ts) (named re-exports, not `export *`), or `"shared"` won't export it.

## Enums

Follow [soilType.ts](src/soils/soilType.ts): an `as const` array when the order matters (`ORDERED_SOIL_TYPES`), `z.enum()` on it, the type from `z.infer`. No TypeScript `enum`.

## Checks

Run `pnpm --filter shared typecheck && pnpm --filter shared lint && pnpm --filter shared test && pnpm --filter shared format:check`. `format:check` covers the `.md` files of the package, this one included.

The root AGENTS.md lists what to run in the other workspaces after a shared change. The api and web test runs don't typecheck: when you rename, remove or retype an exported field, also run `pnpm --filter api typecheck` and `pnpm --filter web typecheck`.

## Tests

Test design and the runner are in [.claude/rules/testing.md](../../.claude/rules/testing.md). node:test specifics:

- One file, from `packages/shared`: `node --import=tsx --test src/path/to/file.spec.ts` (`pnpm --filter shared test <path>` still runs the whole suite). Keep `--import=tsx`: `--experimental-strip-types` alone doesn't resolve the extensionless and directory imports used here.
- `assert.deepStrictEqual` treats `{ key: undefined }` and `{}` as different, unlike Vitest's `toEqual`: when a key is removed, write the expected object without it instead of spreading `{ ...obj, key: undefined }`.
- `describe` and `it` return Promises, unlike Vitest; that is why `no-floating-promises` is off for spec files in [.oxlintrc.json](.oxlintrc.json).
- There is no `it.each()`: loop at the `describe` level as testing.md says.
