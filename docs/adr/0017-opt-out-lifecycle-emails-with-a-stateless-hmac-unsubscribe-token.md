# [ADR-0017] Opt out of lifecycle emails with a stateless HMAC unsubscribe token

- **Date**: 2026-09-29
- **Status**: Accepted

## Context

ADR-0016 routes every lifecycle email through `LifecycleEmailSender`, which skips any recipient whose `users.lifecycle_emails_unsubscribed_at` is set. Users now need a way to set that flag from the email itself, and some of the decisions involved are hard to reverse.

- **Consent model.** The existing personal-data communication-consent flag can't gate these emails: the registration form hardcodes it to true for every user, so checking it would look like a consent check without being one. The newsletter flag is a real user choice, but about something else: declining a newsletter is not a request to stop onboarding help about your own sites and projects.
- **Link lifetime.** The link must work without a session, for as long as the email sits in an inbox, and after being forwarded. A "your unsubscribe link has expired" page is not acceptable: people would contact support instead. Once sent, the token format is effectively a public contract.
- **Link scanners.** Many recipients (local authorities) sit behind mail security gateways (Outlook Safe Links, Mimecast…) that fetch every URL in an incoming email. If fetching the link unsubscribed the user, people would be unsubscribed as soon as the email was delivered.
- **Future templates.** Every future lifecycle email must carry the link, not only today's.

## Decision

- **Opt-out service emails, one global flag.** Lifecycle emails are service emails about the user's own account and data, not opt-in marketing. The nullable timestamp `users.lifecycle_emails_unsubscribed_at` is a global opt-out for every lifecycle email type, current and future. There are no per-type preferences, and the flag never affects the account or login-link emails. The communication-consent and newsletter flags are not read.
- **Stateless, deterministic, non-expiring HMAC token.** The token is `v1.<userId>.<base64url(HMAC-SHA256(secret, "lifecycle-emails-unsubscribe:v1:" + userId))>` (`HmacUnsubscribeTokenService`). It contains no timestamp, and the service has no clock, so the token cannot expire. The same user always gets the same token, and nothing is stored. Verification checks the shape, recomputes the signature and compares with `timingSafeEqual`. The `v1.` prefix is a format commitment: a future format must coexist with `v1` links already sent, not replace them.
- **A dedicated secret: `LIFECYCLE_EMAILS_UNSUBSCRIBE_SECRET`,** not `AUTH_JWT_SECRET`, so rotating the session secret after a compromise doesn't break every unsubscribe link. The module factory throws at boot if it is missing or empty, because an empty HMAC key would make every token forgeable. Rotating it is the only way to revoke tokens, and it invalidates every link already sent.
- **No mutating GET.** The footer link opens the public web page `${WEBAPP_URL}/emails/desinscription?token=…`. The page's JavaScript POSTs the token to `POST /api/lifecycle-emails/unsubscribe`, which has no auth guard, is throttled (10/min) and is idempotent: it keeps the first unsubscribe date, and a valid token for a deleted user returns `204` without writing anything. Scanners that only fetch URLs never trigger the POST. The web app also redacts the `token` query parameter before page views are sent to Matomo.
- **The footer is enforced by the type checker.** `EmailContent.unsubscribeUrl` is a required field, and the shared `renderEmail` layout renders the footer in both the HTML and plain-text versions. A template without an unsubscribe link does not compile.

## Options Considered

### Stateless HMAC token over the user id, dedicated secret (chosen)

- **Pros**: No table, migration or cleanup job. Links in old and forwarded emails keep working. A structural expiry can't be added by accident. About 20 lines on `node:crypto`, with no JWT algorithm-confusion surface. Domain separation from the session secret.
- **Cons**: No per-token revocation: rotating the secret breaks every link ever sent. The user id is visible in the URL (a UUID, not personal data on its own; the signature grants the capability). The `v1` format has to be supported for as long as old emails exist.

### Reuse the magic-login-link token (random, stored hashed, single-use, 15-minute expiry)

- **Pros**: Existing, reviewed mechanism with a working public route → thunk → API flow.
- **Cons**: A login link needs expiry, single use and per-email storage, and an unsubscribe link must have none of them. Making it non-expiring and reusable would still require storing a token per email sent, with none of the benefits. Rejected. Only the shape (a `?token=` link to a public web page that calls the API) is reused.

### JWT with a long expiry via `@nestjs/jwt`

- **Pros**: Standard format; the library is already used.
- **Cons**: A long expiry is still an expiry, so some links eventually fail. `JwtModule` is registered in `AuthModule` with `AUTH_JWT_SECRET` and a default `expiresIn: 7d`, so reusing it couples unsubscribe links to the session secret or requires per-call overrides. It brings algorithm-confusion concerns for no gain over a plain HMAC.

### Stored random token per user

- **Pros**: Revocable per user; the user id doesn't appear in the URL.
- **Cons**: Adds a table and a lookup on every send and every unsubscribe, for a token that must never expire and stay reusable anyway. Revoking a single token is worth little when a leaked token only allows unsubscribing that one user, which an operator can undo.

### Mutating GET on the API, or require a confirmation click on the page

- **Pros**: A GET gives one-click unsubscribe with no web page. A confirmation button would also stop scanners that execute JavaScript.
- **Cons**: A mutating GET would unsubscribe recipients behind link scanners as soon as the email is delivered. A confirmation click adds a step to every legitimate unsubscribe. Not chosen for now: if false unsubscribes ever show up, the page can switch to a button without any API change.

## Consequences

### Positive

- Every future lifecycle email gets the unsubscribe footer and the opt-out check automatically: the type checker enforces the footer and `LifecycleEmailSender` enforces the flag.
- Unsubscribe links never expire, and forwarded or old emails keep working, without any storage.
- Unsubscribing works whether or not the user is logged in, and repeated clicks or scanner re-hits don't change the recorded opt-out date.
- The token is kept out of third-party analytics logs. The same redaction now also covers the magic-link token.

### Negative

- **Revocation is all-or-nothing.** Rotating `LIFECYCLE_EMAILS_UNSUBSCRIBE_SECRET` breaks every unsubscribe link already sent. The secret must be set in every environment before deploying, or the API won't boot.
- **Residual scanner risk.** A mail scanner that executes JavaScript can still unsubscribe a user without their action. The fallback is a confirmation click on the page.
- **Long-lived format contract.** Any change to the token format has to keep accepting `v1` tokens for as long as old emails exist.
- **Consent is not captured.** Opt-out relies on lifecycle emails being service emails. The hardcoded communication-consent flag at registration is a separate, pre-existing issue that remains unfixed.

## Links

- Related ADRs: [ADR-0016](0016-route-all-lifecycle-emails-through-a-single-sender-with-an-idempotent-delivery-ledger.md), [ADR-0001](0001-clean-hexagonal-architecture.md)
- docs/lifecycle-emails.md (sections "Business rules, and why" and "What must not break")
- apps/api/src/notifications/adapters/secondary/unsubscribe-token/HmacUnsubscribeTokenService.ts
- apps/api/src/notifications/adapters/primary/notifications.controller.ts
- apps/api/src/notifications/core/templates/emailLayout.ts
- apps/web/src/features/lifecycle-emails/
