# Lifecycle emails

> **Purpose**: What the lifecycle emails do for users, the business rules behind them, where the
> code lives and what must not break. Read this before touching `apps/api/src/notifications/`,
> adding an email type, or changing what triggers one.
>
> Decisions: [ADR-0016](adr/0016-route-all-lifecycle-emails-through-a-single-sender-with-an-idempotent-delivery-ledger.md)
> (single sender, delivery ledger) and [ADR-0017](adr/0017-opt-out-lifecycle-emails-with-a-stateless-hmac-unsubscribe-token.md)
> (opt-out, stateless unsubscribe token). Product spec: the `DESIGN` document of the
> `lifecycle-emails` Linear project.

## Why these emails exist

Users sign up and then go quiet: the product's value (the impacts of a reconversion project)
only lands once they have described a site, then a project on it. Lifecycle emails walk them
through that funnel and, once they get there, bring the results to their inbox.

| Email type (`lifecycleEmailTypeSchema`) | Sent when                                                         | Purpose                                                     |
| --------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------- |
| `welcome`                               | right after registration (`USER_ACCOUNT_CREATED`)                 | confirm the login identifier, explain what the app produces |
| `first-site-reminder`                   | daily job, 24–72 h after registration, if the user has no site    | nudge into site creation, offer a named human contact       |
| `first-project-reminder`                | daily job, 24–72 h after a site's creation, if it has no project  | nudge into describing a project on **that** site            |
| `project-impacts-summary`               | right after a project is created (`RECONVERSION_PROJECT_CREATED`) | the three Synthèse headlines, each linking to its analysis  |

These are **service emails** about the user's own account, so the model is opt-out: every email
carries an unsubscribe link, and unsubscribing stops all of them, including types added later.

Volume is tiny (about 20 reminders a month): the feature is shipped on conviction, not measured.
The delivery ledger gives a directional read (did nudged users create a site within 48 h?), not
proof.

## Business rules, and why

**Reminders: when.** The window is 24 to 72 h, not "yesterday": 24 h gives everyone a full day,
and the 48 h width makes the daily job self-healing (a missed run is caught up the next morning;
the ledger prevents a second send). The job runs every day at 08:00 UTC (09:00 or 10:00 in Paris);
weekday-only runs would leave a gap in the window. Because of the window, reminder copy says
« récemment », never « hier ».

**Reminders: who.** Generous about reasons not to email, conservative about reasons to email:

|                   | Suppresses a reminder | Triggers a first project reminder                      |
| ----------------- | --------------------- | ------------------------------------------------------ |
| Custom site       | yes                   | yes                                                    |
| Express site      | yes                   | yes                                                    |
| CSV-imported site | yes                   | **no**: a bulk import must not send one email per site |
| Archived site     | yes                   | **no**: archiving signals disengagement                |
| Archived project  | yes                   | n/a                                                    |

The first project reminder is one email **per site**, not batched per user (production data:
90 % of mornings involve a single site). The ledger is per site, so batching can come later
without a schema change. It names the site in its subject and its first paragraph, so two
reminders about two sites can be told apart.

**Impacts summary: which projects.** Custom (wizard) and express (template) projects get it.
**Duplicated projects deliberately don't**: the author already has the original's summary. This
falls out of duplicates publishing a different event; it is a product decision, so don't "fix"
it by listening to the duplicated event. CSV-imported projects publish nothing and get nothing.

**Impacts summary: content.** The cards must say what the app's Synthèse says. The derivation
(which indicators, success or failure, break-even horizon) comes from `shared`, applied in the
web's order: compute impacts → crop to the default evaluation period (30 years for photovoltaic,
50 otherwise) → derive headlines. The card wording and number formats are **reproduced** in the
API from the web components, and pinned by tests whose expected strings are the web's outputs:
when the Synthèse wording or formatting changes, update the email too. The evaluation date is the
project's stored creation date, in Paris time, so a retry renders the same date.

**Unsubscribe.** Global (no per-type preferences), works without a session, and the link
**never expires**: a "your link has expired" page would send people to support. The token is
a deterministic HMAC of the user id, so there is nothing to store; rotating its dedicated secret
is the only way to revoke links, and it revokes all of them.

**Operations.** `LIFECYCLE_EMAILS_ENABLED` is an all-or-nothing kill switch, off unless set to
exactly `"true"`, and enabled in production only. There is no non-production recipient
allowlist, so production is the first real run: validate cohorts with `--dry-run` before turning
the switch on, and use the preview script to see real renderings.

**Look.** Recipients are collectivités and ADEME-adjacent structures, so Outlook-heavy:
table-based single-column layout, inline styles, no flexbox or grid, and a plain-text part for
every email. No images except the welcome email's decorative feature icons (remote images are
blocked by default in Outlook). Links are always built from `WEBAPP_URL`, so staging emails never
link into production. Every email sets a preheader (`EmailContent` requires it): without one,
inboxes preview the first body line instead. French copy awaiting product review is marked
`TODO(product)` in the templates.

