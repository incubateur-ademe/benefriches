import type { AdminMonthlyStats } from "shared";

export type AdminTotals = {
  users: number;
  sites: number;
  projects: number;
  compatibilityEvaluations: number;
};

export interface AdminStatsQuery {
  getTotals(): Promise<AdminTotals>;
  // one entry per month, oldest first, from `since` (inclusive) to the current month (inclusive)
  getMonthlyStats(since: Date): Promise<AdminMonthlyStats[]>;
}
