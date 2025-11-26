import { Inject } from "@nestjs/common";
import { Knex } from "knex";

import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import type { SqlSiteAction } from "src/shared-kernel/adapters/sql-knex/tableTypes";
import { SiteActionsQuery } from "src/site-actions/core/gateways/SiteActionsQuery";
import type { SiteAction } from "src/site-actions/core/models/siteAction";

const mapSqlRowToSiteAction = (row: SqlSiteAction): SiteAction => ({
  id: row.id,
  siteId: row.site_id,
  actionType: row.action_type as SiteAction["actionType"],
  status: row.status as SiteAction["status"],
  createdAt: row.created_at,
  completedAt: row.completed_at ?? undefined,
});

export class SqlSiteActionsQuery implements SiteActionsQuery {
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}

  async getBySiteId(siteId: string): Promise<SiteAction[]> {
    const rows = await this.sqlConnection("site_actions")
      .select("*")
      .where("site_id", siteId)
      .orderBy("created_at", "asc");

    return rows.map(mapSqlRowToSiteAction);
  }
}
