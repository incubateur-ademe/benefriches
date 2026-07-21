import { describe, expect, it } from "vitest";

import { UrbanProjectScheduleProjectionHandler } from "@/features/create-project/core/urban-project/step-handlers/schedule/schedule-projection/scheduleProjection.handler";

import { mockSiteData } from "../../_siteData.mock";

describe("Urban project creation - Steps - Schedule projection", () => {
  it("generates a default schedule including a reinstatement phase when involvesReinstatement is true", () => {
    const defaults = UrbanProjectScheduleProjectionHandler.getDefaultAnswers({
      answers: {
        URBAN_PROJECT_INVOLVES_REINSTATEMENT: {
          completed: true,
          payload: { involvesReinstatement: true },
        },
      },
      context: { siteData: mockSiteData },
    });

    expect(defaults?.reinstatementSchedule).toEqual({
      startDate: expect.any(String) as string,
      endDate: expect.any(String) as string,
    });
    expect(defaults?.installationSchedule).toEqual({
      startDate: expect.any(String) as string,
      endDate: expect.any(String) as string,
    });
    expect(defaults?.firstYearOfOperation).toEqual(expect.any(Number));
  });
});
