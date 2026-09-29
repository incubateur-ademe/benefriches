# Security rules: Benefriches

Checklist shared by the `security-review` skill and the `security-reviewer` agent. It holds what is specific to this codebase: known weak spots, where each control lives, and the scan patterns. Apply general OWASP knowledge on top of it. Links are relative to this file; paths in backticks are relative to the repo root.

## 1. Secrets

Secrets are env vars (Scalingo in staging and production), read with `ConfigService.getOrThrow`, e.g. `AUTH_JWT_SECRET` in [auth.module.ts](../../../apps/api/src/auth/adapters/auth.module.ts) or `CONNECT_CRM_CLIENT_SECRET` in [ConnectCrm.ts](../../../apps/api/src/marketing/adapters/secondary/ConnectCrm.ts). The root `.gitignore` ignores `.env` and `.env.local`; `apps/api/.env.example` and `apps/web/.env.example` list the names with empty values. Talisman scans staged files in the pre-commit hook ([.talismanrc](../../../.talismanrc)).

Secret patterns to detect (case-insensitive):

- `api[_-]?key\s*[:=]\s*['"]` (API keys)
- `password\s*[:=]\s*['"][^'"]+['"]` (hardcoded passwords)
- `secret\s*[:=]\s*['"][^'"]+['"]` (secrets)
- `token\s*[:=]\s*['"][^'"]+['"]` (tokens)
- `AKIA[0-9A-Z]{16}` (AWS access keys)
- `postgres://.*:.*@` or `mysql://.*:.*@` (database URLs with credentials)
- `bearer\s+[a-zA-Z0-9_-]+` (bearer tokens)

Exclude from the secret scan: `.env.example`, `*.spec.ts`, `*.integration-spec.ts`, documentation files.

Also flag a secret, token or auth link passed to a logger, an error message or a domain event: every domain event is stored in the `domain_events` table ([api-core.md](../../rules/api/api-core.md)).

## 2. Authentication and ownership (API)

Route conventions are in [api-http.md](../../rules/api/api-http.md); review changes against them.

- Auth is delegated: ProConnect (OpenID Connect) or an email magic link. No password is stored. [JwtAuthGuard.ts](../../../apps/api/src/auth/adapters/JwtAuthGuard.ts) reads the JWT from the `access_token` cookie and sets `req.accessTokenPayload`.
- Guards are decided per route. Public computation and reference-data routes (e.g. [territory.controller.ts](../../../apps/api/src/territory/adapters/primary/territory.controller.ts)) have none. Flag a route that reads or changes a user's data without `@UseGuards(JwtAuthGuard)`.
- Ownership is checked in the use case: the controller passes `req.accessTokenPayload.userId`, the use case compares it with the resource's `createdBy` and returns `fail("UserNotAuthorized")`, which the controller maps to 403. Reference pair: the `sites/:siteId/archive` route in [sites.controller.ts](../../../apps/api/src/sites/adapters/primary/sites.controller.ts) and [archiveSite.usecase.ts](../../../apps/api/src/sites/core/usecases/archiveSite.usecase.ts). Flag a write use case without that check.
- Known gap: create routes take `createdBy` from the request body. `POST /sites/create-custom` and `/sites/create-express` have no guard; `POST /reconversion-projects` is guarded but doesn't compare `createdBy` with the token. Don't copy this into new routes; report it when a change touches them.
- Some guarded reads don't check ownership (`GET sites/:siteId/features`, `GET reconversion-projects/:id/features`): ids are UUIDs. A new read of user data should check ownership or say why it doesn't.

## 3. Input validation (API)

- `ZodValidationPipe` from `nestjs-zod` is global (`APP_PIPE` in [app.module.ts](../../../apps/api/src/app.module.ts)). It validates only a parameter typed with a `createZodDto` class; a parameter typed with a plain type or an inline object goes through unchecked, unless the route passes `new ZodValidationPipe(schema)` itself (older routes of `sites.controller.ts`).
- Flag `@Body()`, `@Query()` or `@Param()` typed without a Zod DTO. Existing case: `sendAuthLink` in [auth.controller.ts](../../../apps/api/src/auth/adapters/auth.controller.ts) (`@Body() body: { email: string; … }`).
- Request schemas live in `packages/shared/src/api-dtos/`.

## 4. Rate limiting (API)

A global `ThrottlerGuard` allows 5 requests per second per IP, off when `NODE_ENV` is `test` ([app.module.ts](../../../apps/api/src/app.module.ts)). Tighter limits use `@Throttle`: 5 per minute on `send-auth-link` and `login/token`, 10 per minute on `stats/average-impacts/search`. Flag a new route that sends an email, calls an external API or runs a heavy computation without its own `@Throttle`.

## 5. Cookies, CSRF and redirects

