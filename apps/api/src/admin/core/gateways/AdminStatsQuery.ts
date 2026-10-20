import type { AdminMonthlyStats } from "shared";

export type AdminTotals = {
  users: number;
  sites: number;
  projects: number;
  compatibilityEvaluations: number;
};

export type AdminMonthlyMetric = Exclude<keyof AdminMonthlyStats, "month">;

// month is "YYYY-MM" (UTC)
export type MonthlyCount = { month: string; count: number };

export type AdminMonthlyCounts = Record<AdminMonthlyMetric, MonthlyCount[]>;

export interface AdminStatsQuery {
  getTotals(): Promise<AdminTotals>;
  // per-metric counts for months with at least one row since `since` (inclusive), unordered
  getMonthlyCounts(since: Date): Promise<AdminMonthlyCounts>;
}
