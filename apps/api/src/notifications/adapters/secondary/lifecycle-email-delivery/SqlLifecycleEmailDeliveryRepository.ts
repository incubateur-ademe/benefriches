import { Inject, Injectable } from "@nestjs/common";
import type { Knex } from "knex";

import type { LifecycleEmailDeliveryRepository } from "src/notifications/core/gateways/LifecycleEmailDeliveryRepository";
import type { LifecycleEmailDelivery } from "src/notifications/core/models/lifecycleEmail";
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
}
