import { Inject, Injectable } from "@nestjs/common";
import type { Knex } from "knex";

import type { LifecycleEmailDeliveryRepository } from "src/notifications/core/gateways/LifecycleEmailDeliveryRepository";
import type {
  LifecycleEmailDelivery,
  LifecycleEmailDeliveryStatus,
} from "src/notifications/core/models/lifecycleEmail";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import type { SqlLifecycleEmailDelivery } from "src/shared-kernel/adapters/sql-knex/tableTypes";

@Injectable()
export class SqlLifecycleEmailDeliveryRepository implements LifecycleEmailDeliveryRepository {
  private readonly sqlConnection: Knex;

  constructor(@Inject(SqlConnection) sqlConnection: Knex) {
    this.sqlConnection = sqlConnection;
  }

  async save(delivery: LifecycleEmailDelivery): Promise<void> {
    const row: SqlLifecycleEmailDelivery = {
      id: delivery.id,
      user_id: delivery.userId,
      email_type: delivery.emailType,
      related_entity_id: delivery.relatedEntityId,
      status: delivery.status,
      created_at: delivery.createdAt,
      sent_at: delivery.sentAt,
      error_message: delivery.errorMessage,
      attempts: delivery.attempts,
      last_attempted_at: delivery.lastAttemptedAt,
    };

    await this.sqlConnection("lifecycle_email_deliveries").insert(row);
  }

  async markSent(deliveryId: string, sentAt: Date): Promise<void> {
    await this.sqlConnection("lifecycle_email_deliveries").where("id", deliveryId).update({
      status: "sent",
      sent_at: sentAt,
    });
  }

  async markFailed(deliveryId: string, errorMessage: string): Promise<void> {
    await this.sqlConnection("lifecycle_email_deliveries").where("id", deliveryId).update({
      status: "failed",
      error_message: errorMessage,
    });
  }

  async markAbandoned(deliveryId: string, errorMessage: string): Promise<void> {
    await this.sqlConnection("lifecycle_email_deliveries").where("id", deliveryId).update({
      status: "abandoned",
      error_message: errorMessage,
    });
  }

  // One conditional UPDATE: when two sweepers race on the same row, Postgres makes the
  // second UPDATE wait for the first to commit, re-evaluate its WHERE, find `attempts`
  // changed and update nothing. No lock is held across the SMTP call.
  async claimForRetry(input: {
    id: string;
    expectedStatus: LifecycleEmailDeliveryStatus;
    expectedAttempts: number;
    attemptedAt: Date;
  }): Promise<boolean> {
    const updatedCount = await this.sqlConnection("lifecycle_email_deliveries")
      .where({ id: input.id, status: input.expectedStatus, attempts: input.expectedAttempts })
      .update({
        status: "pending",
        attempts: this.sqlConnection.raw("attempts + 1"),
        last_attempted_at: input.attemptedAt,
      });
    return updatedCount === 1;
  }
}
