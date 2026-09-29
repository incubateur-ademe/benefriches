import { Inject, Injectable } from "@nestjs/common";
import type { Knex } from "knex";
import { siteNatureSchema } from "shared";

import type {
  LifecycleEmailSite,
  LifecycleEmailSiteQuery,
} from "src/notifications/core/gateways/LifecycleEmailSiteQuery";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

@Injectable()
export class SqlLifecycleEmailSiteQuery implements LifecycleEmailSiteQuery {
  private readonly sqlConnection: Knex;

  constructor(@Inject(SqlConnection) sqlConnection: Knex) {
    this.sqlConnection = sqlConnection;
  }

  // No status filter: a retry does not re-check eligibility, and filtering here would turn
  // an archived site into a misleading "not found".
  async getById(siteId: string): Promise<LifecycleEmailSite | undefined> {
    const row = await this.sqlConnection("sites")
      .select("id", "name", "nature")
      .where("id", siteId)
      .first();

    if (!row) return undefined;

    return {
      id: row.id,
      name: row.name,
      nature: siteNatureSchema.parse(row.nature),
    };
  }
}
