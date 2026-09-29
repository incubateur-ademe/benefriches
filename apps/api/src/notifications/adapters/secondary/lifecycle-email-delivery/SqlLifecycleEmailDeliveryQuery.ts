import { Inject, Injectable } from "@nestjs/common";
import type { Knex } from "knex";

import type { LifecycleEmailDeliveryQuery } from "src/notifications/core/gateways/LifecycleEmailDeliveryQuery";
import {
  type LifecycleEmailDelivery,
  lifecycleEmailDeliveryStatusSchema,
  type LifecycleEmailType,
  lifecycleEmailTypeSchema,
} from "src/notifications/core/models/lifecycleEmail";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import type { SqlLifecycleEmailDelivery } from "src/shared-kernel/adapters/sql-knex/tableTypes";

@Injectable()
export class SqlLifecycleEmailDeliveryQuery implements LifecycleEmailDeliveryQuery {
  private readonly sqlConnection: Knex;

  constructor(@Inject(SqlConnection) sqlConnection: Knex) {
    this.sqlConnection = sqlConnection;
  }

  async hasDelivery(input: {
    userId: string;
    emailType: LifecycleEmailType;
    relatedEntityId: string | null;
  }): Promise<boolean> {
    // Never `.where("related_entity_id", null)` — Knex emits `= NULL`, which is never
    // true in SQL. Must branch on whereNull explicitly.
    const query = this.sqlConnection("lifecycle_email_deliveries").where({
      user_id: input.userId,
      email_type: input.emailType,
    });

    if (input.relatedEntityId === null) {
      query.whereNull("related_entity_id");
    } else {
      query.where("related_entity_id", input.relatedEntityId);
    }

    const row = await query.first();
    return !!row;
  }

  async findRetryCandidates(input: {
    stalePendingBefore: Date;
  }): Promise<LifecycleEmailDelivery[]> {
    const rows: SqlLifecycleEmailDelivery[] = await this.sqlConnection(
      "lifecycle_email_deliveries as d",
    )
      .select("d.*")
      .join("users as u", "u.id", "d.user_id")
      .whereNull("u.lifecycle_emails_unsubscribed_at")
      // Only types the code knows, so a leftover row of a retired type can't make the
      // parse below throw and kill the whole run.
      .whereIn("d.email_type", lifecycleEmailTypeSchema.options)
      .where((qb) => {
        void qb.where("d.status", "failed").orWhere((pendingQb) => {
          void pendingQb
            .where("d.status", "pending")
            .where("d.last_attempted_at", "<", input.stalePendingBefore);
        });
      })
      .orderBy("d.created_at");

    return rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      emailType: lifecycleEmailTypeSchema.parse(row.email_type),
      relatedEntityId: row.related_entity_id,
      status: lifecycleEmailDeliveryStatusSchema.parse(row.status),
      createdAt: row.created_at,
      sentAt: row.sent_at,
      errorMessage: row.error_message,
      attempts: row.attempts,
      lastAttemptedAt: row.last_attempted_at,
    }));
  }
}
