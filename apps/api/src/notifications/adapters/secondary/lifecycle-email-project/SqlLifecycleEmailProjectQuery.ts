import { Inject, Injectable } from "@nestjs/common";
import type { Knex } from "knex";

import type {
  LifecycleEmailProject,
  LifecycleEmailProjectQuery,
} from "src/notifications/core/gateways/LifecycleEmailProjectQuery";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

type LifecycleEmailProjectRow = {
  id: string;
  name: string;
  created_at: Date;
  site_name: string;
};

@Injectable()
export class SqlLifecycleEmailProjectQuery implements LifecycleEmailProjectQuery {
  private readonly sqlConnection: Knex;

  constructor(@Inject(SqlConnection) sqlConnection: Knex) {
    this.sqlConnection = sqlConnection;
  }

  // No status filter: a retry does not re-check eligibility, and filtering here would turn
  // an archived project into a misleading "not found".
  async getById(projectId: string): Promise<LifecycleEmailProject | undefined> {
    const row = await this.sqlConnection("reconversion_projects")
      .join("sites", "sites.id", "reconversion_projects.related_site_id")
      // Aliased: reconversion_projects and sites both have id, name and created_at.
      .select<LifecycleEmailProjectRow[]>(
        "reconversion_projects.id as id",
        "reconversion_projects.name as name",
        "reconversion_projects.created_at as created_at",
        "sites.name as site_name",
      )
      .where("reconversion_projects.id", projectId)
      .first();

    if (!row) return undefined;

    return {
      id: row.id,
      name: row.name,
      siteName: row.site_name,
      createdAt: row.created_at,
    };
  }
}
