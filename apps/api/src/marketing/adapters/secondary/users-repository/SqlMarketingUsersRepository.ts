import { Inject, Injectable } from "@nestjs/common";
import type { Knex } from "knex";

import type { MarketingUsersRepository } from "src/marketing/core/gateways/MarketingUsersRepository";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

@Injectable()
export class SqlMarketingUsersRepository implements MarketingUsersRepository {
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}

  async updateSubscriptionStatus(userId: string, subscribed: boolean): Promise<void> {
    await this.sqlConnection("users")
      .where({ id: userId })
      .update({ subscribed_to_newsletter: subscribed });
  }
}