- The `access_token` cookie (`getAuthCookieOptions` in `auth.controller.ts`) is `httpOnly` and `secure` in production, with no `sameSite`: the browser default applies (`Lax` in Chromium, not guaranteed elsewhere).
- The `express-session` cookie ([httpServer.ts](../../../apps/api/src/httpServer.ts)) holds the ProConnect `state`/`nonce` and the post-login redirect. It is `httpOnly`, `secure` in production and `sameSite: "none"`: sent on cross-site requests, so weak against CSRF. Treat a change that relaxes either cookie as a finding.
- There is no CSRF token. The web app calls the API same-origin through nginx's `/api` proxy, and the API never calls `enableCors`: flag a CORS opening or a state-changing `GET` behind the auth cookie.
- Open redirect: `GET /auth/login/pro-connect?redirectTo=…` stores `redirectTo` in the session and the ProConnect callback redirects to it unchecked; `send-auth-link` copies `postLoginRedirectTo` into the emailed link ([sendAuthLink.usecase.ts](../../../apps/api/src/auth/core/sendAuthLink.usecase.ts)). Flag any redirect target taken from the request that isn't checked against `WEBAPP_URL`.
- User enumeration: `send-auth-link` answers 404 `UserDoesNotExist` for an unknown email. Flag auth responses that differ by account existence.

## 6. SQL (Knex)

- SQL lives in `Sql*Query.ts` and `Sql*Repository.ts` files under `apps/api/src/*/adapters/secondary/`, plus migrations and scripts under `apps/api/src/shared-kernel/adapters/sql-knex/`. Pass values as `?` bindings. A static template literal inside `.raw()` is fine (the `jsonb_agg` columns of [SqlSitesQuery.ts](../../../apps/api/src/sites/adapters/secondary/site-query/SqlSitesQuery.ts)); an interpolated `${…}` is a finding.
- A write over several tables runs in one transaction ([api-persistence.md](../../rules/api/api-persistence.md)).

## 7. Outbound calls

Hosts come from constants or env vars, never from the request. Flag an outbound URL whose host or path is built from user input.

| Service | Code | Watch |
|---|---|---|
| PVGIS (`re.jrc.ec.europa.eu`) | [PhotovoltaicGeoInfoSystemApi.ts](../../../apps/api/src/photovoltaic-performance/adapters/secondary/photovoltaic-data-provider/PhotovoltaicGeoInfoSystemApi.ts) | `lat`, `long`, `peakPower` interpolated into the URL: must stay numbers validated by the controller DTO |
| ProConnect (OpenID) | [HttpProConnectClient.ts](../../../apps/api/src/auth/adapters/pro-connect/HttpProConnectClient.ts) | client id, secret and provider domain from env ([auth.module.ts](../../../apps/api/src/auth/adapters/auth.module.ts)) |
| Connect CRM | [ConnectCrm.ts](../../../apps/api/src/marketing/adapters/secondary/ConnectCrm.ts) | `client_id` / `client_secret` headers, base URL from `CONNECT_CRM_BASE_URL` |
| SMTP | [SmtpAuthLinkMailer.ts](../../../apps/api/src/auth/adapters/auth-link-mailer/SmtpAuthLinkMailer.ts) | the auth link carries a login token: never log it |

## 8. Web

- Security headers come from nginx, not the API (no helmet): [nginx.conf.erb](../../../apps/web/scalingo/nginx.conf.erb) sets the CSP, `X-Frame-Options: DENY` and `nosniff` on `/`. `/embed/` gets none of them (it is meant to be framed). A new third-party script, iframe or fetch origin needs its CSP directive there; flag a bare `*` source or `'unsafe-eval'` (`'wasm-unsafe-eval'` is already there on purpose).
- `apps/web/src` has no `dangerouslySetInnerHTML` and no HTML sanitizer installed: any new use is a finding.
- The token lives only in the `httpOnly` cookie. `localStorage` holds app settings (`LocalStorageAppSettings.ts`) and the feature alerts the user signed up for (`CreateFeatureAlertService.ts`); `LocalStorageCurrentUserService.ts` stores the user object but isn't wired in `appDependencies.ts`. Flag a token or personal data put in Redux state or browser storage.

## Pattern scan

Run with Grep over the scope, then read each hit before reporting it. `\|` in a pattern is the table's escaped `|`: it means alternation.

| Pattern | Finds | Where |
|---|---|---|
| `\.raw\(\|Raw\(`, then look for `${` in the SQL string | SQL injection (section 6) | `apps/api/src/**/Sql*.ts`, `apps/api/src/shared-kernel/adapters/sql-knex/scripts/` |
| `dangerouslySetInnerHTML`, `innerHTML =` | XSS | `apps/web/src/**/*.tsx` |
| `eval\(`, `new Function\(`, `child_process` | code / command injection | `apps/**/src/**/*.ts` |
| `@(Body\|Query\|Param)\(\)` | parameter possibly not validated (section 3) | `*.controller.ts` |
| `@(Get\|Post\|Put\|Patch\|Delete)\(` without `@UseGuards` above | missing auth (section 2) | `*.controller.ts` |
| `redirect\(`, `redirectTo` | open redirect (section 5) | `apps/api/src/auth/` |
| `logger\.\|console\.` near `token\|secret\|password\|authLink` | data exposure | `apps/api/src/**` |
| `sameSite`, `cookie\(`, `enableCors` | cookie / CORS change (section 5) | `apps/api/src/**` |
