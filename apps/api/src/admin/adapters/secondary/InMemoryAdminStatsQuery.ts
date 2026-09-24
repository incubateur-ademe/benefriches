import type { AdminMonthlyStats } from "shared";

import type { AdminStatsQuery, AdminTotals } from "src/admin/core/gateways/AdminStatsQuery";

export class InMemoryAdminStatsQuery implements AdminStatsQuery {
  private totals: AdminTotals = { users: 0, sites: 0, projects: 0, compatibilityEvaluations: 0 };
  private monthlyStats: AdminMonthlyStats[] = [];

  _setTotals(totals: AdminTotals): void {
    this.totals = totals;
  }

  _setMonthlyStats(monthlyStats: AdminMonthlyStats[]): void {
    this.monthlyStats = monthlyStats;
  }

  getTotals(): Promise<AdminTotals> {
    return Promise.resolve(this.totals);
  }

  getMonthlyStats(since: Date): Promise<AdminMonthlyStats[]> {
    const sinceMonth = `${since.getUTCFullYear()}-${String(since.getUTCMonth() + 1).padStart(2, "0")}`;
    return Promise.resolve(this.monthlyStats.filter((stats) => stats.month >= sinceMonth));
  }
}
