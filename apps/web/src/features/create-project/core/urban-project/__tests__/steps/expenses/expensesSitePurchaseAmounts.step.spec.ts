import { SiteNature } from "shared";
import { describe, expect, it } from "vitest";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { mockSiteData } from "../../_siteData.mock";
import { StoreBuilder } from "../../_testStoreHelpers";

const { previousStepRequested, stepCompletionRequested } = creationProjectFormUrbanActions;

const testScenarios = {
  withBuildingsAndContamination: mockSiteData,
  nonFriche: {
    ...mockSiteData,
    nature: "AGRICULTURAL_OPERATION" as SiteNature,
  },
};

describe("Urban project creation - Steps - Expenses site purchase amounts navigation", () => {
  it("should handle expenses navigation based on site nature", () => {
    // Arrange — friche with site/buildings resale selections already made
    const storeFriche = new StoreBuilder()
      .withSiteData(testScenarios.withBuildingsAndContamination)
      .withSteps({
        URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER: {
          completed: true,
          payload: { projectDeveloper: { name: "Test", structureType: "company" } },
        },
        URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER: {
          completed: true,
          payload: { reinstatementContractOwner: { name: "Test2", structureType: "company" } },
        },
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "yes" },
        },
        URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: {
          completed: true,
          payload: { buildingsResalePlannedAfterDevelopment: false },
        },
      })
      .withCurrentStep("URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS")
      .build();

    // Act / Assert — friche: site purchase amounts → reinstatement expenses, then back
    storeFriche.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS",
        answers: { sitePurchaseSellingPrice: 500000, sitePurchasePropertyTransferDuties: 50000 },
      }),
    );

    expect(storeFriche.getState().projectCreation.urbanProject.currentStep).toBe(
      "URBAN_PROJECT_EXPENSES_REINSTATEMENT",
    );

    storeFriche.dispatch(previousStepRequested());
    expect(storeFriche.getState().projectCreation.urbanProject.currentStep).toBe(
      "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS",
    );

    // Arrange — non-friche: no reinstatement step in sequence
    const storeNonFriche = new StoreBuilder()
      .withSiteData(testScenarios.nonFriche)
      .withCurrentStep("URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS")
      .build();

    // Act / Assert — non-friche: site purchase amounts → installation expenses (skips reinstatement)
    storeNonFriche.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS",
        answers: { sitePurchaseSellingPrice: 500000 },
      }),
    );

    expect(storeNonFriche.getState().projectCreation.urbanProject.currentStep).toBe(
      "URBAN_PROJECT_EXPENSES_INSTALLATION",
    );
  });
});
