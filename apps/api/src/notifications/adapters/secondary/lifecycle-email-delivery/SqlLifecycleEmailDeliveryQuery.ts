import { Inject, Injectable } from "@nestjs/common";
import type { Knex } from "knex";

import type { LifecycleEmailDeliveryQuery } from "src/notifications/core/gateways/LifecycleEmailDeliveryQuery";
import type { LifecycleEmailType } from "src/notifications/core/models/lifecycleEmail";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

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
}
