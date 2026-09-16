import { Inject, Injectable } from "@nestjs/common";
import type { Knex } from "knex";

import type {
  MarketingUser,
  MarketingUsersQuery,
} from "src/marketing/core/gateways/MarketingUsersQuery";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

@Injectable()
export class SqlMarketingUsersQuery implements MarketingUsersQuery {
  private readonly sqlConnection: Knex;
  constructor(@Inject(SqlConnection) sqlConnection: Knex) {
    this.sqlConnection = sqlConnection;
  }

  // Unbounded scan: full users table loaded into memory. Acceptable today; revisit if sync runtime grows past minutes.
  async listAll(): Promise<MarketingUser[]> {
    const rows = await this.sqlConnection("users")
      .select("id", "email", "subscribed_to_newsletter")
      .orderBy("created_at");
    return rows.map(toMarketingUser);
  }

  async listCreatedSince(date: Date): Promise<MarketingUser[]> {
    const rows = await this.sqlConnection("users")
      .where("created_at", ">=", date)
      .select("id", "email", "subscribed_to_newsletter")
      .orderBy("created_at");
    return rows.map(toMarketingUser);
  }
}

const toMarketingUser = (row: {
  id: string;
  email: string;
  subscribed_to_newsletter: boolean;
}): MarketingUser => ({
  id: row.id,
  email: row.email,
  subscribedToNewsletter: row.subscribed_to_newsletter,
});
