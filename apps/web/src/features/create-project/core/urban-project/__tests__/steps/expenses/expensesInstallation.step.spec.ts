import { describe, expect, it } from "vitest";

import { UrbanProjectInstallationExpensesHandler } from "@/features/create-project/core/urban-project/step-handlers/expenses/expenses-installation/expensesInstallation.handler";

import { mockSiteData } from "../../_siteData.mock";

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
});
