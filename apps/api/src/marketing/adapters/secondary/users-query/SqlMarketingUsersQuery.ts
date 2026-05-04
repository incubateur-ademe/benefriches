import { Inject, Injectable } from "@nestjs/common";
import type { Knex } from "knex";

import type {
  MarketingUser,
  MarketingUsersQuery,
} from "src/marketing/core/gateways/MarketingUsersQuery";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

@Injectable()
export class SqlMarketingUsersQuery implements MarketingUsersQuery {
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}

  // Unbounded scan: full users table loaded into memory. Acceptable today; revisit if sync runtime grows past minutes.
  async listAll(): Promise<MarketingUser[]> {
    const rows = await this.sqlConnection("users")
      .select("id", "email", "subscribed_to_newsletter")
      .orderBy("created_at");
    return rows.map((row) => ({
      id: row.id,
      email: row.email,
      subscribedToNewsletter: row.subscribed_to_newsletter,
    }));
  }
}
