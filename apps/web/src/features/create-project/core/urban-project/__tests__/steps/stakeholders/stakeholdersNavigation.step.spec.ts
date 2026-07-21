import { SiteNature } from "shared";
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

    // Act / Assert — non-friche: project developer completes → jumps straight to expenses introduction
    storeNonFriche.dispatch(nextStepRequested());
    storeNonFriche.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
        answers: { projectDeveloper: { name: "Test", structureType: "company" } },
      }),
    );

    expect(getCurrentStep(storeNonFriche)).toBe("URBAN_PROJECT_EXPENSES_INTRODUCTION");
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
});
