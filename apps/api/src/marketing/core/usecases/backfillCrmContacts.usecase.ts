import type { CRMGateway } from "src/marketing/core/CRMGateway";
import type { MarketingUsersQuery } from "src/marketing/core/gateways/MarketingUsersQuery";
import type { UserSignupIntentQuery } from "src/marketing/core/gateways/UserSignupIntentQuery";
import type { AppLogger } from "src/shared-kernel/logger";
import { success, type TResult } from "src/shared-kernel/result";
import type { UseCase } from "src/shared-kernel/usecase";

/**
 * Lower bound of the candidate window for this backfill. **Deliberately wider than the
 * incident's confirmed start date**, which `docs/incidents/2026-06-connect-crm-outage.md`
 * documents as 2026-06-05 (the day `CONNECT_CRM_HOST` started pointing at a value already
 * containing `/api/v1` while the adapter also prefixed `/api/v1`, producing `/api/v1/api/v1/...`
 * and a 404 on every Connect CRM call, so `createContact` silently failed).
 *
 * This is NOT the incident date: the exact deploy timestamp was never verified, so the window
 * starts a few days earlier on purpose. The asymmetry of the two mistakes drives the margin:
 * including a pre-outage user is harmless (they already have a CRM contact, so the
 * `alreadyInCrm` check skips them), whereas excluding a real outage-window user means nothing
 * ever backfills them. Widen rather than risk a permanent silent omission.
 *
 * Users created before the real outage already have a CRM contact (only reads failed for them)
 * and are repaired by re-running the newsletter sync job.
 */
export const BACKFILL_CANDIDATE_SINCE_DATE = new Date("2026-06-01T00:00:00.000Z");

type Request = { dryRun: boolean };

export type BackfillCrmContactsSummary = {
  totalCandidates: number;
  alreadyInCrm: number;
  backfilled: number;
  missingSignupEvent: number;
  errored: number;
  dryRun: boolean;
};

type Result = TResult<BackfillCrmContactsSummary, never>;

/**
 * One-off repair job: re-creates in Connect CRM the contacts of users who signed up during
 * the CRM URL outage and were therefore never created there.
 *
 * The newsletter subscription the contact is created with comes from the signup domain event
 * (the user's original intent), never from `users.subscribed_to_newsletter`, which the daily
 * sync job may have wrongly flipped to `false` while the outage lasted.
 */
export class BackfillCrmContactsUseCase implements UseCase<Request, Result> {
  private readonly usersQuery: MarketingUsersQuery;
  private readonly signupIntentQuery: UserSignupIntentQuery;
  private readonly crm: CRMGateway;
  private readonly logger: AppLogger;

  constructor(
    usersQuery: MarketingUsersQuery,
    signupIntentQuery: UserSignupIntentQuery,
    crm: CRMGateway,
    logger: AppLogger,
  ) {
    this.usersQuery = usersQuery;
    this.signupIntentQuery = signupIntentQuery;
    this.crm = crm;
    this.logger = logger;
  }

  // Same convention as SyncNewsletterSubscriptionsUseCase: a call with no request is a real run.
  async execute(request: Request = { dryRun: false }): Promise<Result> {
    const dryRun = request.dryRun;
    const prefix = dryRun ? "[DRY RUN] " : "";
    const startedAt = Date.now();

    this.logger.info(
      `${prefix}CRM contacts backfill started for users created since ${BACKFILL_CANDIDATE_SINCE_DATE.toISOString()}`,
    );

    const users = await this.usersQuery.listCreatedSince(BACKFILL_CANDIDATE_SINCE_DATE);
    const summary: BackfillCrmContactsSummary = {
      totalCandidates: users.length,
      alreadyInCrm: 0,
      backfilled: 0,
      missingSignupEvent: 0,
      errored: 0,
      dryRun,
    };

    for (const user of users) {
      try {
        const existingContact = await this.crm.findContactByEmail(user.email);

        if (existingContact !== null) {
          summary.alreadyInCrm++;
          continue;
        }

        // Matched on userId, never email: an email can have been reused by a later account
        // (deleted then re-registered), which would pick up a stale signup intent.
        const signupIntent = await this.signupIntentQuery.findByUserId(user.id);

        if (signupIntent === null) {
          this.logger.warn(
            `Signup event not found, cannot recover newsletter intent: email=${user.email}, userId=${user.id}`,
          );
          summary.missingSignupEvent++;
          summary.errored++;
          continue;
        }

        this.logger.info(
          `${prefix}Backfilling CRM contact: email=${user.email}, userId=${user.id}, subscribedToNewsletter=${signupIntent.subscribedToNewsletter}`,
        );

        if (!dryRun) {
          await this.crm.createContact({
            email: user.email,
            firstName: signupIntent.firstName,
            lastName: signupIntent.lastName,
            subscribedToNewsletter: signupIntent.subscribedToNewsletter,
          });
        }
        summary.backfilled++;
      } catch (error) {
        this.logger.error(`CRM backfill failed: email=${user.email}, userId=${user.id}`, error);
        summary.errored++;
      }
    }

    const durationMs = Date.now() - startedAt;
    this.logger.info(
      `${prefix}CRM contacts backfill summary (durationMs=${durationMs}): total=${summary.totalCandidates}, alreadyInCrm=${summary.alreadyInCrm}, backfilled=${summary.backfilled}, missingSignupEvent=${summary.missingSignupEvent}, errored=${summary.errored}`,
    );

    return success(summary);
  }
}
