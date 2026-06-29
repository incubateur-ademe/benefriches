import { SiteNature } from "shared";
import { describe, expect, it } from "vitest";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { mockSiteData } from "../../_siteData.mock";
import { StoreBuilder } from "../../_testStoreHelpers";

const { previousStepRequested } = creationProjectFormUrbanActions;

describe("Urban project creation - Steps - Expenses introduction navigation", () => {
  it("should go back from expenses introduction to buildings developer on non-friche site with new construction", () => {
    // Arrange
    const store = new StoreBuilder()
      .withSiteData({
        ...mockSiteData,
        nature: "AGRICULTURAL_OPERATION" as SiteNature,
      })
      .withSteps({
        URBAN_PROJECT_SPACES_SURFACE_AREA: {
          completed: true,
          payload: {
            spacesSurfaceAreaDistribution: { BUILDINGS: 3000 },
          },
        },
        URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
          completed: true,
          payload: { buildingsFootprintToReuse: 1000 },
        },
        URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER: {
          completed: true,
          payload: { projectDeveloper: { name: "Test", structureType: "company" } },
        },
        URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER: {
          completed: true,
          payload: { developerWillBeBuildingsConstructor: true },
        },
      })
      .withCurrentStep("URBAN_PROJECT_EXPENSES_INTRODUCTION")
      .build();

    // Act
    store.dispatch(previousStepRequested());

    // Assert
    expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
      "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER",
    );
  });
});
