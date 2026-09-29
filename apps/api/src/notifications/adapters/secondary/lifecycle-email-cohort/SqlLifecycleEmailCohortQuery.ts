import { Inject, Injectable } from "@nestjs/common";
import type { Knex } from "knex";

import type {
  FirstSiteReminderRecipient,
  LifecycleEmailCohortQuery,
} from "src/notifications/core/gateways/LifecycleEmailCohortQuery";
import { lifecycleEmailTypeSchema } from "src/notifications/core/models/lifecycleEmail";
import type { ReminderWindow } from "src/notifications/core/models/reminderWindow";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

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
}
