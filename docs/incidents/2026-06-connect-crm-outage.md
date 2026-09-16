# Connect CRM outage — incident summary

Primer for the follow-up discussion on monitoring/alerting (item #4). Written to stand alone in a separate session.

## What broke

`CONNECT_CRM_HOST` (production env var) held a value that already included `/api/v1`, while the app code (`ConnectCrm.ts`) also hardcoded `/api/v1` when building request paths. Every outbound call to ADEME's Connect CRM was sent to a doubled path (`.../api/v1/api/v1/...`) and 404'd. This started **2026-06-05** and ran for **~3.5 months**, fully undetected internally. It was only discovered when ADEME's SMRC/CONNECT team emailed to ask why they'd stopped receiving any data from Bénéfriches.

## Why it stayed invisible

1. **No error tracking/alerting tool at all** in the stack (confirmed: no Sentry/Datadog/etc. dependency anywhere in `package.json`). CRM call failures were caught and only sent to `NestJS Logger` → Scalingo logs, which nobody actively watches.
2. **Failure disguised as a normal business signal.** The daily CRM sync job treats an HTTP 404 as "this contact doesn't exist in CRM" and counts it under a `missingInCrm` metric — not an error metric. So even someone scanning logs/dashboards would see a business counter, not an error spike.
3. **No startup env validation** (at the time). The misconfigured URL wasn't caught at deploy time; it only ever surfaced as a runtime 404 on individual HTTP calls.

## Consequences discovered while investigating

- The daily sync job's "contact missing in CRM" branch also **wrote to our own database**: for any user whose local `subscribed_to_newsletter` was `true`, it silently flipped it to `false`, believing it was correcting drift (it was reacting to the false 404, not a real CRM state). This ran unattended, without `--dry-run`, every day from 2026-06-05 onward.
- Users created **during** the outage were never created in CRM at all (`createContact` also 404'd for them).
- Confirmed no inbound unsubscribe webhook exists in this codebase — the CRM unsubscribe link is entirely CRM-side, so CRM remains a safe source of truth for any pre-existing contact regardless of what happened during the outage.

## What's already fixed

- **URL bug** (commit `7ca07e8a6`): renamed `CONNECT_CRM_HOST` → `CONNECT_CRM_BASE_URL`, removed the hardcoded `/api/v1` duplication in `ConnectCrm.ts`, added Zod validation for the var.
- **CI break from that fix** (commit `58819b509`): the initial validation approach (`ConfigModule.forRoot({ validate })`) ran eagerly at module-import time, before the test harness's `ConfigModule` override could take effect, breaking ~100 integration tests. Fixed by moving the check into `main.ts`'s `bootstrap()`, which only runs on the real app boot path and is never exercised by tests.
- Both merged to `main` and pushed. Production deploy handled manually by the team.

## Still open / explicitly deferred

- `UserAccountCreatedHandler` and `LoginSucceededHandler` still catch CRM failures and only `Logger.error` them — no real alerting destination. Deferred pending the monitoring tool decision (the point of the next session).
- Design smell: treating HTTP 404 as domain truth ("contact not found") makes a real "not found" indistinguishable from an infra/config error. Explicitly set aside for a later discussion.
- **Data recovery** (~3.5 months of unsynced signups/newsletter changes): a `BackfillCrmContactsUseCase` + `backfillCrmContacts.script.ts` were built (uncommitted, in the working tree) to recreate CRM contacts for users signed up during the outage, using their original signup-intent from the `USER_ACCOUNT_CREATED` domain event rather than the possibly-corrupted DB column. Pre-existing users self-heal automatically once the URL fix is deployed and the existing daily sync job runs again (it reads live CRM data and corrects any bad `false` the bug wrote).

## Ask for the monitoring/alerting session

Recommend a concrete, **easy-to-set-up** error monitoring/alerting solution for a NestJS API (`apps/api`) + React SPA (`apps/web`) hosted on **Scalingo**, covering both **staging** and **production**. There is currently **zero** error-tracking tooling in place — starting from scratch. Prioritize low setup effort and something that would have caught this specific class of failure (silent caught exceptions + misleading log-only metrics).
