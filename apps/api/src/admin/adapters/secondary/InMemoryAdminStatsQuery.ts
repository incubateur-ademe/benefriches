import type {
  AdminMonthlyCounts,
  AdminStatsQuery,
  AdminTotals,
  MonthlyCount,
} from "src/admin/core/gateways/AdminStatsQuery";

export class InMemoryAdminStatsQuery implements AdminStatsQuery {
  private totals: AdminTotals = { users: 0, sites: 0, projects: 0, compatibilityEvaluations: 0 };
  private monthlyCounts: AdminMonthlyCounts = {
    usersCreated: [],
    sitesCreated: [],
    projectsCreated: [],
    compatibilityEvaluationsCreated: [],
    logins: [],
  };

  _setTotals(totals: AdminTotals): void {
    this.totals = totals;
  }

  _setMonthlyCounts(monthlyCounts: AdminMonthlyCounts): void {
    this.monthlyCounts = monthlyCounts;
  }

  getTotals(): Promise<AdminTotals> {
    return Promise.resolve(this.totals);
  }

  getMonthlyCounts(since: Date): Promise<AdminMonthlyCounts> {
    const sinceMonth = `${since.getUTCFullYear()}-${String(since.getUTCMonth() + 1).padStart(2, "0")}`;
    const { usersCreated, sitesCreated, projectsCreated, compatibilityEvaluationsCreated, logins } =
      this.monthlyCounts;
    const keepSince = (counts: MonthlyCount[]) => counts.filter(({ month }) => month >= sinceMonth);

    return Promise.resolve({
      usersCreated: keepSince(usersCreated),
      sitesCreated: keepSince(sitesCreated),
      projectsCreated: keepSince(projectsCreated),
      compatibilityEvaluationsCreated: keepSince(compatibilityEvaluationsCreated),
      logins: keepSince(logins),
    });
  }
}