## Where to look

All under `apps/api/src/notifications/` unless stated.

| What                                           | Where                                                                                        |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------- |
| The single send path                           | `core/services/lifecycleEmailSender.ts`                                                      |
| One use case per email type                    | `core/usecases/send*.usecase.ts`                                                             |
| Event listeners (welcome, summary)             | `adapters/primary/*.handler.ts`                                                              |
| Reminder eligibility (the risky logic)         | `adapters/secondary/lifecycle-email-cohort/SqlLifecycleEmailCohortQuery.ts`                  |
| Reminder window                                | `core/models/reminderWindow.ts`                                                              |
| Impacts summary derivation                     | `core/services/projectImpactsSummaryContent.ts`                                              |
| Templates, shared layout, card copy            | `core/templates/` (`emailLayout.ts` first)                                                   |
| Scheduled jobs (daily reminders, hourly retry) | `adapters/primary/*.script.ts`, `apps/api/scalingo/cron.json`, [scripts.md](scripts.md)      |
| Preview script and its samples                 | `adapters/primary/sendLifecycleEmailPreview.script.ts`, `core/previews/`                     |
| Named contact of the reminders                 | `LIFECYCLE_EMAILS_CONTACT_*` env vars, `adapters/primary/readLifecycleEmailContact.ts`       |
| Unsubscribe: API, token                        | `adapters/primary/notifications.controller.ts`, `adapters/secondary/unsubscribe-token/`      |
| Unsubscribe: web page                          | `apps/web/src/features/lifecycle-emails/`                                                    |
| Ledger and unsubscribe columns                 | migrations `*lifecycle-email*` in `apps/api/src/shared-kernel/adapters/sql-knex/migrations/` |

## What must not break

- **Every lifecycle email goes through `LifecycleEmailSender`.** It runs, in order, the kill
  switch, the unsubscribe check, the dedup check and the ledger write; forgetting the
  unsubscribe check is a compliance failure. It never throws on a mailer failure: it records
  `failed` and the hourly sweeper retries (up to 5 attempts, then `abandoned`). Pass a lazy
  `render` when rendering is expensive or can fail (the impacts summary), so skipped cases
  compute nothing and a render failure is retried.
- **The kill switch is checked before any ledger write.** A row written while disabled would
  block that email forever once re-enabled.
- **Dedup is the triple `(user, type, related entity)`**, enforced by two partial unique indexes
  because Postgres treats NULLs as distinct (account-scoped types have no related entity). In
  Knex, query the NULL case with `whereNull`, never `where(col, null)`. A ledger row in any
  status means "already handled".
- **Listeners never rethrow.** The event publisher awaits its listeners, so they run inside the
  registration or project-creation request: a failed email must never fail that request. This is
  also why `SmtpMailer` has short timeouts. The impacts summary computes the impacts inline,
  including an OFGL HTTP call; if creation gets slow, the planned escape hatch is to write a
  `pending` row with zero attempts and let the sweeper send it.
- **Eligibility lives in SQL and is tested against a real database**, one integration test per
  rule. The in-memory cohort query is a stub on purpose: reimplementing the rules in TypeScript
  would test them against themselves.
- **The preview script bypasses everything on purpose** (kill switch, unsubscribe, dedup, ledger),
  structurally: it doesn't depend on the sender. Don't route it through the sender, and don't add
  a "skip checks" flag to the sender.
- **Never rename, move or overwrite a published email image** (`apps/web/public/img/emails/`):
  emails in inboxes point at it, and a missing file returns the SPA's HTML with a 200. Add a new
  file instead.
- **Never add an expiry to the unsubscribe token**, and keep accepting `v1` tokens as long as old
  emails exist.
- **Reading mail in e2e needs an exact subject**: a registration sends several emails to the same
  address and MailCatcher is never purged. Only the welcome email has an e2e assertion, on
  purpose.

## Adding an email type

1. Add the value to `lifecycleEmailTypeSchema`.
2. Write its template on top of `renderEmail()`, with its own preheader, and its own use case
   calling the sender, with `relatedEntityId` if it is about a site or project. No generic registry
   until the anticipated D+3/D+7 emails define one.
3. Add its case to the retry sweeper's re-render and a sample to the preview samples: both are
   exhaustive switches, so the typecheck fails until you do. If rendering loads data, share one
   `compose…` function between the send path and the retry path.
4. Event-driven: listen to an existing domain event when one fits, in a listener that catches
   everything. Scheduled: add a use case to the daily job, with eligibility in SQL and a
   `--dry-run` path.

## Known limits

- A retry does not re-check eligibility: a reminder whose first attempt failed can still go out
  (within about 4 h) after the user has acted.
- On the e2e stack, project creation calls the real OFGL API: `ReconversionProjectsModule`
  declares its own `OFGLApi` provider, shadowing the mock (pre-existing, follow-up in DESIGN).
- Project creation takes the author from the request body without checking it against the
  session (pre-existing, follow-up in DESIGN); the impacts summary goes to that author.
