# [ADR-0016] Route all lifecycle emails through a single sender with an idempotent delivery ledger

- **Date**: 2026-09-22
- **Status**: Accepted

## Context

Bénéfriches is adding its first automated "lifecycle" transactional emails, triggered by domain events rather than direct user action: welcome now, with first-site/first-project reminders and a project impacts summary explicitly planned as later tickets in the same family. Unlike the existing SmtpAuthLinkMailer (sent on demand for login, naturally non-repeating), these emails are fired from domain event handlers, which can replay (e.g. the same USER_ACCOUNT_CREATED event delivered twice), must respect a global kill switch during rollout, and must respect a per-user opt-out that a later ticket will expose. Every future email type would otherwise need to reimplement duplicate-send prevention, the kill switch and the opt-out check itself, with no shared place to see what was actually sent.

## Decision

Add a `notifications` module whose core is a single `LifecycleEmailSender` service that every lifecycle email use case must go through (use cases are not allowed to call the `Mailer` gateway directly). Before sending, it checks `LIFECYCLE_EMAILS_ENABLED`, the recipient's `users.lifecycle_emails_unsubscribed_at`, and a `lifecycle_email_deliveries` ledger for an existing row keyed on `(user_id, email_type, related_entity_id)`. It writes a "pending" row before calling the mailer and updates it to "sent" or "failed" afterward, so the ledger can never disagree with what actually happened. Two partial unique indexes back the ledger — one `WHERE related_entity_id IS NOT NULL`, one `WHERE related_entity_id IS NULL` — because Postgres unique indexes don't deduplicate NULLs, and account-scoped emails (like welcome) have no related entity. Sending itself happens synchronously inside the domain event handler (NestJS `emitAsync`), i.e. inside the HTTP request that triggered it (e.g. registration), with short SMTP timeouts and a blanket try/catch so a mailer failure can never fail that request.

## Options Considered

### Centralized LifecycleEmailSender + SQL delivery ledger (chosen)

- **Pros**: Kill switch, opt-out and dedup are enforced once and can't be forgotten by a future email type; the ledger gives a queryable audit trail ("did user X get the welcome email"); a later retry sweeper for failed/stuck-pending rows has a natural home to attach to.
- **Cons**: Every lifecycle email pays for an extra ledger write + read round trip and two extra indexes; adds a mandatory layer of indirection use cases must route through, enforced only by convention, not the type system.

### Per-use-case ad hoc mailer calls, no shared service

- **Pros**: No new table or service for a single email type; less ceremony to ship just the welcome email.
- **Cons**: Kill switch and opt-out enforcement would need to be reimplemented (or could be forgotten) by every future email type; no single place to answer "was this sent" for support/debugging; duplicate-send-on-event-replay protection becomes a per-feature concern instead of a structural guarantee.

### Provider/queue-level idempotency instead of an app-level ledger

- **Pros**: No extra table to maintain in the app.
- **Cons**: The SMTP relay actually in use (generic SMTP, mailcatcher in e2e) has no idempotency-key concept to lean on; ties correctness to a future provider migration; loses the audit trail the ledger gives for free today.

## Consequences

### Positive

- Future lifecycle email tickets (reminders, impacts summary) only need to add a template + use case; kill-switch, opt-out and duplicate-send prevention come for free through LifecycleEmailSender.
- Delivery history is queryable per user/email type for support and debugging without extra instrumentation.
- A later automated retry sweeper for "failed" or stranded "pending" deliveries has an obvious home (the ledger) rather than needing its own tracking mechanism.

### Negative

- Registration (and every future lifecycle-email-triggering request) now does synchronous SMTP I/O inline; mitigated with 5s/5s/10s connect/greeting/socket timeouts and a catch-all, but still couples request latency to the mailer.
- Ledger writes add DB load and two extra partial indexes per lifecycle-email-capable table interaction; a "failed" delivery is not retried automatically yet — that's explicitly deferred to a later sweeper ticket, so failed sends are currently silent beyond a log line.
- New email types must remember to call LifecycleEmailSender rather than the Mailer gateway directly — nothing in the type system prevents a future use case from bypassing it, only the module's own comments and code review.

## Links

- docs/adr/0001-clean-hexagonal-architecture.md
- docs/adr/0005-gateway-pattern-for-third-party-browser-sdks.md
- docs/adr/0010-scheduled-tasks-as-primary-adapters.md
- apps/api/src/notifications/core/services/lifecycleEmailSender.ts
- apps/api/src/shared-kernel/adapters/sql-knex/migrations/20260922124312_create-table-lifecycle-email-deliveries.ts
