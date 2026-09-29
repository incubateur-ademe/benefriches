# Lifecycle emails

> **Purpose**: Explain the `apps/api/src/notifications/` bounded context — the
> `LifecycleEmailSender` choke point, the delivery ledger and its dedup semantics, the
> `LIFECYCLE_EMAILS_ENABLED` kill switch, the per-user unsubscribe flag, the event-driven
> trigger pattern, and the shared email template layout. Read this before adding a new
> lifecycle email type (reminders, impacts summary), changing the unsubscribe flow, or
> touching anything under `notifications/`.
>
> Decisions: [ADR-0016](adr/0016-route-all-lifecycle-emails-through-a-single-sender-with-an-idempotent-delivery-ledger.md)
> (single sender, delivery ledger) and [ADR-0017](adr/0017-opt-out-lifecycle-emails-with-a-stateless-hmac-unsubscribe-token.md)
> (opt-out, stateless HMAC unsubscribe token).

## Overview

Lifecycle emails are automated, transactional-ish emails triggered by user/product
lifecycle milestones — as opposed to the login-link emails handled by `auth/`
(`SmtpAuthLinkMailer`) or the CRM-facing side effects in `marketing/`. Three email types
exist today (`lifecycleEmailTypeSchema`):

- `welcome`: the **welcome email**, sent inline once when a user account is created
  (event-driven, see [Event-driven trigger pattern](#event-driven-trigger-pattern));
- `first-site-reminder`: the **first site reminder**, sent by the
  [daily reminder job](#daily-reminder-job) to people who registered 24–72 h earlier and
  still have no site;
- `first-project-reminder`: the **first project reminder**, sent by the same daily job
  **once per site**: for each custom or express, active site created 24–72 h earlier that
  still has no reconversion project. It names the site in its subject. The first
  entity-scoped type (`related_entity_id` = the site id).

The module follows the standard Clean/Hexagonal layout:

```
notifications/
├── core/
│   ├── models/lifecycleEmail.ts              # LifecycleEmailType, delivery status, LifecycleEmailDelivery, LIFECYCLE_EMAIL_MAX_ATTEMPTS
│   ├── models/reminderWindow.ts              # the 24–72 h reminder window, computed from the injected clock
│   ├── models/lifecycleEmailContact.ts       # the named contact of the reminders (read from configuration)
│   ├── gateways/                             # Mailer, LifecycleEmailDeliveryRepository/Query, LifecycleEmailRecipientQuery,
│   │                                         # LifecycleEmailCohortQuery, LifecycleEmailSiteQuery (site of a retried reminder),
│   │                                         # LifecycleEmailSubscriptionRepository, UnsubscribeTokenService
│   ├── services/lifecycleEmailSender.ts       # LifecycleEmailSender — the mandatory choke point
│   ├── previews/lifecycleEmailPreviewSamples.ts  # sample user, contact and sites for the preview script
│   ├── templates/                            # emailLayout.ts (shared layout), welcomeEmail.ts, firstSiteReminderEmail.ts,
│   │                                         # firstProjectReminderEmail.ts, reminderGreeting.ts (NBSP + greeting),
│   │                                         # contactSections.ts (contact button + signature), unsubscribeUrl.ts
│   └── usecases/                             # sendWelcomeEmail, sendFirstSiteReminders, sendFirstProjectReminders,
│                                             # sendLifecycleEmailPreview, unsubscribeFromLifecycleEmails,
│                                             # retryLifecycleEmailDeliveries (the retry sweeper)
└── adapters/
    ├── primary/
    │   ├── notifications.module.ts
    │   ├── notifications.controller.ts        # POST /api/lifecycle-emails/unsubscribe (public)
    │   ├── sendWelcomeEmailOnUserAccountCreated.handler.ts
    │   ├── readLifecycleEmailContact.ts              # LIFECYCLE_EMAILS_CONTACT_* → LifecycleEmailContact | undefined
    │   ├── sendLifecycleEmailPreview.script.ts       # manual preview script
    │   ├── sendDailyLifecycleReminders.script.ts     # daily reminder job (cron)
    │   └── retryLifecycleEmailDeliveries.script.ts   # hourly retry sweeper (cron)
    └── secondary/
        ├── lifecycle-email-cohort/            # SqlLifecycleEmailCohortQuery (eligibility, in SQL) + InMemory stub
        ├── lifecycle-email-delivery/          # Sql/InMemory Repository (write) + Query (read)
        ├── lifecycle-email-recipient/         # Sql/InMemory LifecycleEmailRecipientQuery
        ├── lifecycle-email-site/              # Sql/InMemory LifecycleEmailSiteQuery (id, name, nature)
        ├── lifecycle-email-subscription/      # Sql/InMemory LifecycleEmailSubscriptionRepository (sets the opt-out)
        ├── unsubscribe-token/                 # HmacUnsubscribeTokenService
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
relatedEntityId)`, in **any** status (`pending`/`sent`/`failed`/`abandoned`). A `"failed"` row is
  deliberately treated as "already handled" here, not retried inline — see
  [Failure handling and retries](#failure-handling-and-retries).

`LifecycleEmailSender.retry(delivery, render)` is the retry sweeper's path through the same
choke point. It updates the existing ledger row and never inserts one. `render` is a lazy
`(recipient) => Promise<LifecycleEmailMessage>`, called only once the row is claimed, so
skipped rows are never rendered. In order:

1. kill switch off → `"skipped-disabled"` (no read, no write);
2. `delivery.attempts >= LIFECYCLE_EMAIL_MAX_ATTEMPTS` (only a `pending` row stranded by a
   crash during its last allowed attempt) → row marked `abandoned` with
   `"Stranded in pending after the last allowed attempt"` → `"abandoned"`, no send (we
   can't know whether that attempt went out);
3. recipient gone → `"skipped-recipient-not-found"`; recipient unsubscribed →
   `"skipped-unsubscribed"`;
4. optimistic claim (`claimForRetry`) lost to another run → `"skipped-already-claimed"`;
5. render + send; a throw from either → `markFailed` → `"failed"`, or `markAbandoned` →
   `"abandoned"` if that was the last allowed attempt. Never rethrows;
6. otherwise `markSent` → `"sent"`. The previous `error_message` is kept (the row then reads
   "failed with X, then sent").

`send()` writes `attempts = 1` and `last_attempted_at = created_at` on insert.

Its constructor takes the gateway interfaces (`LifecycleEmailDeliveryRepository`,
`LifecycleEmailDeliveryQuery`, `LifecycleEmailRecipientQuery`, `Mailer`), plus
`DateProvider`, `UidGenerator`, and a plain `boolean isEnabled` — the kill switch is
resolved once, in `notifications.module.ts`, from `ConfigService.get("LIFECYCLE_EMAILS_ENABLED") === "true"`,
not re-read per call.

Any new email type (a reminder, an impacts summary) is expected to build its own template
and its own use case, but call through this same `LifecycleEmailSender` — that is what
keeps the opt-out check and the ledger write from being reimplemented (and potentially
forgotten) per email type. The use case also builds the recipient's signed unsubscribe link
and passes it to the template (see [Email templates](#email-templates-emaillayout--per-email-builders)).
Each new type also needs a re-render `case` in the retry sweeper and a preview sample (see
[Failure handling and retries](#failure-handling-and-retries) and [Preview script](#preview-script)).

## The delivery ledger

Table: `lifecycle_email_deliveries` (migration
`20260922124312_create-table-lifecycle-email-deliveries.ts`).

| Column              | Type            | Notes                                                                                                                                                                                    |
| ------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                | uuid, PK        |                                                                                                                                                                                          |
| `user_id`           | uuid            | FK → `users.id`, `ON DELETE CASCADE`                                                                                                                                                     |
| `email_type`        | string          | Backed by `lifecycleEmailTypeSchema` (`"welcome"`, `"first-site-reminder"`, `"first-project-reminder"`)                                                                                  |
| `related_entity_id` | uuid, null      | No `related_entity_type` column — `email_type` alone determines what kind of entity this is: a site (`sites.id`, no FK) for `first-project-reminder`, `NULL` for account-scoped types    |
| `status`            | string          | `"pending" \| "sent" \| "failed" \| "abandoned"`, backed by `lifecycleEmailDeliveryStatusSchema`. `failed` = will be retried; `abandoned` = gave up after `LIFECYCLE_EMAIL_MAX_ATTEMPTS` |
| `created_at`        | timestamp       |                                                                                                                                                                                          |
| `sent_at`           | timestamp, null | set by `markSent`                                                                                                                                                                        |
| `error_message`     | text, null      | set by `markFailed` / `markAbandoned`; kept when a retry then succeeds                                                                                                                   |
| `attempts`          | integer         | default `1`; incremented by each retry claim (migration `20260929114815_add-attempts-and-last-attempted-at-to-lifecycle-email-deliveries-table.ts`)                                      |
| `last_attempted_at` | timestamp       | not null; set on insert and on every retry claim. Staleness of a `pending` row is measured from it (backfilled from `created_at`)                                                        |

The domain model (`core/models/lifecycleEmail.ts`) mirrors this 1:1 as
`LifecycleEmailDelivery`, camelCased.

### Dedup semantics: NULL vs entity-scoped

Every lifecycle email is deduplicated by the triple `(user_id, email_type,
related_entity_id)`. The welcome email and the first site reminder are **account-scoped** —
they have no related entity, so `related_entity_id` is `NULL`. The first project reminder is
the first **entity-scoped** type: every send passes `relatedEntityId: site.id`, so its row
carries `related_entity_id = sites.id` and it fires once per `(user, site)` for life rather
than once per user overall. No sender or migration change was needed for it: `hasDelivery`
and the entity-scoped index below already handled that case.

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

A `"failed"` delivery row is _not_ retried by `LifecycleEmailSender.send()` —
`LifecycleEmailDeliveryQuery.hasDelivery()` matches on any status so that an event replay
never attempts a second insert (and crashes on the unique index). Retries belong to the
**hourly retry sweeper**:

- **Script**: `adapters/primary/retryLifecycleEmailDeliveries.script.ts`, registered in
  `apps/api/scalingo/cron.json` at `15 * * * *` (UTC, off the top of the hour). No flags;
  it boots the app context, runs `RetryLifecycleEmailDeliveriesUseCase`, and logs one
  summary line:

  ```
  Lifecycle email retry summary: candidates=N, sent=N, failed=N, abandoned=N, skippedDisabled=N, skippedUnsubscribed=N, skippedRecipientNotFound=N, skippedAlreadyClaimed=N, errored=N
  ```

  Hourly because each run boots a full app context and
  the volume is ~20 emails a month. The cron container inherits the app's environment, so it
  needs `LIFECYCLE_EMAILS_UNSUBSCRIBE_SECRET` (boot fails without it) and honours
  `LIFECYCLE_EMAILS_ENABLED` (off → every candidate is `skippedDisabled`, nothing written).

- **Candidates** (`LifecycleEmailDeliveryQuery.findRetryCandidates`): every `failed` row,
  plus `pending` rows whose `last_attempted_at` is older than
  `STALE_PENDING_THRESHOLD_MINUTES = 15`. Users who unsubscribed are filtered out in SQL (so
  their rows don't churn every hour; the sender re-checks anyway), and so are email types
  the code no longer knows (so parsing can't kill the run).
- **Stale threshold**: `SmtpMailer`'s timeouts (5s / 5s / 10s) cap an in-flight send at
  ~20s; 15 minutes is far beyond that, so a `pending` row written by a listener that is still
  sending is never picked up, and a stranded one is retried on the next hourly run. It is
  measured from `last_attempted_at`, not `created_at`, so a row another sweeper just claimed
  doesn't look stale.
- **Cap**: `LIFECYCLE_EMAIL_MAX_ATTEMPTS = 5` (1 inline send + 4 hourly retries, ≈ 4 h). The
  failing last attempt writes `abandoned`, a terminal status the sweeper never picks up and
  that `hasDelivery` still counts, so the row stays the single row for that email. No
  back-off beyond the hourly cadence.
- **Concurrency**: the claim is one conditional `UPDATE … SET status = 'pending', attempts =
attempts + 1, last_attempted_at = ? WHERE id = ? AND status = ? AND attempts = ?`. When two
  runs overlap, Postgres makes the second `UPDATE` re-check its `WHERE` after the first
  commits; it updates nothing and reports `skipped-already-claimed`. No lock is held across
  the SMTP call. Accepted residual risk: a crash after the SMTP server accepted the message
  but before `markSent` leaves a stale `pending` that gets retried (possible duplicate).
- **Errors**: candidates are processed sequentially; a thrown error on one row (e.g. a DB
  error) is logged with the delivery id, counted as `errored`, and the run continues.
- **Re-rendering**: the ledger stores no rendered message, so
  `RetryLifecycleEmailDeliveriesUseCase.renderMessage()` rebuilds it from the row and the
  recipient's _current_ address, with an exhaustive `switch (delivery.emailType)` and no
  `default` (like the preview samples). Each case calls the same template builder as the
  type's send use case (`buildWelcomeEmail` for `welcome`, with the unsubscribe link signed
  for `delivery.userId`). The `first-site-reminder` case calls `buildFirstSiteReminderEmail`
  with the recipient's _current_ first and last name (`LifecycleEmailRecipient` carries them)
  and the configured contact; when the contact is not configured it throws
  `Lifecycle email contact is not configured`, which the sender records as a failed attempt
  (a row only exists if the contact was set at first send, so this only happens if someone
  removed it since). A regression test asserts the retried message equals the one
  `SendFirstSiteRemindersUseCase` sends. The `first-project-reminder` case (the reason `renderMessage` is
  now `async`) throws the same error when the contact is missing, then loads the site from
  the row's `related_entity_id` through `LifecycleEmailSiteQuery.getById` (injected into the
  retry use case; `SqlLifecycleEmailSiteQuery` returns `id`, `name` and `nature`, with **no
  status filter**) and calls `buildFirstProjectReminderEmail` with the site's _current_ name and
  nature and the recipient's current names. A site that no longer exists (only possible
  through manual SQL: the app archives sites, never deletes them) throws `Site <id> not
found`: a failed attempt, then `abandoned` at the cap, and no email. The glue is duplicated
  rather than extracted into a `compose…` function: the send path gets the site from the
  cohort row, the retry path from the site query, so only the builder call is shared; a
  regression test asserts the retried message equals the one `SendFirstProjectRemindersUseCase`
  sends. **Adding an email type** fails the typecheck there until you add its
  `case`, plus whatever read gateway it needs injected into the use case; when composition
  needs data loading, extract a `compose…` function shared by the send use case and the
  retry case rather than duplicating it.
- **Known limitation, not fixed**: a retry does not re-check the cohort's eligibility. A
  first site reminder whose first attempt failed is still retried (for up to ~4 h) even if
  the user has created a site since; likewise a first project reminder is still retried
  after the user described a project on that site or archived it. It follows from the generic retry path (ticket 04) and is
  accepted given the short retry span. Fixing it would need a new skip outcome in `retry()`:
  throwing from `render` only records another failed attempt.

## Daily reminder job

`adapters/primary/sendDailyLifecycleReminders.script.ts` computes each reminder cohort and
sends the reminders. It is named after the job, not the email. It runs
`REMINDER_USE_CASES = [SendFirstSiteRemindersUseCase, SendFirstProjectRemindersUseCase]`, in
that order. A user is never in both cohorts on the same run: the first site reminder requires
no site at all, the first project reminder requires one.

### Schedule: `0 8 * * *`, every day at 08:00 UTC

Registered in `apps/api/scalingo/cron.json`. Scalingo's cron runs in **UTC**, so the job
sends at **10:00 in Paris in summer (CEST) and 09:00 in winter (CET)**: the one-hour drift
across daylight saving is accepted for a nudge. `cron.json` is strict JSON with no room for
comments, so this note lives here, in `docs/scripts.md` and in the script's header comment.

- **Every day, not weekdays only.** With a 24–72 h window, weekday-only runs would leave a
  hole: Friday's run covers registrations from Tuesday 08:00 to Thursday 08:00 and Monday's
  from Friday 08:00 to Sunday 08:00, so people who register between Thursday 08:00 and
  Friday 08:00 would never be reminded. Weekdays only would need `REMINDER_MAX_AGE_HOURS =
96` and `0 8 * * 1-5`.
- **Minute `0`, not `15`**: the retry sweeper runs at `:15`, so a reminder that fails at 08:00
  is retried at 08:15.

### The window: 24 to 72 hours after signup (or after the site's creation)

`core/models/reminderWindow.ts`: `computeReminderWindow(now)` returns `{ createdAfter: now −
72 h, createdAtOrBefore: now − 24 h }` (`REMINDER_MIN_AGE_HOURS`, `REMINDER_MAX_AGE_HOURS`).
The use case calls it with the injected `DateProvider`; the SQL takes the window and never
reads a clock. Boundaries: exactly 24 h old is **in**, exactly 72 h old is **out**. The first
site reminder applies it to `users.created_at`, the first project reminder to
`sites.created_at` (never the user's registration).

- 24 h guarantees everyone has had a full day, whatever time they signed up.
- The 48 h width makes the job **self-healing**: a run missed for a deploy or an incident is
  caught up by the next one instead of silently skipping a cohort. The overlapping windows
  never send twice: the eligibility query excludes users who already have a row, and the
  ledger's unique index backs it up.
- The copy says "Hier" although most recipients registered the day before yesterday (users of
  the previous run's window are already excluded). Flagged `TODO(product)` in the template;
  the window must not shrink to match the copy.

### Eligibility (first site reminder)

All in SQL, in `SqlLifecycleEmailCohortQuery.findFirstSiteReminderRecipients(window)`:

```sql
SELECT id, email, firstname, lastname, created_at FROM users
WHERE created_at > :createdAfter AND created_at <= :createdAtOrBefore
  AND lifecycle_emails_unsubscribed_at IS NULL
  AND NOT EXISTS (SELECT 1 FROM sites WHERE sites.created_by = users.id)
  AND NOT EXISTS (SELECT 1 FROM lifecycle_email_deliveries
                  WHERE lifecycle_email_deliveries.user_id = users.id
                    AND lifecycle_email_deliveries.email_type = 'first-site-reminder')
ORDER BY created_at
```

- **Any site suppresses**, whatever its `creation_mode` (`custom`, `express`, `csv-import`)
  and whatever its `status` (`active`, `archived`): someone who bulk-imported sites, or
  created one and archived it, has used the feature. That is the "suppresses" side of the
  asymmetry in DESIGN.md; the first project reminder is stricter about which sites
  **trigger** a reminder (not CSV imports, not archived sites).
- **A ledger row of this type in any status excludes** (`pending`, `sent`, `failed`,
  `abandoned`): `failed` and stale `pending` rows belong to the retry sweeper, `abandoned` is
  terminal on purpose (a nudge days late has lost its value), and a second insert would hit
  the unique index anyway. Rows of other types (e.g. `welcome`) don't count.
- Users excluded in SQL never reach the sender, so they write nothing and are not counted in
  the summary's `skipped…` counters.
- `InMemoryLifecycleEmailCohortQuery` is a **stub** (`_setFirstSiteReminderRecipients`) that
  applies no rule on purpose: an in-memory eligibility would test TypeScript against itself.
  The rules are covered one by one in `SqlLifecycleEmailCohortQuery.integration-spec.ts`.

### Eligibility (first project reminder)

All in SQL, in `SqlLifecycleEmailCohortQuery.findFirstProjectReminderSites(window)`, one row
per site (`FirstProjectReminderSite`: site id, name, nature and creation date, owner id,
email and names):

```sql
SELECT sites.id, sites.name, sites.nature, sites.created_at,
       users.id, users.email, users.firstname, users.lastname
FROM sites JOIN users ON users.id = sites.created_by
WHERE sites.created_at > :createdAfter AND sites.created_at <= :createdAtOrBefore
  AND sites.creation_mode IN ('custom', 'express')
  AND sites.status = 'active'
  AND users.lifecycle_emails_unsubscribed_at IS NULL
  AND NOT EXISTS (SELECT 1 FROM reconversion_projects
                  WHERE reconversion_projects.related_site_id = sites.id)
  AND NOT EXISTS (SELECT 1 FROM lifecycle_email_deliveries
                  WHERE lifecycle_email_deliveries.user_id = users.id
                    AND lifecycle_email_deliveries.email_type = 'first-project-reminder'
                    AND lifecycle_email_deliveries.related_entity_id = sites.id)
ORDER BY sites.created_at, sites.id
```

Triggering is **narrow**, suppression **generous** (the asymmetry in DESIGN.md):

- **Only custom and express sites trigger.** An allowlist, not `<> 'csv-import'`: a CSV
  import of forty sites sends nothing (rather than forty emails), and a future creation mode
  or a `NULL` legacy value does not start sending by default.
- **Only active sites trigger** (`status = 'active'`, so a `NULL` status does not either):
  archiving a site is a signal of disengagement.
- **Any project on the site suppresses**, archived included: no filter on
  `reconversion_projects.status`, on purpose. A project on another site does not.
- **A ledger row of this type for that site, in any status, excludes** (`pending`, `sent`,
  `failed`, `abandoned`, as for the first site reminder). It is matched on the site, not
  only on the user: a reminder for one site does not suppress another site's.
- **Owner unsubscribed** excludes. A site whose `created_by` matches no user (there is no
  FK) is silently skipped by the join: there is no one to email.
- **One row per site, never grouped by user**: two eligible sites mean two emails (six months
  of production data: 90.7 % of user-mornings have a single eligible site). The ledger row
  is per site, so batching could be added later without a schema change.
- `nature` is parsed with `siteNatureSchema`: an unknown value throws, which fails this
  cohort for the run (logged, exit code 1) rather than guessing a wording.
- `InMemoryLifecycleEmailCohortQuery._setFirstProjectReminderSites` is a stub too; the rules
  are covered one by one in the integration spec.

The email (`firstProjectReminderEmail.ts`): subject `<site name> : et si vous renseigniez
votre projet d’aménagement ?` (non-breaking spaces before `:` and `?`, the name
whitespace-collapsed onto one line); the first paragraph says `une friche` / `cette friche`
for a `FRICHE` and `un site` / `ce site` for every other nature; the primary button
`Renseigner mon projet` links to `${WEBAPP_URL}/creer-projet?siteId=<site id>`; then the
contact paragraph and `buildContactSections`. The body does not repeat the site name (as in
the mockup). The mockup's friche-only compatibility offer (paragraph + secondary button) is
**not built** in v1: no page evaluates an existing site yet. The copy to proofread is marked
`TODO(product)`.

### What a run does

`SendFirstSiteRemindersUseCase.execute({ dryRun })`:

1. logs the window: `First site reminders: registered after <ISO> and at or before <ISO>`;
2. **dry run** (`--dry-run`): logs one `[DRY RUN] Eligible for first site reminder: userId=…,
email=…, registeredAt=<ISO>` line per user, the contact warning if the contact is missing,
   the summary, and stops. The sender is never called: no email, no ledger row, whatever the
   kill switch. Run it against production data before turning the switch on;
3. **contact not configured**: logs the warning `Lifecycle email contact is not configured
(LIFECYCLE_EMAILS_CONTACT_*): first site reminders not sent`, counts every eligible user in
   `skippedContactNotConfigured`, and writes nothing, so the next run catches the same users
   once the contact is set;
4. otherwise, sequentially, per user in its own `try/catch`: builds the email
   (`buildFirstSiteReminderEmail` + the signed unsubscribe link) and calls
   `LifecycleEmailSender.send({ userId, emailType: "first-site-reminder", message })`. A throw
   (DB error, a concurrent run's unique violation) is logged as `First site reminder failed
for user <userId>`, counted `errored`, and the run continues;
5. logs one summary line (prefixed `[DRY RUN] ` in a dry run):

   ```
   First site reminder summary: eligible=N, sent=N, failed=N, skippedDisabled=N, skippedUnsubscribed=N, skippedAlreadySent=N, skippedContactNotConfigured=N, errored=N
   ```

- **Kill switch**: not read by the use case. With `LIFECYCLE_EMAILS_ENABLED` off, every
  `send()` returns `skipped-disabled` before any write, so a real run reports
  `skippedDisabled=N` and writes nothing.
- **Idempotency**: a second run the same day finds no one (the first run's rows exclude them);
  two overlapping runs are stopped by the sender's `hasDelivery` check or, at worst, by the
  unique index (counted `errored`, no second email).

`SendFirstProjectRemindersUseCase.execute({ dryRun })` does the same per **site**, with the
same summary shape (`eligible` counts sites):

1. `First project reminders: sites created after <ISO> and at or before <ISO>`;
2. dry run: one `[DRY RUN] Eligible for first project reminder: siteId=…, siteName=…,
siteNature=…, userId=…, email=…, siteCreatedAt=<ISO>` line per site;
3. contact missing: `Lifecycle email contact is not configured (LIFECYCLE_EMAILS_CONTACT_*):
first project reminders not sent`, `skippedContactNotConfigured` = every site, nothing
   written;
4. `LifecycleEmailSender.send({ userId, emailType: "first-project-reminder", relatedEntityId:
site.siteId, message })` per site; a throw logs `First project reminder failed for site
<siteId> (user <userId>)` and counts `errored`;
5. `First project reminder summary: eligible=N, sent=N, failed=N, skippedDisabled=N,
skippedUnsubscribed=N, skippedAlreadySent=N, skippedContactNotConfigured=N, errored=N`.

- **Script**: one `try/catch` per reminder use case, so one cohort failing does not stop the
  next; a failure logs `sendDailyLifecycleReminders: <UseCase> failed` and sets
  `process.exitCode = 1`. Booting the app context needs `LIFECYCLE_EMAILS_UNSUBSCRIBE_SECRET`.

## Contact configuration

The reminders carry a named human contact (name, role, phone, email), with a secondary
button opening a mail composer (`mailto:`) to them. It lives in **configuration, not
template code**, so it changes with the person's role without a deploy:

| Variable                              | Example (fake, `.env.test` / `.env.e2e`) |
| ------------------------------------- | ---------------------------------------- |
| `LIFECYCLE_EMAILS_CONTACT_FIRST_NAME` | `Mathilde`                               |
| `LIFECYCLE_EMAILS_CONTACT_LAST_NAME`  | `Lefèvre`                                |
| `LIFECYCLE_EMAILS_CONTACT_ROLE`       | `Chargée de déploiement`                 |
| `LIFECYCLE_EMAILS_CONTACT_PHONE`      | `01 23 45 67 89`                         |
| `LIFECYCLE_EMAILS_CONTACT_EMAIL`      | `mathilde.lefevre@example.com`           |

- First and last names are separate because the button uses the first name alone
  (`Contacter <prénom> de Bénéfriches`); splitting a full name breaks compound first names.
- `readLifecycleEmailContact(configService)` (`adapters/primary/`) parses them with
  `lifecycleEmailContactSchema`: any missing, empty or invalid value gives `undefined`.
  **It never fails boot** — that would take the whole API down for a nudge email. Instead the
  daily job skips the reminders with a warning, the retry case counts a failed attempt, and
  the preview falls back to `PREVIEW_SAMPLE_CONTACT`.
- On staging with the switch off and no contact, the warning shows up every morning; set the
  variables to silence it.
- `apps/api/.env.example` has them **empty**. Real values (staging, production) are set in
  Scalingo only: never commit a real person's contact details.

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

## Preview script

The team declined a non-production recipient allowlist, so there is no way to safely
enable `LIFECYCLE_EMAILS_ENABLED` on staging or production just to see how an email
renders in a real mail client. `sendLifecycleEmailPreview.script.ts`
(`notifications/adapters/primary/`) is the mitigation: a standalone script that sends one
named lifecycle email type, rendered with sample data, to one or more explicitly given
addresses, on any environment, regardless of the kill switch:

```bash
cd apps/api && node ./dist/src/notifications/adapters/primary/sendLifecycleEmailPreview.script.js --type=welcome --to=prenom.nom@ademe.fr
```

It makes four deliberate bypasses, all load-bearing:

- **Ignores `LIFECYCLE_EMAILS_ENABLED`** — previews must work while the feature is
  disabled everywhere; that is the whole point of the script.
- **Bypasses the unsubscribe check** (`users.lifecycle_emails_unsubscribed_at`) — a
  preview targets whatever address the operator typed, not a recipient the sender has
  opted into or out of.
- **Bypasses the delivery-ledger dedup check** — a preview run must never be blocked by,
  or itself block, a prior send.
- **Writes no `lifecycle_email_deliveries` row** — so a preview can neither poison the
  funnel correlation built on that table, nor make a later genuine send look like a
  duplicate the dedup check would skip, nor be mistaken for real send activity when the
  ledger is inspected.

These bypasses are **structural, not conditional**: `SendLifecycleEmailPreviewUseCase`
(`core/usecases/sendLifecycleEmailPreview.usecase.ts`) depends only on the `Mailer`
gateway, the `UnsubscribeTokenService` (signing only, no I/O) and the configured contact (a
plain value, possibly `undefined`) — it holds no
`LifecycleEmailDeliveryRepository`, no `LifecycleEmailRecipientQuery`, and no `isEnabled`
flag, so there is nothing to check and nothing to write even if the code tried. It deliberately does **not** go through
`LifecycleEmailSender`. Do not route it through that sender, and do not add a "preview
mode" / `skipLedger` flag to `LifecycleEmailSender` to make it dual-purpose — a flag that
turns the compliance checks off there is exactly the failure mode the sender
([ADR-0016](adr/0016-route-all-lifecycle-emails-through-a-single-sender-with-an-idempotent-delivery-ledger.md)) exists to prevent.

Sample data for each email type lives in
`core/previews/lifecycleEmailPreviewSamples.ts`, keyed by an exhaustive `switch` over
`LifecycleEmailType` with no `default` case — so a later ticket adding a new email type
(a reminder, the impacts summary) fails typecheck there until it adds its sample.
`buildLifecycleEmailPreviews` returns **every sample of the type**, and the script sends each
of them to each recipient. `"welcome"` and `"first-site-reminder"` have one sample
(`--type=first-site-reminder`, greeting the sample user `Camille Durand`);
`"first-project-reminder"` has two, since its first paragraph depends on the site's nature:
`PREVIEW_SAMPLE_FRICHE` (`Ancienne carrière d’argile de Blajan`, the mockup's site) and
`PREVIEW_SAMPLE_NON_FRICHE_SITE` (`Exploitation agricole des Quatre Chemins`, an agricultural
site). Their ids match no real site, so the `Renseigner mon projet` link of a preview leads to
an error page (nothing real is touched, like the preview's unsubscribe link). The reminder is signed by the configured contact when
`LIFECYCLE_EMAILS_CONTACT_*` is set (a reviewer on staging sees the real signature), and by the
invented `PREVIEW_SAMPLE_CONTACT` (an `example.com` address) otherwise.

The script has no default recipient and accepts no cohort/filter/"all users" mode —
`--to=` is the only way to name a recipient, and it is required. Every send and its
recipient is logged, so a preview run is auditable from the logs even though it leaves no
database trace.

## Unsubscribe flag

Decision record: [ADR-0017](adr/0017-opt-out-lifecycle-emails-with-a-stateless-hmac-unsubscribe-token.md).

`users.lifecycle_emails_unsubscribed_at` (migration
`20260922124313_add-lifecycle-emails-unsubscribed-at-to-users-table.ts`) is a nullable
timestamp on the `users` table. `NULL` means subscribed (the default for every new user —
see `mapUserToSqlRow` in `SqlUserRepository.ts`); a non-null value is the moment the user
unsubscribed.

`LifecycleEmailRecipientQuery.getById(userId)` (via `SqlLifecycleEmailRecipientQuery`)
reads `id`, `email`, `firstname`, `lastname` (as `firstName` / `lastName`, `null` on legacy
rows) and this column, exposed as `unsubscribedAt: Date | null`. The names let the retry
sweeper rebuild a reminder's greeting.
`LifecycleEmailSender` skips sending (`"skipped-unsubscribed"`) whenever
`recipient?.unsubscribedAt` is truthy — checked _before_ the dedup check, so an unsubscribe
after a failed delivery still blocks any further attempt.

Unsubscribing is **global**: one flag stops every lifecycle email type, current and future,
because the check sits in `LifecycleEmailSender` before any per-type logic. There are no
per-type preferences, and it never touches the account itself or the login-link emails.

### The unsubscribe flow

```
Footer link in every lifecycle email: ${WEBAPP_URL}/emails/desinscription?token=<token>
  → web page (public route, PublicApp layout) POSTs the token on load
    → POST /api/lifecycle-emails/unsubscribe { token }     (no auth guard, throttled 10/min)
      → UnsubscribeFromLifecycleEmailsUseCase
        → UnsubscribeTokenService.verify(token)             (HMAC, no DB)
        → LifecycleEmailSubscriptionRepository.markUnsubscribed(userId, now)
```

- **Responses**: `204` on success; `400 { error: "INVALID_UNSUBSCRIBE_TOKEN", message }` for
  a tampered, malformed or foreign-secret token (nothing is written); `400 { errors }` from
  Zod when `token` is missing. The web page shows a confirmation, an invalid-link error, or
  a technical error with a retry button. The error code is shared through
  `unsubscribeFromLifecycleEmailsErrorCodeSchema` in `packages/shared`.
- **Idempotent**: the update is `… SET lifecycle_emails_unsubscribed_at = ? WHERE id = ? AND
lifecycle_emails_unsubscribed_at IS NULL`, so a second click returns the same `204` and
  keeps the first opt-out date (a repeated click or a scanner re-hit does not move it).
- **Deleted account**: a genuinely signed token for a user that no longer exists returns
  `204` and writes nothing — the page's promise holds, and the signature proves we issued it.
- **No mutating GET**: mail security gateways (Outlook Safe Links, Mimecast…) GET every URL in
  an email. The link therefore points at the SPA, which only acts from JavaScript; the API
  route is `POST` only. If JS-executing scanners ever cause false unsubscribes, switch the
  page to require a button click — no API change needed.
- **Web page**: `apps/web/src/features/lifecycle-emails/` — route
  `lifecycleEmailsUnsubscribe` (`/emails/desinscription`, `token` query param optional so a
  truncated link shows the invalid-link page rather than the 404), registered in the public
  route group and rendered by `PublicApp`, so it works logged in or not. The
  `unsubscribeLinkOpened` thunk calls `LifecycleEmailsGateway.unsubscribe(token)`
  (`HttpLifecycleEmailsService` / `InMemoryLifecycleEmailsService`); a `useRef` guard keeps
  React StrictMode to one request per page load. Page copy is a draft marked
  `TODO(product)`, like the email footer.
- **Analytics**: `pageViewed` replaces the value of a `token` query parameter with `REDACTED`
  before sending the URL to Matomo, so the non-expiring token never lands in a third-party log.

### Token format: signed, stateless, non-expiring

`HmacUnsubscribeTokenService` (`adapters/secondary/unsubscribe-token/`):

```
v1.<userId>.<base64url(HMAC-SHA256(LIFECYCLE_EMAILS_UNSUBSCRIBE_SECRET, "lifecycle-emails-unsubscribe:v1:" + userId))>
```

- **Does not expire, by construction**: no timestamp in the token and no `DateProvider` in
  the service. A "your unsubscribe link has expired" page is not acceptable — people would
  contact support instead. Do not add an expiry.
- **Deterministic per user**: every email to a user carries the same link, so forwarded and
  older emails keep working, with no table, no migration and no cleanup job.
- **Verification** recomputes the signature and compares the base64url strings with
  `timingSafeEqual` (after a length check); the version, the UUID shape of the user id and
  the number of parts are checked first, so a malformed token fails without throwing.
- **`v1.` prefix**: lets a future format coexist with links already sitting in inboxes.
- The user id is visible in the token; the signature is what grants the capability.

This differs on purpose from the magic login link (`SendAuthLinkUseCase`): that token is
random, stored hashed, single-use and expires after 15 minutes — the three properties an
unsubscribe link must not have. Only the shape is reused: a `?token=` link to a public web
page that calls the API.

### Secret: `LIFECYCLE_EMAILS_UNSUBSCRIBE_SECRET`

A dedicated secret, not `AUTH_JWT_SECRET`: rotating the session secret after a compromise
must not silently break every unsubscribe link ever sent. The module factory throws at boot
when it is missing or empty (an empty HMAC key would make tokens forgeable).

- **Rotating it invalidates every unsubscribe link already sent.** That is the only
  revocation mechanism; acceptable because a leaked token only lets someone unsubscribe that
  user from these emails, which an operator can reverse.
- Values: `apps/api/.env.example` (`use-a-robust-secret`), `apps/api/.env.test`,
  `.env.e2e` / `docker-compose.e2e.yml`. Staging and production use a long random value
  (`openssl rand -hex 32`), distinct per environment, set before deploying.

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
RenderedEmail`, where `EmailContent` is `{ subject, preheader?, sections, unsubscribeUrl }`
and a section is one of:

- `{ type: "heading", text }`
- `{ type: "paragraph", html, text }` — callers supply both an HTML fragment and its plain
  text equivalent themselves (the layout doesn't strip HTML for the text path)
- `{ type: "featureBlock", title, body }`
- `{ type: "button", variant?, label, url }` — `variant` is `"primary"` (default, dark cell,
  white text) or `"secondary"` (light grey `#dddddd` cell, dark text; the reminders' contact
  button)
- `{ type: "contactSignature", name, role, organisation, organisationUrl, organisationSuffix,
phone, email }` — five short lines in one cell, **no image** (remote images are blocked by
  default in Outlook and degrade to a broken-image icon); `organisation` links to
  `organisationUrl`, the email is a `mailto:` link, the phone is plain text. Every value is
  escaped. The text path renders the five lines.

`renderEmail()` always returns `{ subject, html, text }` — it is structurally impossible to
produce HTML without a plain-text alternative, since both come out of the same call.

`unsubscribeUrl` is **required**: `renderEmail()` appends the unsubscribe footer (a muted
paragraph with a `vous désinscrire` link in the HTML, a `---`-separated block ending with the
URL in the text), so a template that forgets it does not compile. Each send use case builds
it with `buildUnsubscribeUrl(webappUrl, unsubscribeTokenService.sign(userId))`
(`core/templates/unsubscribeUrl.ts`). The preview script signs it for
`PREVIEW_SAMPLE_USER.id` (`00000000-0000-4000-8000-000000000000`, matches no real user), so a
reviewer clicking it sees the real confirmation page while nothing is written.

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

`buildWelcomeEmail({ recipientEmail, webappUrl, unsubscribeUrl }): RenderedEmail` composes the actual
welcome email content on top of `renderEmail()`: a heading, the user's own email shown as
their login identifier, an intro paragraph, three `featureBlock` sections (impacts
evaluation, cost-benefit analysis, avoided-costs analysis), and a CTA button linking to
`new URL("/creer-site-foncier", webappUrl)`. The CTA URL is always built from the injected
`webappUrl` (wired from the `WEBAPP_URL` config value in `notifications.module.ts`) —
never a hardcoded domain — so the link resolves correctly per environment.

### `firstSiteReminderEmail.ts`

`buildFirstSiteReminderEmail({ firstName, lastName, contact, webappUrl, unsubscribeUrl })`:
subject `Renseignez votre premier site sur Bénéfriches !`, greeting `Bonjour <prénom> <nom>,`
(the non-empty names only; `Bonjour,` when both are missing, escaped in HTML), two
paragraphs, the `Renseigner mon site` button to `new URL("/creer-site-foncier", webappUrl)`,
the contact paragraph, then `buildContactSections(contact, webappUrl)` from
`contactSections.ts`: the secondary `Contacter <prénom> de Bénéfriches` button
(`mailto:<contact email>`, no subject) and the signature (`Bénéfriches` linked to `webappUrl`,
followed by ` (Externe)`). The greeting and the `NBSP` constant live in
`reminderGreeting.ts`, shared with the first project reminder.

The copy follows French typography: a non-breaking space before `!` (subject) and `?`
(second paragraph), and curly apostrophes throughout. Proofreading points awaiting product
("Hier", `pré-remplies`, `accompagné`, `(Externe)`) are marked `TODO(product)` next to the
strings.

### `firstProjectReminderEmail.ts`

`buildFirstProjectReminderEmail({ firstName, lastName, site: { id, name, nature }, contact,
webappUrl, unsubscribeUrl })`: see [Eligibility (first project
reminder)](#eligibility-first-project-reminder) for its content. Same greeting, typography
and contact block as the first site reminder. Its `TODO(product)` points: "Hier", the
non-friche wording (`un site` / `ce site`, ours, not the mockup's), the site name absent from
the body, `pré-remplies`, `accompagné`.

## Testing conventions specific to this module

- `LifecycleEmailSender` is unit-tested (`lifecycleEmailSender.spec.ts`) entirely against
  `InMemory*` gateways and `FakeMailer`, covering every outcome (`sent`, `failed`,
  `skipped-disabled`, `skipped-unsubscribed`, `skipped-already-sent`) plus the
  entity-scoped-vs-account-scoped dedup distinction, and every `retry()` outcome.
- The daily reminder job: `reminderWindow.spec.ts`, `firstSiteReminderEmail.spec.ts` (the full
  plain-text copy is the regression guard), `sendFirstSiteReminders.usecase.spec.ts` (dry run,
  kill switch, missing contact, twice, per-user errors), `readLifecycleEmailContact.spec.ts`,
  `SqlLifecycleEmailCohortQuery.integration-spec.ts` (one test per eligibility rule and
  boundary) and `sendFirstSiteReminders.integration-spec.ts` (against real SQL). Manual QA
  guide: `docs/qa/lifecycle-emails/05.md`.
- The first project reminder: `firstProjectReminderEmail.spec.ts` (full plain text for a
  friche and a non-friche site, one test per non-friche nature, no compatibility offer),
  `sendFirstProjectReminders.usecase.spec.ts` (one email per site, dry run, kill switch,
  missing contact, per-site errors), the `findFirstProjectReminderSites` tests in
  `SqlLifecycleEmailCohortQuery.integration-spec.ts` (one per rule),
  `SqlLifecycleEmailSiteQuery.integration-spec.ts` and
  `sendFirstProjectReminders.integration-spec.ts` (the ticket's scenarios against real SQL).
  Manual QA guide: `docs/qa/lifecycle-emails/06.md`.
- The retry sweeper: `retryLifecycleEmailDeliveries.usecase.spec.ts` (orchestration, summary,
  per-row errors, and the retried welcome, first site reminder and first project reminder
  messages equal the ones their send use cases send; a deleted site fails, then is abandoned), `SqlLifecycleEmailDeliveryQuery.integration-spec.ts` (candidate predicate),
  `SqlLifecycleEmailDeliveryRepository.integration-spec.ts` (claim, abandon) and
  `retryLifecycleEmailDeliveries.integration-spec.ts` (against real SQL). Manual QA guide:
  `docs/qa/lifecycle-emails/04.md`.
- `FakeMailer` (`adapters/secondary/mailer/FakeMailer.ts`) records `sentEmails` and exposes
  `simulateFailure(message)` / `_reset()` for tests that share one instance across multiple
  cases against a single NestJS app (see the integration spec's `before`/`beforeEach`
  pattern, chosen because `SqlConnectionModule`'s Knex pool is a process-wide singleton and
  closing the app between tests would tear it down for sibling tests).
- The partial-unique-index dedup behavior is verified at the SQL level in
  `SqlLifecycleEmailDeliveryRepository.integration-spec.ts` (asserting `assert.rejects` on
  a duplicate insert), not just mimicked in the in-memory adapter.
- The unsubscribe flow is covered by `HmacUnsubscribeTokenService.spec.ts` (sign/verify,
  tampering, swapped user id, foreign secret, malformed tokens, empty secret),
  `unsubscribeFromLifecycleEmails.usecase.spec.ts`,
  `SqlLifecycleEmailSubscriptionRepository.integration-spec.ts` (first date kept, other users
  untouched) and `notifications.controller.integration-spec.ts` (link taken from a real
  welcome email, repeated use, tampered token, missing token, no email after unsubscribing,
  deleted account; no test sends a session cookie). Web: `lifecycleEmailsUnsubscribe.spec.ts`
  and `UnsubscribePage.spec.tsx`. There is no e2e test for it; the manual QA guide is
  `docs/qa/lifecycle-emails/03.md`.
- E2E coverage (`apps/e2e-tests/tests/onboarding/onboarding.spec.ts`) asserts a welcome
  email arrives during signup and contains the user's login identifier.
  `mail-catcher.ts`'s `waitForEmail()` now requires an exact `subject` argument (not just a
  recipient) because a single registration can produce more than one email to the same
  address (welcome + login link) and MailCatcher is never purged between tests; it returns
  the newest matching message by MailCatcher id.

## What's deliberately out of scope here

- No `List-Unsubscribe` / `List-Unsubscribe-Post` (RFC 8058) mail headers yet, no
  re-subscribe from the UI, no per-type preferences, and no domain event on unsubscribe (the
  column is the record).
- No confirmation click on the unsubscribe page (it posts on load), no per-token revocation
  and no overlapping-key secret rotation: rotating `LIFECYCLE_EMAILS_UNSUBSCRIBE_SECRET`
  breaks every link already sent.
- The footer and page wording are drafts (`TODO(product)`), pending product review.
- `lifecycleEmailTypeSchema` has `"welcome"`, `"first-site-reminder"` and
  `"first-project-reminder"`; the impacts summary (08) is planned but not implemented. It
  will take its headline indicators from `"shared"` (ticket 07), in the web app's order:
  compute the impacts (50 years) → crop them with `cropImpactsByEvaluationPeriod` to
  `getDefaultEvaluationPeriodInYears` (30 years for a photovoltaic plant, 50 otherwise) →
  derive with `getKeyImpactIndicatorsList`, `getSummaryHeadlineIndicators` and
  `getBreakEvenHorizon`.
- The first project reminder's friche-only compatibility offer (mockup) is not built in v1:
  no page evaluates compatibility for an existing site yet.
- No e2e test for the reminders: the daily job is not run on the e2e stack (DESIGN.md: one
  e2e assertion for the whole feature, the welcome email).
- The reminder copy is a draft pending product review (`TODO(product)`), and the job runs every
  day rather than on the "working-day rhythm" of DESIGN.md (see [Daily reminder job](#daily-reminder-job)).
