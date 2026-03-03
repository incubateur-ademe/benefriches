import { describe, expect, it } from "vitest";

import type { IDateProvider } from "../../../adapters/IDateProvider";
import {
  computeDefaultInstallationSchedule,
  computeDefaultReinstatementSchedule,
  getDefaultScheduleForProject,
} from "./worksSchedule";

const getDateProvider = (now: Date): IDateProvider => ({
  now: () => now,
});

describe("computeDefaultReinstatementSchedule", () => {
  it("returns a schedule starting 1.5 years from now with 1.5 year duration", () => {
    const dateProvider = getDateProvider(new Date("2025-01-01T13:00:00"));

    const result = computeDefaultReinstatementSchedule(dateProvider);

    expect(result).toEqual({
      startDate: new Date("2026-07-01T13:00:00"),
      endDate: new Date("2028-01-01T13:00:00"),
    });
  });
});

describe("computeDefaultInstallationSchedule", () => {
  it("returns a schedule starting the day after startFrom with 1 year duration", () => {
    const dateProvider = getDateProvider(new Date("2025-01-01T13:00:00"));
    const startFrom = new Date("2028-01-01T13:00:00");

    const result = computeDefaultInstallationSchedule(dateProvider)(startFrom);

    expect(result).toEqual({
      startDate: new Date("2028-01-02T13:00:00"),
      endDate: new Date("2029-01-02T13:00:00"),
    });
  });

  it("returns a schedule starting from now when no startFrom is provided", () => {
    const dateProvider = getDateProvider(new Date("2025-01-01T13:00:00"));

    const result = computeDefaultInstallationSchedule(dateProvider)();

    expect(result).toEqual({
      startDate: new Date("2025-01-01T13:00:00"),
      endDate: new Date("2026-01-01T13:00:00"),
    });
  });
});

describe("getDefaultScheduleForProject", () => {
  it("returns schedule with reinstatement when hasReinstatement is true", () => {
    const dateProvider = getDateProvider(new Date("2025-01-01T13:00:00"));

    const result = getDefaultScheduleForProject(dateProvider)({ hasReinstatement: true });

    expect(result).toEqual({
      reinstatement: {
        startDate: new Date("2026-07-01T13:00:00"),
        endDate: new Date("2028-01-01T13:00:00"),
      },
      installation: {
        startDate: new Date("2028-01-02T13:00:00"),
        endDate: new Date("2029-01-02T13:00:00"),
      },
      firstYearOfOperations: 2029,
    });
  });

  it("returns schedule without reinstatement when hasReinstatement is false", () => {
    const dateProvider = getDateProvider(new Date("2025-01-01T13:00:00"));

    const result = getDefaultScheduleForProject(dateProvider)({ hasReinstatement: false });

    expect(result).toEqual({
      reinstatement: undefined,
      installation: {
        startDate: new Date("2025-01-01T13:00:00"),
        endDate: new Date("2026-01-01T13:00:00"),
      },
      firstYearOfOperations: 2026,
    });
  });
});
