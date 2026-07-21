import { sumListWithKey } from "shared";
import { describe, expect, it } from "vitest";

import { UrbanProjectReinstatementExpensesHandler } from "@/features/create-project/core/urban-project/step-handlers/expenses/expenses-reinstatement/expensesReinstatement.handler";

import { mockSiteData } from "../../_siteData.mock";

describe("Urban project creation - Steps - Reinstatement expenses", () => {
  it("computes default reinstatement expenses with a positive total from the project soil distribution", () => {
    const defaults = UrbanProjectReinstatementExpensesHandler.getDefaultAnswers({
      answers: {
        URBAN_PROJECT_SPACES_SURFACE_AREA: {
          completed: true,
          payload: {
            spacesSurfaceAreaDistribution: {
              BUILDINGS: 2000,
              IMPERMEABLE_SOILS: 4000,
              MINERAL_SOIL: 2500,
              ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 1500,
            },
          },
        },
      },
      context: { siteData: mockSiteData },
    });

    const expenses = defaults?.reinstatementExpenses ?? [];
    expect(expenses.length).toBeGreaterThan(0);
    expect(sumListWithKey(expenses, "amount")).toBeGreaterThan(0);
  });
});
