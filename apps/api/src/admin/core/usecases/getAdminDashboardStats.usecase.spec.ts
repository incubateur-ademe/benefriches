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
    adminStatsQuery._setMonthlyCounts({
      // "2025-03" is older than 12 months: must be ignored
      usersCreated: [
        { month: "2025-03", count: 99 },
        { month: "2025-10", count: 5 },
        { month: "2026-03", count: 1 },
      ],
      sitesCreated: [
        { month: "2025-03", count: 99 },
        { month: "2025-10", count: 2 },
      ],
      projectsCreated: [
        { month: "2025-03", count: 99 },
        { month: "2025-10", count: 1 },
      ],
      compatibilityEvaluationsCreated: [
        { month: "2025-03", count: 99 },
        { month: "2026-03", count: 2 },
      ],
      logins: [
        { month: "2025-03", count: 99 },
        { month: "2025-10", count: 12 },
        { month: "2026-03", count: 4 },
      ],
    });
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

  it("returns the months of the period in chronological order whatever the order of the counts", async () => {
    const adminStatsQuery = new InMemoryAdminStatsQuery();
    adminStatsQuery._setTotals({ users: 0, sites: 0, projects: 0, compatibilityEvaluations: 0 });
    adminStatsQuery._setMonthlyCounts({
      usersCreated: [
        { month: "2026-03", count: 3 },
        { month: "2025-11", count: 1 },
        { month: "2026-01", count: 2 },
      ],
      sitesCreated: [],
      projectsCreated: [],
      compatibilityEvaluationsCreated: [],
      logins: [],
    });
    const dateProvider = new DeterministicDateProvider(new Date("2026-03-15T10:00:00.000Z"));
    const usecase = new GetAdminDashboardStatsUseCase(adminStatsQuery, dateProvider);

    const result = await usecase.execute();

    assert.strictEqual(result.isSuccess(), true);
    const data = (result as SuccessResult<GetAdminDashboardStatsResponseDto>).getData();
    assert.deepStrictEqual(data.monthly, [
      emptyMonth("2025-04"),
      emptyMonth("2025-05"),
      emptyMonth("2025-06"),
      emptyMonth("2025-07"),
      emptyMonth("2025-08"),
      emptyMonth("2025-09"),
      emptyMonth("2025-10"),
      { ...emptyMonth("2025-11"), usersCreated: 1 },
      emptyMonth("2025-12"),
      { ...emptyMonth("2026-01"), usersCreated: 2 },
      emptyMonth("2026-02"),
      { ...emptyMonth("2026-03"), usersCreated: 3 },
    ] satisfies AdminMonthlyStats[]);
  });

  it("merges metrics that have data in different months into the same month entries", async () => {
    const adminStatsQuery = new InMemoryAdminStatsQuery();
    adminStatsQuery._setTotals({ users: 0, sites: 0, projects: 0, compatibilityEvaluations: 0 });
    adminStatsQuery._setMonthlyCounts({
      usersCreated: [{ month: "2026-02", count: 2 }],
      sitesCreated: [
        { month: "2026-02", count: 1 },
        { month: "2026-03", count: 4 },
      ],
      projectsCreated: [{ month: "2026-03", count: 5 }],
      compatibilityEvaluationsCreated: [{ month: "2026-01", count: 6 }],
      logins: [
        { month: "2026-02", count: 7 },
        { month: "2026-03", count: 8 },
      ],
    });
    const dateProvider = new DeterministicDateProvider(new Date("2026-03-15T10:00:00.000Z"));
    const usecase = new GetAdminDashboardStatsUseCase(adminStatsQuery, dateProvider);

    const result = await usecase.execute();

    assert.strictEqual(result.isSuccess(), true);
    const data = (result as SuccessResult<GetAdminDashboardStatsResponseDto>).getData();
    assert.strictEqual(data.monthly.length, 12);
    assert.deepStrictEqual(data.monthly.slice(-3), [
      {
        month: "2026-01",
        usersCreated: 0,
        sitesCreated: 0,
        projectsCreated: 0,
        compatibilityEvaluationsCreated: 6,
        logins: 0,
      },
      {
        month: "2026-02",
        usersCreated: 2,
        sitesCreated: 1,
        projectsCreated: 0,
        compatibilityEvaluationsCreated: 0,
        logins: 7,
      },
      {
        month: "2026-03",
        usersCreated: 0,
        sitesCreated: 4,
        projectsCreated: 5,
        compatibilityEvaluationsCreated: 0,
        logins: 8,
      },
    ] satisfies AdminMonthlyStats[]);
  });

  it("uses an empty current month when there is no activity at all", async () => {
    const adminStatsQuery = new InMemoryAdminStatsQuery();
    adminStatsQuery._setTotals({ users: 0, sites: 0, projects: 0, compatibilityEvaluations: 0 });
    adminStatsQuery._setMonthlyCounts({
      usersCreated: [],
      sitesCreated: [],
      projectsCreated: [],
      compatibilityEvaluationsCreated: [],
      logins: [],
    });
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
