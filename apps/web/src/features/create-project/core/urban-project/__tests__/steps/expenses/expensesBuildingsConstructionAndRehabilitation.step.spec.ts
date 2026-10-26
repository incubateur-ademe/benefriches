import { describe, expect, it } from "vitest";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { getCurrentStep, StoreBuilder } from "../../_testStoreHelpers";

const { stepCompletionRequested } = creationProjectFormUrbanActions;

describe("Urban project creation - Steps - Buildings construction and rehabilitation expenses", () => {
  it("goes to the revenue introduction when the developer builds and keeps the buildings", () => {
    const store = new StoreBuilder()
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_SPACES_SURFACE_AREA: {
          completed: true,
          payload: { spacesSurfaceAreaDistribution: { BUILDINGS: 2000, IMPERMEABLE_SOILS: 8000 } },
        },
        URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: {
          completed: true,
          payload: { buildingsResalePlannedAfterDevelopment: false },
        },
        URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER: {
          completed: true,
          payload: { developerWillBeBuildingsConstructor: true },
        },
      })
      .withCurrentStep("URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION")
      .build();

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION",
        answers: { buildingsConstructionWorks: 400000 },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_REVENUE_INTRODUCTION");
  });
});
