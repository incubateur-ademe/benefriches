import { Inject, Injectable } from "@nestjs/common";
import type { Knex } from "knex";

import type {
  LifecycleEmailRecipient,
  LifecycleEmailRecipientQuery,
} from "src/notifications/core/gateways/LifecycleEmailRecipientQuery";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

@Injectable()
export class SqlLifecycleEmailRecipientQuery implements LifecycleEmailRecipientQuery {
  private readonly sqlConnection: Knex;

  constructor(@Inject(SqlConnection) sqlConnection: Knex) {
    this.sqlConnection = sqlConnection;
  }

  async getById(userId: string): Promise<LifecycleEmailRecipient | undefined> {
    const row = await this.sqlConnection("users")
      .select("id", "email", "firstname", "lastname", "lifecycle_emails_unsubscribed_at")
      .where("id", userId)
      .first();

    if (!row) return undefined;

    return {
      id: row.id,
      email: row.email,
      firstName: row.firstname,
      lastName: row.lastname,
      unsubscribedAt: row.lifecycle_emails_unsubscribed_at,
    };
  }
}
