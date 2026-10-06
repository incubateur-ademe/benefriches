import { Inject, Injectable } from "@nestjs/common";
import type { Knex } from "knex";

import type { LifecycleEmailSubscriptionRepository } from "src/notifications/core/gateways/LifecycleEmailSubscriptionRepository";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

@Injectable()
export class SqlLifecycleEmailSubscriptionRepository implements LifecycleEmailSubscriptionRepository {
  private readonly sqlConnection: Knex;

  constructor(@Inject(SqlConnection) sqlConnection: Knex) {
    this.sqlConnection = sqlConnection;
  }

  async markUnsubscribed(userId: string, unsubscribedAt: Date): Promise<boolean> {
    // Only the first unsubscribe is recorded: a repeated click or a link scanner re-hit
    // must not move the opt-out date. The guarded UPDATE is atomic, so two concurrent
    // calls can't both report a change.
    const updatedRowsCount = await this.sqlConnection("users")
      .where("id", userId)
      .whereNull("lifecycle_emails_unsubscribed_at")
      .update({ lifecycle_emails_unsubscribed_at: unsubscribedAt });
    return updatedRowsCount > 0;
  }
}
