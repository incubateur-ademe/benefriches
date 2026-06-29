import { SiteNature } from "shared";
import { describe, expect, it } from "vitest";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { mockSiteData } from "../../_siteData.mock";
import { StoreBuilder } from "../../_testStoreHelpers";

const { previousStepRequested } = creationProjectFormUrbanActions;

const testScenarios = {
  withBuildingsAndContamination: mockSiteData,
  nonFriche: {
    ...mockSiteData,
    nature: "AGRICULTURAL_OPERATION" as SiteNature,
  },
};

describe("Urban project creation - Steps - Soils decontamination introduction navigation", () => {
  it("should go back from decontamination introduction to involves reinstatement step", () => {
    // Arrange — contaminated friche with building steps completed
    const store = new StoreBuilder()
      .withSiteData(testScenarios.withBuildingsAndContamination)
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_SPACES_SURFACE_AREA: {
          completed: true,
          payload: {
            spacesSurfaceAreaDistribution: { BUILDINGS: 1500, IMPERMEABLE_SOILS: 8500 },
          },
        },
        URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
          completed: true,
          payload: { buildingsFootprintToReuse: 1500 },
        },
      })
      .withCurrentStep("URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION")
      .build();

    // Act
    store.dispatch(previousStepRequested());

    // Assert
    expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
      "URBAN_PROJECT_INVOLVES_REINSTATEMENT",
    );
  });

  it("should go back from decontamination introduction to soils carbon summary on a non-friche contaminated site without buildings", () => {
    // Arrange — non-friche with contaminated soils but no buildings in uses
    const store = new StoreBuilder()
      .withSiteData({
        nature: "AGRICULTURAL_OPERATION",
        hasContaminatedSoils: true,
        contaminatedSoilSurface: 2000,
        soilsDistribution: { MINERAL_SOIL: 5000, PRAIRIE_GRASS: 5000 },
      })
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["OTHER_PUBLIC_SPACES"] },
        },
      })
      .withCurrentStep("URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION")
      .build();

    // Act
    store.dispatch(previousStepRequested());

    // Assert — no buildings chapter means carbon summary is the previous step
    expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
      "URBAN_PROJECT_SOILS_CARBON_SUMMARY",
    );
  });

  it("should go back from decontamination introduction to the last buildings step on a non-friche contaminated site with buildings", () => {
    // Arrange — non-friche with contaminated soils and buildings in uses
    const store = new StoreBuilder()
      .withSiteData(testScenarios.nonFriche)
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_SPACES_SURFACE_AREA: {
          completed: true,
          payload: { spacesSurfaceAreaDistribution: { BUILDINGS: 2000 } },
        },
        URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
          completed: true,
          payload: { buildingsFootprintToReuse: 2000 },
        },
      })
      .withCurrentStep("URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION")
      .build();

    // Act
    store.dispatch(previousStepRequested());

    // Assert — buildings chapter present means last buildings step is the previous step
    expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
      "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE",
    );
  });
});
