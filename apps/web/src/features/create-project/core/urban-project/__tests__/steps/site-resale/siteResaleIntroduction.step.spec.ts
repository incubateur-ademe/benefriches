import { describe, expect, it } from "vitest";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { mockSiteData } from "../../_siteData.mock";
import { StoreBuilder } from "../../_testStoreHelpers";

const { previousStepRequested } = creationProjectFormUrbanActions;

const testScenarios = {
  withBuildingsAndContamination: mockSiteData,
  withoutContamination: {
    ...mockSiteData,
    hasContaminatedSoils: false,
  },
};

describe("Urban project creation - Steps - Site resale introduction navigation", () => {
  it("should go back from site resale introduction to involves reinstatement step when involvesReinstatement is false", () => {
    // Arrange — non-contaminated friche, reinstatement declined, multiple building use steps completed
    const store = new StoreBuilder()
      .withSiteData(testScenarios.withoutContamination)
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL", "OFFICES"] },
        },
        URBAN_PROJECT_SPACES_SURFACE_AREA: {
          completed: true,
          payload: {
            spacesSurfaceAreaDistribution: { BUILDINGS: 3000, IMPERMEABLE_SOILS: 7000 },
          },
        },
        URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
          completed: true,
          payload: { buildingsFootprintToReuse: 2000 },
        },
        URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: {
            existingBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 1600, OFFICES: 400 },
          },
        },
        URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: {
            newBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 800, OFFICES: 200 },
          },
        },
        URBAN_PROJECT_INVOLVES_REINSTATEMENT: {
          completed: true,
          payload: { involvesReinstatement: false },
        },
      })
      .withCurrentStep("URBAN_PROJECT_SITE_RESALE_INTRODUCTION")
      .build();

    // Act
    store.dispatch(previousStepRequested());

    // Assert
    expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
      "URBAN_PROJECT_INVOLVES_REINSTATEMENT",
    );
  });

  it("should go back from site resale introduction to decontamination surface area on a contaminated friche even when involvesReinstatement is false", () => {
    // Arrange — contaminated friche, reinstatement declined but decontamination steps completed
    const store = new StoreBuilder()
      .withSiteData(testScenarios.withBuildingsAndContamination)
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_INVOLVES_REINSTATEMENT: {
          completed: true,
          payload: { involvesReinstatement: false },
        },
        URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: {
          completed: true,
          payload: { decontaminationPlan: "partial" },
        },
        URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA: {
          completed: true,
          payload: { decontaminatedSurfaceArea: 1500 },
        },
      })
      .withCurrentStep("URBAN_PROJECT_SITE_RESALE_INTRODUCTION")
      .build();

    // Act
    store.dispatch(previousStepRequested());

    // Assert — decontamination overrides reinstatement as back target when contamination exists
    expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
      "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",
    );
  });
});
