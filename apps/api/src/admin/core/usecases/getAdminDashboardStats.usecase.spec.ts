import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { AdminMonthlyStats, GetAdminDashboardStatsResponseDto } from "shared";

import { InMemoryAdminStatsQuery } from "src/admin/adapters/secondary/InMemoryAdminStatsQuery";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import type { SuccessResult } from "src/shared-kernel/result";

import { GetAdminDashboardStatsUseCase } from "./getAdminDashboardStats.usecase";

const emptyMonth = (month: string): AdminMonthlyStats => ({
  month,
  usersCreated: 0,
  sitesCreated: 0,
  projectsCreated: 0,
  compatibilityEvaluationsCreated: 0,
  logins: 0,
});

describe("GetAdminDashboardStats UseCase", () => {
  it("returns totals and the last 12 months, filling months without activity with zeros", async () => {
    const adminStatsQuery = new InMemoryAdminStatsQuery();
    adminStatsQuery._setTotals({ users: 42, sites: 17, projects: 9, compatibilityEvaluations: 3 });
    adminStatsQuery._setMonthlyStats([
      // older than 12 months: must be ignored
      {
        month: "2025-03",
        usersCreated: 99,
        sitesCreated: 99,
        projectsCreated: 99,
        compatibilityEvaluationsCreated: 99,
        logins: 99,
      },
      {
        month: "2025-10",
        usersCreated: 5,
        sitesCreated: 2,
        projectsCreated: 1,
        compatibilityEvaluationsCreated: 0,
        logins: 12,
      },
      {
        month: "2026-03",
        usersCreated: 1,
        sitesCreated: 0,
        projectsCreated: 0,
        compatibilityEvaluationsCreated: 2,
        logins: 4,
      },
    ]);
    const dateProvider = new DeterministicDateProvider(new Date("2026-03-15T10:00:00.000Z"));
    const usecase = new GetAdminDashboardStatsUseCase(adminStatsQuery, dateProvider);

    const result = await usecase.execute();

    assert.strictEqual(result.isSuccess(), true);
    assert.deepStrictEqual((result as SuccessResult<GetAdminDashboardStatsResponseDto>).getData(), {
      totals: { users: 42, sites: 17, projects: 9, compatibilityEvaluations: 3 },
      currentMonth: {
        month: "2026-03",
        usersCreated: 1,
        sitesCreated: 0,
        projectsCreated: 0,
        compatibilityEvaluationsCreated: 2,
        logins: 4,
      },
      monthly: [
        emptyMonth("2025-04"),
        emptyMonth("2025-05"),
        emptyMonth("2025-06"),
        emptyMonth("2025-07"),
        emptyMonth("2025-08"),
        emptyMonth("2025-09"),
        {
          month: "2025-10",
          usersCreated: 5,
          sitesCreated: 2,
          projectsCreated: 1,
          compatibilityEvaluationsCreated: 0,
          logins: 12,
        },
        emptyMonth("2025-11"),
        emptyMonth("2025-12"),
        emptyMonth("2026-01"),
        emptyMonth("2026-02"),
        {
          month: "2026-03",
          usersCreated: 1,
          sitesCreated: 0,
          projectsCreated: 0,
          compatibilityEvaluationsCreated: 2,
          logins: 4,
        },
      ],
    });
  });

  it("uses an empty current month when there is no activity at all", async () => {
    const adminStatsQuery = new InMemoryAdminStatsQuery();
    adminStatsQuery._setTotals({ users: 0, sites: 0, projects: 0, compatibilityEvaluations: 0 });
    adminStatsQuery._setMonthlyStats([]);
    const dateProvider = new DeterministicDateProvider(new Date("2026-01-01T00:00:00.000Z"));
    const usecase = new GetAdminDashboardStatsUseCase(adminStatsQuery, dateProvider);

    const result = await usecase.execute();

    assert.strictEqual(result.isSuccess(), true);
    const data = (result as SuccessResult<GetAdminDashboardStatsResponseDto>).getData();
    assert.deepStrictEqual(data.currentMonth, emptyMonth("2026-01"));
    assert.strictEqual(data.monthly.length, 12);
    assert.deepStrictEqual(data.monthly[0], emptyMonth("2025-02"));
    assert.deepStrictEqual(data.monthly[11], emptyMonth("2026-01"));
  });
});
