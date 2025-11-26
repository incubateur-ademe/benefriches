import { Inject, Injectable } from "@nestjs/common";
import { Knex } from "knex";

import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import type { SqlSiteAction } from "src/shared-kernel/adapters/sql-knex/tableTypes";
import { SiteActionsRepository } from "src/site-actions/core/gateways/SiteActionsRepository";
import type { SiteAction } from "src/site-actions/core/models/siteAction";

const mapSiteActionToSqlRow = (action: SiteAction): SqlSiteAction => ({
  id: action.id,
  site_id: action.siteId,
  action_type: action.actionType,
  status: action.status,
  created_at: action.createdAt,
  completed_at: action.completedAt ?? null,
});

@Injectable()
export class SqlSiteActionsRepository implements SiteActionsRepository {
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}

  async save(actions: SiteAction[]): Promise<void> {
    const sqlRows = actions.map(mapSiteActionToSqlRow);
    await this.sqlConnection("site_actions").insert(sqlRows);
  }

  async updateStatus(params: {
    siteId: string;
    actionType: SiteAction["actionType"];
    status: SiteAction["status"];
    completedAt?: Date;
  }): Promise<void> {
    const updateData: Record<string, unknown> = {
      status: params.status,
    };

    if (params.completedAt) {
      updateData.completed_at = params.completedAt;
    }

    await this.sqlConnection("site_actions")
      .where({
        site_id: params.siteId,
        action_type: params.actionType,
      })
      .update(updateData);
  }
}
