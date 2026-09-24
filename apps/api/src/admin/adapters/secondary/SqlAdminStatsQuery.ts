import { Inject, Injectable } from "@nestjs/common";
import type { Knex } from "knex";
import type { AdminMonthlyStats } from "shared";

import type { AdminStatsQuery, AdminTotals } from "src/admin/core/gateways/AdminStatsQuery";
import { LOGIN_SUCCEEDED } from "src/auth/core/events/loginSucceeded.event";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

type MonthlyCountRow = { month: string; count: string | number };

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

  async getMonthlyStats(since: Date): Promise<AdminMonthlyStats[]> {
    const [users, sites, projects, compatibilityEvaluations, logins] = await Promise.all([
      this.countByMonth("users", since),
      this.countByMonth("sites", since),
      this.countByMonth("reconversion_projects", since),
      this.countByMonth("reconversion_compatibility_evaluations", since),
      this.countByMonth("domain_events", since, (qb) => qb.where("name", LOGIN_SUCCEEDED)),
    ]);

    const months = new Set<string>([
      ...users.keys(),
      ...sites.keys(),
      ...projects.keys(),
      ...compatibilityEvaluations.keys(),
      ...logins.keys(),
    ]);

    return Array.from(months)
      .toSorted()
      .map((month) => ({
        month,
        usersCreated: users.get(month) ?? 0,
        sitesCreated: sites.get(month) ?? 0,
        projectsCreated: projects.get(month) ?? 0,
        compatibilityEvaluationsCreated: compatibilityEvaluations.get(month) ?? 0,
        logins: logins.get(month) ?? 0,
      }));
  }

  private async countRows(table: string): Promise<number> {
    const row = await this.sqlConnection(table).count<{ count: string | number }[]>("* as count");
    return Number(row[0]?.count ?? 0);
  }

  private async countByMonth(
    table: string,
    since: Date,
    filter: (qb: Knex.QueryBuilder) => Knex.QueryBuilder = (qb) => qb,
  ): Promise<Map<string, number>> {
    const rows = await filter(this.sqlConnection(table).where("created_at", ">=", since))
      .groupByRaw(MONTH_EXPRESSION)
      .select<MonthlyCountRow[]>(
        this.sqlConnection.raw(`${MONTH_EXPRESSION} as month`),
        this.sqlConnection.raw("count(*) as count"),
      );

    return new Map(rows.map((row) => [row.month, Number(row.count)]));
  }
}
