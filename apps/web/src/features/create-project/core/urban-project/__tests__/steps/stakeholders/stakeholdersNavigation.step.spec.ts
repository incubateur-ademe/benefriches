import type { SiteNature } from "shared";
import { describe, expect, it } from "vitest";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { mockSiteData } from "../../_siteData.mock";
import { getCurrentStep, StoreBuilder } from "../../_testStoreHelpers";

const { nextStepRequested, previousStepRequested, stepCompletionRequested } =
  creationProjectFormUrbanActions;

const testScenarios = {
  withBuildingsAndContamination: mockSiteData,
  nonFriche: {
    ...mockSiteData,
    nature: "AGRICULTURAL_OPERATION" as SiteNature,
  },
};

describe("Urban project creation - Steps - Stakeholders navigation", () => {
  it("should handle stakeholders navigation based on site nature", () => {
    // Arrange — friche site at stakeholders introduction
    const storeFriche = new StoreBuilder()
      .withSiteData(testScenarios.withBuildingsAndContamination)
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
      })
      .withCurrentStep("URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION")
      .build();

    // Act / Assert — friche: intro → project developer → reinstatement contract owner → back to project developer
    storeFriche.dispatch(nextStepRequested());
    expect(getCurrentStep(storeFriche)).toBe("URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER");

    storeFriche.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
        answers: { projectDeveloper: { name: "Test", structureType: "company" } },
      }),
    );
    expect(getCurrentStep(storeFriche)).toBe(
      "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
    );

    storeFriche.dispatch(previousStepRequested());
    expect(getCurrentStep(storeFriche)).toBe("URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER");

    // Arrange — non-friche site at stakeholders introduction
    const storeNonFriche = new StoreBuilder()
      .withSiteData(testScenarios.nonFriche)
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["PUBLIC_GREEN_SPACES"] },
        },
      })
      .withCurrentStep("URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION")
      .build();

    // Act / Assert — non-friche: project developer completes → jumps straight to the site resale introduction
    storeNonFriche.dispatch(nextStepRequested());
    storeNonFriche.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
        answers: { projectDeveloper: { name: "Test", structureType: "company" } },
      }),
    );

    expect(getCurrentStep(storeNonFriche)).toBe("URBAN_PROJECT_SITE_RESALE_INTRODUCTION");
  });

  it("should go back from reinstatement contract owner to buildings developer when new construction exists", () => {
    // Arrange
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
            spacesSurfaceAreaDistribution: { BUILDINGS: 3000, IMPERMEABLE_SOILS: 7000 },
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
      .withCurrentStep("URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER")
      .build();

    // Act
    store.dispatch(previousStepRequested());

    // Assert
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER");
  });

  it("goes from the reinstatement contract owner to the site resale introduction", () => {
    // Arrange
    const store = new StoreBuilder()
      .withSiteData(mockSiteData)
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
      })
      .withCurrentStep("URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER")
      .build();

    // Act
    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
        answers: { reinstatementContractOwner: { name: "Test", structureType: "company" } },
      }),
    );

    // Assert
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SITE_RESALE_INTRODUCTION");
  });

  it("goes from the buildings developer to the site resale introduction on a non-friche site", () => {
    // Arrange
    const store = new StoreBuilder()
      .withSiteData({ nature: "AGRICULTURAL_OPERATION" })
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
        URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
          completed: true,
          payload: { buildingsFootprintToReuse: 1000 },
        },
      })
      .withCurrentStep("URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER")
      .build();

    // Act
    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER",
        answers: { developerWillBeBuildingsConstructor: true },
      }),
    );

    // Assert
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SITE_RESALE_INTRODUCTION");
  });

  it("goes back from the stakeholders introduction to the soils carbon summary when the project and the site have no buildings", () => {
    // Arrange — non-friche, non-contaminated site without buildings
    const store = new StoreBuilder()
      .withSiteData({
        nature: "AGRICULTURAL_OPERATION",
        hasContaminatedSoils: false,
        contaminatedSoilSurface: 0,
        soilsDistribution: { PRAIRIE_GRASS: 6000, MINERAL_SOIL: 4000 },
      })
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["PUBLIC_GREEN_SPACES"] },
        },
      })
      .withCurrentStep("URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION")
      .build();

    // Act
    store.dispatch(previousStepRequested());

    // Assert
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SOILS_CARBON_SUMMARY");
  });

  it("goes back from the stakeholders introduction to the decontamination step on a contaminated site", () => {
    // Arrange
    const store = new StoreBuilder()
      .withSiteData({ ...mockSiteData, hasContaminatedSoils: true, contaminatedSoilSurface: 2000 })
      .withSteps({
        URBAN_PROJECT_SOILS_DECONTAMINATION: {
          completed: true,
          payload: { decontaminationPlan: "none", decontaminatedSurfaceArea: 0 },
        },
      })
      .withCurrentStep("URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION")
      .build();

    // Act
    store.dispatch(previousStepRequested());

    // Assert
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SOILS_DECONTAMINATION");
  });

  it("goes back from the stakeholders introduction to involves reinstatement on a non-contaminated friche", () => {
    // Arrange
    const store = new StoreBuilder()
      .withSiteData({ ...mockSiteData, hasContaminatedSoils: false })
      .withSteps({
        URBAN_PROJECT_INVOLVES_REINSTATEMENT: {
          completed: true,
          payload: { involvesReinstatement: false },
        },
      })
      .withCurrentStep("URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION")
      .build();

    // Act
    store.dispatch(previousStepRequested());

    // Assert
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_INVOLVES_REINSTATEMENT");
  });

  it("goes back from the stakeholders introduction to the last buildings step on a non-friche, non-contaminated site", () => {
    // Arrange — 2000 m2 of site buildings, all demolished, 3000 m2 of new construction
    const store = new StoreBuilder()
      .withSiteData({
        nature: "AGRICULTURAL_OPERATION",
        hasContaminatedSoils: false,
        contaminatedSoilSurface: 0,
        soilsDistribution: { BUILDINGS: 2000, IMPERMEABLE_SOILS: 8000 },
      })
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
        URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
          completed: true,
          payload: { buildingsFootprintToReuse: 0 },
        },
      })
      .withCurrentStep("URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION")
      .build();

    // Act
    store.dispatch(previousStepRequested());

    // Assert
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INFO");
  });
});
