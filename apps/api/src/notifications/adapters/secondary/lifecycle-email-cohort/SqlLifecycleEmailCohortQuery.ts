import { Inject, Injectable } from "@nestjs/common";
import type { Knex } from "knex";
import { siteCreationModeSchema, siteNatureSchema } from "shared";

import type {
  FirstProjectReminderSite,
  FirstSiteReminderRecipient,
  LifecycleEmailCohortQuery,
} from "src/notifications/core/gateways/LifecycleEmailCohortQuery";
import { lifecycleEmailTypeSchema } from "src/notifications/core/models/lifecycleEmail";
import type { ReminderWindow } from "src/notifications/core/models/reminderWindow";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

type FirstProjectReminderSiteRow = {
  site_id: string;
  site_name: string;
  site_nature: string;
  site_created_at: Date;
  user_id: string;
  email: string;
  firstname: string | null;
  lastname: string | null;
};

// Eligibility lives here and only here: the InMemory implementation is a stub, and this
// query is covered rule by rule by its integration spec. It never reads a clock: the
// window is computed by the use case from the injected DateProvider.
@Injectable()
export class SqlLifecycleEmailCohortQuery implements LifecycleEmailCohortQuery {
  private readonly sqlConnection: Knex;

  constructor(@Inject(SqlConnection) sqlConnection: Knex) {
    this.sqlConnection = sqlConnection;
  }

  async findFirstSiteReminderRecipients(
    window: ReminderWindow,
  ): Promise<FirstSiteReminderRecipient[]> {
    const sqlConnection = this.sqlConnection;
    const rows = await sqlConnection("users")
      .select("id", "email", "firstname", "lastname", "created_at")
      // Registered less than 72 h ago (exclusive) and at least 24 h ago (inclusive).
      .where("created_at", ">", window.createdAfter)
      .andWhere("created_at", "<=", window.createdAtOrBefore)
      .whereNull("lifecycle_emails_unsubscribed_at")
      // Suppression is generous: ANY site suppresses, whatever its creation_mode (custom,
      // express, csv-import) and whatever its status (active, archived). So no filter on
      // creation_mode or status here, on purpose.
      .whereNotExists(function () {
        void this.select(sqlConnection.raw("1"))
          .from("sites")
          .whereRaw("sites.created_by = users.id");
      })
      // Any status (pending, sent, failed, abandoned): failed and stale pending rows belong
      // to the retry sweeper, abandoned is terminal, and a second insert would hit the
      // unique index anyway.
      .whereNotExists(function () {
        void this.select(sqlConnection.raw("1"))
          .from("lifecycle_email_deliveries")
          .whereRaw("lifecycle_email_deliveries.user_id = users.id")
          .andWhere(
            "lifecycle_email_deliveries.email_type",
            lifecycleEmailTypeSchema.enum["first-site-reminder"],
          );
      })
      .orderBy("created_at");

    return rows.map((row) => ({
      userId: row.id,
      email: row.email,
      firstName: row.firstname,
      lastName: row.lastname,
      registeredAt: row.created_at,
    }));
  }

  async findFirstProjectReminderSites(window: ReminderWindow): Promise<FirstProjectReminderSite[]> {
    const sqlConnection = this.sqlConnection;
    const rows = await sqlConnection("sites")
      .join("users", "users.id", "sites.created_by")
      // Aliased: sites and users both have id and created_at.
      .select<FirstProjectReminderSiteRow[]>(
        "sites.id as site_id",
        "sites.name as site_name",
        "sites.nature as site_nature",
        "sites.created_at as site_created_at",
        "users.id as user_id",
        "users.email as email",
        "users.firstname as firstname",
        "users.lastname as lastname",
      )
      // The window is on the site's creation, never on the user's registration: created
      // less than 72 h ago (exclusive) and at least 24 h ago (inclusive).
      .where("sites.created_at", ">", window.createdAfter)
      .andWhere("sites.created_at", "<=", window.createdAtOrBefore)
      // Triggering is narrow: only custom and express sites earn a reminder. An allowlist,
      // not "<> 'csv-import'": a future creation mode (or a NULL legacy value) does not
      // start sending emails by default. CSV imports would otherwise send one email per
      // imported site.
      .whereIn("sites.creation_mode", [
        siteCreationModeSchema.enum.custom,
        siteCreationModeSchema.enum.express,
      ])
      // An archived site never triggers. "= active" rather than "<> archived", so a NULL
      // status never triggers either.
      .andWhere("sites.status", "active")
      .whereNull("users.lifecycle_emails_unsubscribed_at")
      // Suppression is generous: ANY project on the site suppresses, archived included, so
      // no filter on reconversion_projects.status here, on purpose.
      .whereNotExists(function () {
        void this.select(sqlConnection.raw("1"))
          .from("reconversion_projects")
          .whereRaw("reconversion_projects.related_site_id = sites.id");
      })
      // Matched on the site, not only on the user: another site's reminder must not suppress
      // this one. Any status (pending, sent, failed, abandoned), as for the first site
      // reminder.
      .whereNotExists(function () {
        void this.select(sqlConnection.raw("1"))
          .from("lifecycle_email_deliveries")
          .whereRaw("lifecycle_email_deliveries.user_id = users.id")
          .andWhere(
            "lifecycle_email_deliveries.email_type",
            lifecycleEmailTypeSchema.enum["first-project-reminder"],
          )
          .whereRaw("lifecycle_email_deliveries.related_entity_id = sites.id");
      })
      .orderBy([
        { column: "sites.created_at", order: "asc" },
        { column: "sites.id", order: "asc" },
      ]);

    return rows.map((row) => ({
      siteId: row.site_id,
      siteName: row.site_name,
      // Throws on an unknown nature: this cohort fails loudly for the run rather than guess
      // a wording. The column is only ever written from this enum.
      siteNature: siteNatureSchema.parse(row.site_nature),
      siteCreatedAt: row.site_created_at,
      userId: row.user_id,
      email: row.email,
      firstName: row.firstname,
      lastName: row.lastname,
    }));
  }
}
