import { describe, expect, it } from "vitest";

import { Schedule } from "@/features/create-project/core/project.types";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { mockSiteData } from "../../_siteData.mock";
import { StoreBuilder } from "../../_testStoreHelpers";

const { stepNavigationRequested } = creationProjectFormUrbanActions;

describe("Urban project creation - Steps - Schedule projection", () => {
  it("should generate default schedule including reinstatement when involvesReinstatement is true", () => {
    // Arrange
    const store = new StoreBuilder()
      .withSteps({
        URBAN_PROJECT_INVOLVES_REINSTATEMENT: {
          completed: true,
          payload: { involvesReinstatement: true },
        },
      })
      .build();

    // Act
    store.dispatch(stepNavigationRequested({ stepId: "URBAN_PROJECT_SCHEDULE_PROJECTION" }));

    // Assert
    const step =
      store.getState().projectCreation.urbanProject.steps.URBAN_PROJECT_SCHEDULE_PROJECTION;
    expect(step).toEqual({
      completed: false,
      payload: undefined,
      defaultValues: {
        installationSchedule: expect.objectContaining({
          startDate: expect.any(String) as string,
          endDate: expect.any(String) as string,
        }) as Schedule,
        firstYearOfOperation: expect.any(Number) as number,
        reinstatementSchedule: expect.objectContaining({
          startDate: expect.any(String) as string,
          endDate: expect.any(String) as string,
        }) as Schedule,
      },
    });
  });

  it("should not generate a reinstatement schedule for non-FRICHE sites", () => {
    // Arrange
    const store = new StoreBuilder()
      .withSiteData({ ...mockSiteData, nature: "AGRICULTURAL_OPERATION" })
      .build();

    // Act
    store.dispatch(stepNavigationRequested({ stepId: "URBAN_PROJECT_SCHEDULE_PROJECTION" }));

    // Assert
    const step =
      store.getState().projectCreation.urbanProject.steps.URBAN_PROJECT_SCHEDULE_PROJECTION;
    expect(step?.payload?.reinstatementSchedule).toBeUndefined();
    expect(step?.defaultValues?.installationSchedule).toBeDefined();
  });
});
