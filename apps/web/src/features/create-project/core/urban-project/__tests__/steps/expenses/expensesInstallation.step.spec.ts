import { describe, expect, it } from "vitest";

import { UrbanProjectInstallationExpensesHandler } from "@/features/create-project/core/urban-project/step-handlers/expenses/expenses-installation/expensesInstallation.handler";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { mockSiteData } from "../../_siteData.mock";
import { getCurrentStep, StoreBuilder } from "../../_testStoreHelpers";

const { stepCompletionRequested } = creationProjectFormUrbanActions;

describe("Urban project creation - Steps - Installation expenses", () => {
  it("computes default installation expenses (development works, technical studies, other) from the site surface area", () => {
    const defaults = UrbanProjectInstallationExpensesHandler.getDefaultAnswers({
      answers: {},
      context: { siteData: mockSiteData },
    });

    expect(defaults?.installationExpenses).toEqual([
      { purpose: "development_works", amount: expect.any(Number) as number },
      { purpose: "technical_studies", amount: expect.any(Number) as number },
      { purpose: "other", amount: expect.any(Number) as number },
    ]);
  });

  it("goes to the revenue introduction when the developer does not build and keeps the buildings", () => {
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
          payload: { developerWillBeBuildingsConstructor: false },
        },
        URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
          completed: true,
          payload: { buildingsFootprintToReuse: 0 },
        },
      })
      .withCurrentStep("URBAN_PROJECT_EXPENSES_INSTALLATION")
      .build();

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_EXPENSES_INSTALLATION",
        answers: { installationExpenses: [{ purpose: "development_works", amount: 800000 }] },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_REVENUE_INTRODUCTION");
  });
});
