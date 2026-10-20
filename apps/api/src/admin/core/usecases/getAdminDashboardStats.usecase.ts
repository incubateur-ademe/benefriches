import type { AdminMonthlyStats, GetAdminDashboardStatsResponseDto } from "shared";

import type { DateProvider } from "src/shared-kernel/dateProvider";
import { success, type TResult } from "src/shared-kernel/result";
import type { UseCase } from "src/shared-kernel/usecase";

import type { AdminMonthlyMetric, AdminStatsQuery } from "../gateways/AdminStatsQuery";

const MONTHS_OF_HISTORY = 12;

const emptyMonth = (month: string): AdminMonthlyStats => ({
  month,
  usersCreated: 0,
  sitesCreated: 0,
  projectsCreated: 0,
  compatibilityEvaluationsCreated: 0,
  logins: 0,
});

const formatMonth = (date: Date): string =>
  `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;

// first day (UTC) of the month `monthsAgo` months before `date`
const startOfUtcMonth = (date: Date, monthsAgo: number): Date =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() - monthsAgo, 1));

export class GetAdminDashboardStatsUseCase implements UseCase<
  void,
  TResult<GetAdminDashboardStatsResponseDto>
> {
  private readonly adminStatsQuery: AdminStatsQuery;
  private readonly dateProvider: DateProvider;

  constructor(adminStatsQuery: AdminStatsQuery, dateProvider: DateProvider) {
    this.adminStatsQuery = adminStatsQuery;
    this.dateProvider = dateProvider;
  }

  async execute(): Promise<TResult<GetAdminDashboardStatsResponseDto>> {
    const now = this.dateProvider.now();
    const since = startOfUtcMonth(now, MONTHS_OF_HISTORY - 1);

    const [totals, monthlyCounts] = await Promise.all([
      this.adminStatsQuery.getTotals(),
      this.adminStatsQuery.getMonthlyCounts(since),
    ]);

    // every month of the period, oldest first, even with no activity
    const monthsOfPeriod = new Map<string, AdminMonthlyStats>();
    for (let i = MONTHS_OF_HISTORY - 1; i >= 0; i--) {
      const month = formatMonth(startOfUtcMonth(now, i));
      monthsOfPeriod.set(month, emptyMonth(month));
    }

    for (const metric of Object.keys(monthlyCounts) as AdminMonthlyMetric[]) {
      for (const { month, count } of monthlyCounts[metric]) {
        const entry = monthsOfPeriod.get(month);
        if (entry) entry[metric] = count;
      }
    }

    const monthly = Array.from(monthsOfPeriod.values());
    const currentMonth = monthly[monthly.length - 1] ?? emptyMonth(formatMonth(now));

    return success({ totals, currentMonth, monthly });
  }
}
