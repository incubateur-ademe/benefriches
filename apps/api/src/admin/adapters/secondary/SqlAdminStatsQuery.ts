import { Inject, Injectable } from "@nestjs/common";
import type { Knex } from "knex";

import type {
  AdminMonthlyCounts,
  AdminStatsQuery,
  AdminTotals,
  MonthlyCount,
} from "src/admin/core/gateways/AdminStatsQuery";
import { LOGIN_SUCCEEDED } from "src/auth/core/events/loginSucceeded.event";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

const MONTH_EXPRESSION = "to_char(date_trunc('month', created_at AT TIME ZONE 'UTC'), 'YYYY-MM')";

@Injectable()
export class SqlAdminStatsQuery implements AdminStatsQuery {
  private readonly sqlConnection: Knex;

  constructor(@Inject(SqlConnection) sqlConnection: Knex) {
    this.sqlConnection = sqlConnection;
  }

  async getTotals(): Promise<AdminTotals> {
    const [users, sites, projects, compatibilityEvaluations] = await Promise.all([
      this.countRows("users"),
      this.countRows("sites"),
      this.countRows("reconversion_projects"),
      this.countRows("reconversion_compatibility_evaluations"),
    ]);

    return { users, sites, projects, compatibilityEvaluations };
  }

  async getMonthlyCounts(since: Date): Promise<AdminMonthlyCounts> {
    const [usersCreated, sitesCreated, projectsCreated, compatibilityEvaluationsCreated, logins] =
      await Promise.all([
        this.countByMonth("users", since),
        this.countByMonth("sites", since),
        this.countByMonth("reconversion_projects", since),
        this.countByMonth("reconversion_compatibility_evaluations", since),
        this.countByMonth("domain_events", since, (qb) => qb.where("name", LOGIN_SUCCEEDED)),
      ]);

    return { usersCreated, sitesCreated, projectsCreated, compatibilityEvaluationsCreated, logins };
  }

  private async countRows(table: string): Promise<number> {
    const row = await this.sqlConnection(table).count<{ count: string | number }[]>("* as count");
    return Number(row[0]?.count ?? 0);
  }

  private async countByMonth(
    table: string,
    since: Date,
    filter: (qb: Knex.QueryBuilder) => Knex.QueryBuilder = (qb) => qb,
  ): Promise<MonthlyCount[]> {
    return await filter(this.sqlConnection(table).where("created_at", ">=", since))
      .groupByRaw(MONTH_EXPRESSION)
      .select<MonthlyCount[]>(
        this.sqlConnection.raw(`${MONTH_EXPRESSION} as month`),
        this.sqlConnection.raw("count(*)::int as count"),
      );
  }
}
