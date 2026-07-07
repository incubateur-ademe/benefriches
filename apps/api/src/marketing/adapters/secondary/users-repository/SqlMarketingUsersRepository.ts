import { Inject, Injectable } from "@nestjs/common";
import type { Knex } from "knex";

import type { MarketingUsersRepository } from "src/marketing/core/gateways/MarketingUsersRepository";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

@Injectable()
export class SqlMarketingUsersRepository implements MarketingUsersRepository {
  private readonly sqlConnection: Knex;
  constructor(@Inject(SqlConnection) sqlConnection: Knex) {
    this.sqlConnection = sqlConnection;
  }

  async updateSubscriptionStatus(userId: string, subscribed: boolean): Promise<void> {
    await this.sqlConnection("users")
      .where({ id: userId })
      .update({ subscribed_to_newsletter: subscribed });
  }
}
