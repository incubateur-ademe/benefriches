import { StoreBuilder } from "../../../__tests__/creation-steps/testUtils";
import { selectYearlyIncomeFormViewData } from "../siteManagement.selectors";

describe("incomes ViewData selectors", () => {
  describe("selectYearlyIncomeFormViewData", () => {
    it("returns incomes in store and estimated income amounts for agricultural operation", () => {
      const state = new StoreBuilder()
        .withCreationData({
          nature: "AGRICULTURAL_OPERATION",
          agriculturalOperationActivity: "CEREALS_AND_OILSEEDS_CULTIVATION",
          surfaceArea: 50000,
          isSiteOperated: true,
          yearlyIncomes: [
            { source: "operations", amount: 10000 },
            { source: "other", amount: 2000 },
          ],
        })
        .build()
        .getState();

      const viewData = selectYearlyIncomeFormViewData(state);

      expect(viewData.incomesInStore).toEqual([
        { source: "operations", amount: 10000 },
        { source: "other", amount: 2000 },
      ]);
      expect(viewData.estimatedIncomeAmounts.length).toBeGreaterThan(0);
    });

    it("returns empty estimated income amounts for non-agricultural sites", () => {
      const state = new StoreBuilder()
        .withCreationData({
          nature: "FRICHE",
          surfaceArea: 50000,
          yearlyIncomes: [],
        })
        .build()
        .getState();

      const viewData = selectYearlyIncomeFormViewData(state);

      expect(viewData).toEqual({
        incomesInStore: [],
        estimatedIncomeAmounts: [],
      });
    });
  });
});
