import { describe, expect, it } from "vitest";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { StoreBuilder } from "../../_testStoreHelpers";

const { previousStepRequested, stepCompletionRequested } = creationProjectFormUrbanActions;

describe("Urban project creation - Steps - Revenue expected site resale navigation", () => {
  it("should handle revenue navigation based on building and site resale decisions", () => {
    // Arrange
    const store = new StoreBuilder()
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          payload: { siteResaleSelection: "yes" },
          completed: true,
        },
        URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: {
          payload: { buildingsResalePlannedAfterDevelopment: false },
          completed: true,
        },
      })
      .withCurrentStep("URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE")
      .build();

    // Act — complete site resale revenue step
    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE",
        answers: { siteResaleExpectedSellingPrice: 1000000 },
      }),
    );

    // Assert — advances to buildings operations yearly revenues
    expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
      "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES",
    );

    // Act — go back
    store.dispatch(previousStepRequested());

    // Assert — returns to site resale revenue step
    expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
      "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE",
    );
  });
});
