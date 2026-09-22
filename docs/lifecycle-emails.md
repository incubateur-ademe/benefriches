# Lifecycle emails

> **Purpose**: Explain the `apps/api/src/notifications/` bounded context — the
> `LifecycleEmailSender` choke point, the delivery ledger and its dedup semantics, the
> `LIFECYCLE_EMAILS_ENABLED` kill switch, the per-user unsubscribe flag, the event-driven
> trigger pattern, and the shared email template layout. Read this before adding a new
> lifecycle email type (reminders, impacts summary), wiring the unsubscribe endpoint, or
> touching anything under `notifications/`.

## Overview

Lifecycle emails are automated, transactional-ish emails triggered by user/product
lifecycle milestones — as opposed to the login-link emails handled by `auth/`
(`SmtpAuthLinkMailer`) or the CRM-facing side effects in `marketing/`. The first (and
currently only) lifecycle email is the **welcome email**, sent once when a user account is
created.

The module follows the standard Clean/Hexagonal layout:

```
notifications/
├── core/
│   ├── models/lifecycleEmail.ts              # LifecycleEmailType, delivery status, LifecycleEmailDelivery
│   ├── gateways/                             # Mailer, LifecycleEmailDeliveryRepository/Query, LifecycleEmailRecipientQuery
│   ├── services/lifecycleEmailSender.ts       # LifecycleEmailSender — the mandatory choke point
│   ├── templates/                            # emailLayout.ts (shared layout) + welcomeEmail.ts
│   └── usecases/sendWelcomeEmail.usecase.ts
└── adapters/
    ├── primary/
    │   ├── notifications.module.ts
    │   └── sendWelcomeEmailOnUserAccountCreated.handler.ts
    └── secondary/
        ├── lifecycle-email-delivery/          # Sql/InMemory Repository (write) + Query (read)
        ├── lifecycle-email-recipient/         # Sql/InMemory LifecycleEmailRecipientQuery
        └── mailer/                            # SmtpMailer, FakeMailer
```

The trigger chain for the welcome email:

```
POST /api/auth/register
  → UserAccountCreatedEvent published (USER_ACCOUNT_CREATED)
    → SendWelcomeEmailOnUserAccountCreatedHandler (@OnEvent)
      → SendWelcomeEmailUseCase
        → buildWelcomeEmail() (template)
        → LifecycleEmailSender.send()
          → LifecycleEmailRecipientQuery (unsubscribe check)
          → LifecycleEmailDeliveryQuery (dedup check)
          → LifecycleEmailDeliveryRepository (ledger row)
          → Mailer (SMTP send)
```

## LifecycleEmailSender: the mandatory choke point

`LifecycleEmailSender` (`core/services/lifecycleEmailSender.ts`) is the single entry point
every lifecycle email **must** go through — no code path is meant to call a `Mailer`
directly for a lifecycle email. It exists so that four concerns can never be forgotten by
a future email type (reminders, impacts summary, …):

1. the kill switch check,
2. the per-user unsubscribe check,
3. the delivery-ledger dedup check,
4. writing the ledger row and never letting a mailer failure propagate as a thrown error.

`LifecycleEmailSender.send(request)` takes `{ userId, emailType, relatedEntityId?, message }`
and returns one of:

- `"sent"` — the email was sent and the ledger row is `status: "sent"`.
- `"failed"` — the mailer threw; the ledger row is `status: "failed"` with `errorMessage`
  set. This is a return value, not a thrown exception — callers get a typed outcome, not a
  try/catch obligation.
- `"skipped-disabled"` — the kill switch (`LIFECYCLE_EMAILS_ENABLED`) is off. **Checked
  first, before any ledger write**: if the system wrote a "would-be" row while disabled,
  the unique index (see below) would permanently block the email once re-enabled.
