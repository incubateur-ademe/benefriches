import { describe, expect, it } from "vitest";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { mockSiteData } from "../../_siteData.mock";
import { getCurrentStep, StoreBuilder } from "../../_testStoreHelpers";

const { previousStepRequested } = creationProjectFormUrbanActions;

describe("Urban project creation - Steps - Expenses introduction navigation", () => {
  it("goes back to the buildings resale selection when the project has buildings", () => {
    // Arrange
    const store = new StoreBuilder()
      .withSiteData(mockSiteData)
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_SPACES_SURFACE_AREA: {
          completed: true,
          payload: {
            spacesSurfaceAreaDistribution: { BUILDINGS: 3000, IMPERMEABLE_SOILS: 7000 },
          },
        },
      })
      .withCurrentStep("URBAN_PROJECT_EXPENSES_INTRODUCTION")
      .build();

    // Act
    store.dispatch(previousStepRequested());

    // Assert
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_RESALE_SELECTION");
  });

  it("goes back to the site resale selection when the buildings footprint is 0", () => {
    // Arrange
    const store = new StoreBuilder()
      .withSiteData(mockSiteData)
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_SPACES_SURFACE_AREA: {
          completed: true,
          payload: { spacesSurfaceAreaDistribution: { BUILDINGS: 0, IMPERMEABLE_SOILS: 10000 } },
        },
      })
      .withCurrentStep("URBAN_PROJECT_EXPENSES_INTRODUCTION")
      .build();

    // Act
    store.dispatch(previousStepRequested());

    // Assert
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SITE_RESALE_SELECTION");
  });
});