- `"skipped-unsubscribed"` — the recipient has `unsubscribedAt` set.
- `"skipped-already-sent"` — a delivery row already exists for `(userId, emailType,
relatedEntityId)`, in **any** status (`pending`/`sent`/`failed`). A `"failed"` row is
  deliberately treated as "already handled" here, not retried inline — see
  [Failure handling and retries](#failure-handling-and-retries).

Its constructor takes the gateway interfaces (`LifecycleEmailDeliveryRepository`,
`LifecycleEmailDeliveryQuery`, `LifecycleEmailRecipientQuery`, `Mailer`), plus
`DateProvider`, `UidGenerator`, and a plain `boolean isEnabled` — the kill switch is
resolved once, in `notifications.module.ts`, from `ConfigService.get("LIFECYCLE_EMAILS_ENABLED") === "true"`,
not re-read per call.

Any new email type (a reminder, an impacts summary) is expected to build its own template
and its own use case, but call through this same `LifecycleEmailSender` — that is what
keeps the opt-out check and the ledger write from being reimplemented (and potentially
forgotten) per email type.

## The delivery ledger

Table: `lifecycle_email_deliveries` (migration
`20260922124312_create-table-lifecycle-email-deliveries.ts`).

| Column              | Type            | Notes                                                                                                                                                                |
| ------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                | uuid, PK        |                                                                                                                                                                      |
| `user_id`           | uuid            | FK → `users.id`, `ON DELETE CASCADE`                                                                                                                                 |
| `email_type`        | string          | Backed by `lifecycleEmailTypeSchema` (currently only `"welcome"`)                                                                                                    |
| `related_entity_id` | uuid, null      | No `related_entity_type` column — `email_type` alone determines what kind of entity this is (a site, a reconversion project, …) once entity-scoped email types exist |
| `status`            | string          | `"pending" \| "sent" \| "failed"`, backed by `lifecycleEmailDeliveryStatusSchema`                                                                                    |
| `created_at`        | timestamp       |                                                                                                                                                                      |
| `sent_at`           | timestamp, null | set by `markSent`                                                                                                                                                    |
| `error_message`     | text, null      | set by `markFailed`                                                                                                                                                  |

The domain model (`core/models/lifecycleEmail.ts`) mirrors this 1:1 as
`LifecycleEmailDelivery`, camelCased.

### Dedup semantics: NULL vs entity-scoped

Every lifecycle email is deduplicated by the triple `(user_id, email_type,
related_entity_id)`. The welcome email is **account-scoped** — it has no related entity,
so `related_entity_id` is `NULL`. A future entity-scoped email (e.g. "first site created"
reminder) would set `related_entity_id` to that site's id, and could fire once per site
per user rather than once per user overall.

Postgres treats `NULL` as **distinct from every other `NULL`** in a unique index, so a
single index over `(user_id, email_type, related_entity_id)` would never deduplicate the
`NULL` case — two account-scoped "welcome" rows for the same user would both be allowed to
insert. The migration therefore creates **two separate partial unique indexes** instead of
one plain unique index:

```sql
CREATE UNIQUE INDEX lifecycle_email_deliveries_user_type_entity_unique
  ON lifecycle_email_deliveries (user_id, email_type, related_entity_id)
  WHERE related_entity_id IS NOT NULL;

CREATE UNIQUE INDEX lifecycle_email_deliveries_user_type_unique
  ON lifecycle_email_deliveries (user_id, email_type)
  WHERE related_entity_id IS NULL;
```

- The first index enforces "at most one delivery per `(user, type, entity)`" for
  entity-scoped emails.
- The second enforces "at most one delivery per `(user, type)`" for account-scoped emails
  (where `related_entity_id IS NULL`), by indexing only `(user_id, email_type)` under that
  partial condition.

`SqlLifecycleEmailDeliveryRepository.save()` relies on these indexes to reject a concurrent
duplicate insert at the database level (see the `.integration-spec.ts` tests: a second
account-scoped save for the same user+type rejects; a second entity-scoped save for a
_different_ entity is allowed).

`SqlLifecycleEmailDeliveryQuery.hasDelivery()` is the application-level read used by
`LifecycleEmailSender` _before_ attempting to insert. It must branch explicitly on
`relatedEntityId === null` and call `.whereNull("related_entity_id")` — `.where("related_entity_id", null)`
compiles to `= NULL` in SQL, which is never true, and would silently break the "already
sent" check for every account-scoped email.

### Failure handling and retries

A `"failed"` delivery row is _not_ retried by `LifecycleEmailSender` itself — a later
sweeper (not yet built) is expected to own retrying `"failed"`/stranded `"pending"` rows.
`LifecycleEmailDeliveryQuery.hasDelivery()` matches on any status specifically so that a
naive retry-on-replay doesn't attempt a second insert and crash on the unique index instead
of going through a dedicated retry path.

## Kill switch: `LIFECYCLE_EMAILS_ENABLED`

`LIFECYCLE_EMAILS_ENABLED` is a master, all-or-nothing switch for every automated
lifecycle email (not per-type). It is read once in `notifications.module.ts`:

```ts
configService.get("LIFECYCLE_EMAILS_ENABLED") === "true";
```

Any value other than the exact string `"true"` (including unset/empty) disables sending.
Defaults across environments:

| File                                  | Value                                   |
| ------------------------------------- | --------------------------------------- |
| `apps/api/.env.example`               | empty (disabled)                        |
| `apps/api/.env.test`                  | `true`                                  |
| `.env.e2e` / `docker-compose.e2e.yml` | `true` (forwarded to the `api` service) |

It is enabled in tests and e2e because the e2e stack already runs `mailcatcher`, and unit
tests use `FakeMailer`, so exercising the real send path costs nothing there. Production
values are set via deployment config, not committed.

When adding a new env var in general, remember the monorepo rule: update
`apps/api/.env.example`, `.env.e2e`, and the relevant service block in
`docker-compose.e2e.yml` together (see root `CLAUDE.md`).

## Unsubscribe flag

`users.lifecycle_emails_unsubscribed_at` (migration
`20260922124313_add-lifecycle-emails-unsubscribed-at-to-users-table.ts`) is a nullable
timestamp on the `users` table. `NULL` means subscribed (the default for every new user —
see `mapUserToSqlRow` in `SqlUsersRepository.ts`); a non-null value is the moment the user
unsubscribed.

`LifecycleEmailRecipientQuery.getById(userId)` (via `SqlLifecycleEmailRecipientQuery`)
reads `id`, `email`, and this column, exposed as `unsubscribedAt: Date | null`.
`LifecycleEmailSender` skips sending (`"skipped-unsubscribed"`) whenever
`recipient?.unsubscribedAt` is truthy — checked _before_ the dedup check, so an unsubscribe
after a failed delivery still blocks any further attempt.

**Not yet wired up in this ticket**: there is no endpoint or link that sets this column —
that is explicitly left to a later ticket (see the comment in `SqlUsersRepository.ts`).
This doc is the natural place for that ticket to record the endpoint once it exists.

## Event-driven trigger pattern

The welcome email is triggered off the existing `USER_ACCOUNT_CREATED` domain event
(`auth/core/events/userAccountCreated.event.ts`), not from inside the registration
use case directly. `SendWelcomeEmailOnUserAccountCreatedHandler`
(`notifications/adapters/primary/sendWelcomeEmailOnUserAccountCreated.handler.ts`) is a
NestJS `@OnEvent(USER_ACCOUNT_CREATED)` listener that calls `SendWelcomeEmailUseCase`.

Two things matter about how this handler behaves at runtime:

- **It runs synchronously inside the HTTP request.** `RealEventPublisher.publish()` calls
  `EventEmitter2.emitAsync()`, which awaits all listeners — so the welcome-email send
  happens _inside_ `POST /api/auth/register` before the response is returned. This is why
  `SmtpMailer` sets short, explicit timeouts (`connectionTimeout: 5000`,
  `greetingTimeout: 5000`, `socketTimeout: 10000`) instead of relying on nodemailer's much
  longer defaults (120s/30s/600s), which would otherwise stall a signup.
- **It never rethrows.** The handler wraps the whole use-case call (not just the mailer
  call) in try/catch and only logs on failure — a failed welcome email, or a failed ledger
  write, must never fail the signup request that triggered it. This is verified by an
  integration test that simulates an SMTP failure and asserts `POST /api/auth/register`
  still returns `201` and the user row still exists.

This is the general pattern later lifecycle-email tickets are expected to follow: define
the domain event that represents the milestone (first site created, first project created,
project impacts computed, …), add a listener in `notifications/adapters/primary/` that
calls a dedicated use case, and never let that listener's failure propagate back into the
event's originating request.

## Email templates: `emailLayout` + per-email builders

`core/templates/emailLayout.ts` is the shared rendering layer every lifecycle email
template is expected to build on. It exports `renderEmail(content: EmailContent):
RenderedEmail`, where `EmailContent` is `{ subject, preheader?, sections }` and a section is
one of:

- `{ type: "heading", text }`
- `{ type: "paragraph", html, text }` — callers supply both an HTML fragment and its plain
  text equivalent themselves (the layout doesn't strip HTML for the text path)
- `{ type: "featureBlock", title, body }`
- `{ type: "button", label, url }`

`renderEmail()` always returns `{ subject, html, text }` — it is structurally impossible to
produce HTML without a plain-text alternative, since both come out of the same call.

Layout constraints, driven by the audience (collectivités and ADEME-adjacent structures,
where Outlook's HTML renderer is the practical constraint):

- Table-based, single-column layout (`<table role="presentation">`), inline styles only.
- No flexbox or grid anywhere in the generated markup (`emailLayout.spec.ts` asserts this
  with regexes against `display:flex`, `display:grid`, `flex-*`).
- No `<img>` tags — every template here is text/table only.
- The CTA button is rendered as a `<table><tr><td bgcolor="...">` wrapping an `<a>`, which
  is the standard Outlook-safe way to get a clickable, styled button (Outlook's Word-based
  rendering engine ignores most CSS on `<a>`/`<button>` directly).

`escapeHtml()` (also exported from `emailLayout.ts`) escapes `& < > " '` and is used
anywhere untrusted or user-provided text (e.g. a user's own email address) is interpolated
into an HTML fragment outside of the section renderers' own escaping — see
`welcomeEmail.ts`, which escapes the recipient's email before embedding it in a
`paragraph` section's `html` field.

### `welcomeEmail.ts`

`buildWelcomeEmail({ recipientEmail, webappUrl }): RenderedEmail` composes the actual
welcome email content on top of `renderEmail()`: a heading, the user's own email shown as
their login identifier, an intro paragraph, three `featureBlock` sections (impacts
evaluation, cost-benefit analysis, avoided-costs analysis), and a CTA button linking to
`new URL("/creer-site-foncier", webappUrl)`. The CTA URL is always built from the injected
`webappUrl` (wired from the `WEBAPP_URL` config value in `notifications.module.ts`) —
never a hardcoded domain — so the link resolves correctly per environment.

## Testing conventions specific to this module

- `LifecycleEmailSender` is unit-tested (`lifecycleEmailSender.spec.ts`) entirely against
  `InMemory*` gateways and `FakeMailer`, covering every outcome (`sent`, `failed`,
  `skipped-disabled`, `skipped-unsubscribed`, `skipped-already-sent`) plus the
  entity-scoped-vs-account-scoped dedup distinction.
- `FakeMailer` (`adapters/secondary/mailer/FakeMailer.ts`) records `sentEmails` and exposes
  `simulateFailure(message)` / `_reset()` for tests that share one instance across multiple
  cases against a single NestJS app (see the integration spec's `before`/`beforeEach`
  pattern, chosen because `SqlConnectionModule`'s Knex pool is a process-wide singleton and
  closing the app between tests would tear it down for sibling tests).
- The partial-unique-index dedup behavior is verified at the SQL level in
  `SqlLifecycleEmailDeliveryRepository.integration-spec.ts` (asserting `assert.rejects` on
  a duplicate insert), not just mimicked in the in-memory adapter.
- E2E coverage (`apps/e2e-tests/tests/onboarding/onboarding.spec.ts`) asserts a welcome
  email arrives during signup and contains the user's login identifier.
  `mail-catcher.ts`'s `waitForEmail()` now requires an exact `subject` argument (not just a
  recipient) because a single registration can produce more than one email to the same
  address (welcome + login link) and MailCatcher is never purged between tests; it returns
  the newest matching message by MailCatcher id.

## What's deliberately out of scope here

- No unsubscribe endpoint yet — only the `users.lifecycle_emails_unsubscribed_at` column
  and the read side (`LifecycleEmailRecipientQuery`) exist.
- No retry sweeper for `"failed"`/stranded `"pending"` rows.
- `lifecycleEmailTypeSchema` currently only has `"welcome"`; reminder and impacts-summary
  email types are planned but not implemented.
- `related_entity_id` exists in the schema for future entity-scoped email types but is
  always `NULL` today (the welcome email is account-scoped).
